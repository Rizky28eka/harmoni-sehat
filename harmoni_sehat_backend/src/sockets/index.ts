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
