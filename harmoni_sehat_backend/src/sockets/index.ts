import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { CORS_ORIGINS } from '../config/env';
import { verifyAccessToken } from '../middlewares/protect';
import { actorFromUser, Actor } from '../utils/actor';
import Consultation from '../models/Consultation';
import ChatMessage from '../models/ChatMessage';
import Dokter from '../models/Dokter';
import Pasien from '../models/Pasien';
import { asSystem } from '../utils/requestContext';
import { notify } from '../services/notify';

let io: Server | null = null;

/** Active 1:1 calls keyed by consultation id. In-memory: a call never outlives its sockets. */
interface CallState { initiator: string; video: boolean; state: 'ringing' | 'active'; }
export const calls = new Map<string, CallState>();
export const getIO = () => io;

const CHAT_STATUSES = ['scheduled', 'ongoing'];

/** Returns the consultation if the actor is a participant, otherwise null. */
export const findParticipantConsultation = async (consultationId: string, actor: Actor) => {
  const c = await asSystem(() => Consultation.findById(consultationId));
  if (!c) return null;
  if (actor.role === 'pasien' && c.pasien_id === actor.profileId) return c;
  if (actor.role === 'dokter' && c.dokter_id === actor.profileId) return c;
  return null;
};

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: { origin: CORS_ORIGINS.includes('*') ? true : CORS_ORIGINS, methods: ['GET', 'POST'] },
    maxHttpBufferSize: 1e6,
  });

  io.use(async (socket, next) => {
    try {
      const token = (socket.handshake.auth?.token as string) || '';
      if (!token) return next(new Error('unauthorized'));
      const { user, roleName } = await verifyAccessToken(token);
      const actor = await actorFromUser(user, roleName);
      (socket.data as any).actor = actor;
      next();
    } catch {
      next(new Error('unauthorized'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const actor = (socket.data as any).actor as Actor;
    socket.join(`user:${actor.userId}`);

    socket.on('chat:join', async (payload: { konsultasiId: string }, ack?: (r: any) => void) => {
      try {
        const c = await findParticipantConsultation(payload?.konsultasiId, actor);
        if (!c) return ack?.({ ok: false, error: 'forbidden' });
        socket.join(`consultation:${c._id}`);
        ack?.({ ok: true, status: c.status });
      } catch {
        ack?.({ ok: false, error: 'error' });
      }
    });

    socket.on(
      'chat:send',
      async (
        payload: { konsultasiId: string; isi: string; tipe?: 'text' | 'image' | 'file'; file_url?: string },
        ack?: (r: any) => void,
      ) => {
        try {
          const c = await findParticipantConsultation(payload?.konsultasiId, actor);
          if (!c) return ack?.({ ok: false, error: 'forbidden' });
          if (!CHAT_STATUSES.includes(c.status)) return ack?.({ ok: false, error: 'consultation_not_active' });
          const isi = String(payload.isi ?? '').trim().slice(0, 4000);
          if (!isi) return ack?.({ ok: false, error: 'empty' });
          const tipe = ['text', 'image', 'file'].includes(payload.tipe as string) ? payload.tipe : 'text';

          const msg = await asSystem(() =>
            ChatMessage.create({
              konsultasi_id: c._id,
              pengirim_id: actor.userId,
              isi,
              tipe,
              file_url: payload.file_url,
            }),
          );
          io!.to(`consultation:${c._id}`).emit('chat:message', msg);
          ack?.({ ok: true, message: msg });

          // Offline/other-screen recipient gets a notification.
          const recipient = await asSystem(async (): Promise<{ user_id: any } | null> =>
            actor.role === 'pasien'
              ? Dokter.findById(c.dokter_id).select('user_id')
              : Pasien.findById(c.pasien_id).select('user_id'),
          );
          if (recipient) {
            await notify(String(recipient.user_id), {
              judul: 'Pesan baru',
              isi: tipe === 'text' ? isi.slice(0, 120) : 'Mengirim lampiran',
              data: { type: 'chat', id: String(c._id) },
            });
          }
        } catch (err) {
          ack?.({ ok: false, error: 'error' });
        }
      },
    );

    /* ---------------------------------------------------------- WebRTC signaling */
    const MAX_SIGNAL_BYTES = 20_000;
    const inRoom = (id: string) => socket.rooms.has(`consultation:${id}`);
    const myCalls = (socket.data as any).calls ?? ((socket.data as any).calls = new Set<string>());

    const endCall = (id: string, reason: string) => {
      if (calls.delete(id)) io!.to(`consultation:${id}`).emit('call:ended', { konsultasiId: id, reason });
      myCalls.delete(id);
    };

    socket.on('call:invite', async (payload: { konsultasiId: string; video?: boolean }, ack?: (r: any) => void) => {
      try {
        const id = String(payload?.konsultasiId ?? '');
        const c = await findParticipantConsultation(id, actor);
        if (!c || !inRoom(id)) return ack?.({ ok: false, error: 'forbidden' });
        if (!CHAT_STATUSES.includes(c.status)) return ack?.({ ok: false, error: 'consultation_not_active' });
        if (calls.has(id)) return ack?.({ ok: false, error: 'busy' });
        calls.set(id, { initiator: actor.userId, video: payload.video !== false, state: 'ringing' });
        myCalls.add(id);
        socket.to(`consultation:${id}`).emit('call:incoming', { konsultasiId: id, from: actor.userId, video: payload.video !== false });
        const peer = await asSystem(async (): Promise<{ user_id: any } | null> =>
          actor.role === 'pasien' ? Dokter.findById(c.dokter_id).select('user_id') : Pasien.findById(c.pasien_id).select('user_id'));
        if (peer) await notify(String(peer.user_id), { judul: 'Panggilan masuk', isi: 'Konsultasi video/suara menunggu Anda', tipe: 'info', data: { type: 'call', id } });
        ack?.({ ok: true });
        // Unanswered calls stop ringing after 45s.
        setTimeout(() => { if (calls.get(id)?.state === 'ringing') endCall(id, 'timeout'); }, 45_000).unref();
      } catch {
        ack?.({ ok: false, error: 'error' });
      }
    });

    socket.on('call:accept', (payload: { konsultasiId: string }, ack?: (r: any) => void) => {
      const id = String(payload?.konsultasiId ?? '');
      const call = calls.get(id);
      // Only the other participant (not the caller) can answer.
      if (!call || !inRoom(id) || call.initiator === actor.userId || call.state !== 'ringing') return ack?.({ ok: false });
      call.state = 'active';
      myCalls.add(id);
      socket.to(`consultation:${id}`).emit('call:accepted', { konsultasiId: id, by: actor.userId });
      ack?.({ ok: true, video: call.video });
    });

    socket.on('call:reject', (payload: { konsultasiId: string }) => {
      const id = String(payload?.konsultasiId ?? '');
      const call = calls.get(id);
      if (call && inRoom(id) && call.initiator !== actor.userId) endCall(id, 'rejected');
    });

    socket.on('call:signal', (payload: { konsultasiId: string; type: string; data: unknown }) => {
      const id = String(payload?.konsultasiId ?? '');
      if (!calls.has(id) || !inRoom(id)) return;
      if (!['offer', 'answer', 'candidate'].includes(payload.type)) return;
      if (JSON.stringify(payload.data ?? '').length > MAX_SIGNAL_BYTES) return;
      socket.to(`consultation:${id}`).emit('call:signal', { konsultasiId: id, from: actor.userId, type: payload.type, data: payload.data });
    });

    socket.on('call:end', (payload: { konsultasiId: string }) => {
      const id = String(payload?.konsultasiId ?? '');
      if (calls.has(id) && inRoom(id)) endCall(id, 'ended');
    });

    socket.on('disconnect', () => {
      for (const id of [...myCalls]) endCall(id, 'disconnected');
    });

    socket.on('chat:typing', (payload: { konsultasiId: string; typing: boolean }) => {
      if (socket.rooms.has(`consultation:${payload?.konsultasiId}`)) {
        socket.to(`consultation:${payload.konsultasiId}`).emit('chat:typing', {
          konsultasiId: payload.konsultasiId,
          userId: actor.userId,
          typing: !!payload.typing,
        });
      }
    });

    socket.on('chat:read', async (payload: { konsultasiId: string }) => {
      const c = await findParticipantConsultation(payload?.konsultasiId, actor);
      if (!c) return;
      await asSystem(() =>
        ChatMessage.updateMany(
          { konsultasi_id: c._id, pengirim_id: { $ne: actor.userId }, is_read: false },
          { is_read: true },
        ),
      );
      socket.to(`consultation:${c._id}`).emit('chat:read', { konsultasiId: String(c._id), userId: actor.userId });
    });
  });

  return io;
};
