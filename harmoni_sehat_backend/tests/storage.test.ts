import fs from 'fs';
import os from 'os';
import path from 'path';
import crypto from 'crypto';
import { localDriver, cloudinaryDriver, s3Driver } from '../src/services/storage';

const png = Buffer.from('89504e470d0a1a0a', 'hex');

describe('storage drivers', () => {
  it('local: writes a randomly named file and returns a public URL', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'up-'));
    const res = await localDriver(dir, 'http://x').save({ buffer: png, ext: '.png', mime: 'image/png', folder: '2026-01' });
    expect(res.url).toMatch(/^http:\/\/x\/uploads\/2026-01\/[0-9a-f]{32}\.png$/);
    expect(fs.readFileSync(path.join(dir, res.key))).toEqual(png);
  });

  it('cloudinary: sends a correctly signed upload', async () => {
    let sent: FormData | undefined;
    let url = '';
    const fetchImpl = (async (u: string, init: any) => {
      url = u;
      sent = init.body as FormData;
      return { ok: true, json: async () => ({ secure_url: 'https://res.cloudinary.com/demo/image/upload/a.png', public_id: 'harmoni-sehat/a' }) };
    }) as any;
    const res = await cloudinaryDriver({ cloudName: 'demo', apiKey: 'KEY', apiSecret: 'SECRET', fetchImpl }).save({ buffer: png, ext: '.png', mime: 'image/png', folder: 'f' });
    expect(url).toBe('https://api.cloudinary.com/v1_1/demo/auto/upload');
    expect(res.url).toContain('res.cloudinary.com');
    const f = (k: string) => String(sent!.get(k));
    const expected = crypto.createHash('sha1').update(`folder=${f('folder')}&public_id=${f('public_id')}&timestamp=${f('timestamp')}SECRET`).digest('hex');
    expect(f('signature')).toBe(expected);
    expect(f('api_key')).toBe('KEY');
    expect(f('signature')).not.toContain('SECRET');
  });

  it('cloudinary: surfaces provider errors as 502', async () => {
    const fetchImpl = (async () => ({ ok: false, status: 401, json: async () => ({ error: { message: 'Invalid signature' } }) })) as any;
    await expect(cloudinaryDriver({ cloudName: 'd', apiKey: 'k', apiSecret: 's', fetchImpl }).save({ buffer: png, ext: '.png', mime: 'image/png' })).rejects.toMatchObject({ statusCode: 502 });
  });

  it('s3: puts the object with the right bucket/key/type and builds the public URL', async () => {
    const cmds: any[] = [];
    const client = { send: async (c: any) => { cmds.push(c); return {}; } };
    const res = await s3Driver({ bucket: 'bkt', region: 'ap-southeast-1', accessKeyId: 'a', secretAccessKey: 'b', client }).save({ buffer: png, ext: '.pdf', mime: 'application/pdf', folder: 'docs' });
    expect(cmds[0].input).toMatchObject({ Bucket: 'bkt', ContentType: 'application/pdf', Key: res.key });
    expect(res.url).toBe(`https://bkt.s3.ap-southeast-1.amazonaws.com/${res.key}`);

    const custom = await s3Driver({ bucket: 'bkt', region: 'auto', accessKeyId: 'a', secretAccessKey: 'b', endpoint: 'https://r2.example.com/', publicUrl: 'https://cdn.example.com/', client }).save({ buffer: png, ext: '.png', mime: 'image/png' });
    expect(custom.url.startsWith('https://cdn.example.com/')).toBe(true);
  });

  it('s3: maps SDK failures to 502', async () => {
    const client = { send: async () => { throw new Error('AccessDenied'); } };
    await expect(s3Driver({ bucket: 'b', region: 'r', accessKeyId: 'a', secretAccessKey: 'b', client }).save({ buffer: png, ext: '.png', mime: 'image/png' })).rejects.toMatchObject({ statusCode: 502 });
  });
});
