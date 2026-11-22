import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import {
  STORAGE_DRIVER, UPLOAD_DIR, PUBLIC_BASE_URL,
  CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET,
  S3_BUCKET, S3_REGION, S3_ENDPOINT, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_PUBLIC_URL,
} from '../config/env';
import { AppError } from '../utils/AppError';

export interface SaveInput {
  buffer: Buffer;
  ext: string; // ".jpg"
  mime: string;
  folder?: string;
}

export interface StoredFile {
  url: string;
  key: string;
  driver: 'local' | 'cloudinary' | 's3';
}

export interface StorageDriver {
  readonly name: StoredFile['driver'];
  save(input: SaveInput): Promise<StoredFile>;
}

const randomName = () => crypto.randomBytes(16).toString('hex');
const monthFolder = () => new Date().toISOString().slice(0, 7);

/* ----------------------------------------------------------------- local */
export const localDriver = (dir = UPLOAD_DIR, baseUrl = PUBLIC_BASE_URL): StorageDriver => ({
  name: 'local',
  async save({ buffer, ext, folder }) {
    const sub = folder ?? monthFolder();
    const abs = path.resolve(dir, sub);
    await fs.promises.mkdir(abs, { recursive: true });
    const name = `${randomName()}${ext}`;
    await fs.promises.writeFile(path.join(abs, name), buffer);
    return { url: `${baseUrl}/uploads/${sub}/${name}`, key: `${sub}/${name}`, driver: 'local' };
  },
});

/* ------------------------------------------------------------ cloudinary */
interface CloudinaryOpts {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  fetchImpl?: typeof fetch;
}

/** Signed upload straight to Cloudinary's REST API (no SDK needed). */
export const cloudinaryDriver = (o: CloudinaryOpts): StorageDriver => ({
  name: 'cloudinary',
  async save({ buffer, mime, folder }) {
    const f = o.fetchImpl ?? fetch;
    const timestamp = Math.floor(Date.now() / 1000);
    const targetFolder = `harmoni-sehat/${folder ?? monthFolder()}`;
    const public_id = randomName();
    // Signature = sha1 of the alphabetically sorted signed params + api secret.
    const toSign = `folder=${targetFolder}&public_id=${public_id}&timestamp=${timestamp}`;
    const signature = crypto.createHash('sha1').update(toSign + o.apiSecret).digest('hex');

    const form = new FormData();
    form.append('file', new Blob([new Uint8Array(buffer)], { type: mime }), `${public_id}`);
    form.append('api_key', o.apiKey);
    form.append('timestamp', String(timestamp));
    form.append('folder', targetFolder);
    form.append('public_id', public_id);
    form.append('signature', signature);

    const res = await f(`https://api.cloudinary.com/v1_1/${o.cloudName}/auto/upload`, { method: 'POST', body: form });
    const body: any = await res.json().catch(() => ({}));
    if (!res.ok || !body.secure_url) {
      throw new AppError(`Upload ke Cloudinary gagal: ${body?.error?.message ?? res.status}`, 502);
    }
    return { url: body.secure_url as string, key: body.public_id as string, driver: 'cloudinary' };
  },
});

/* -------------------------------------------------------------------- s3 */
interface S3Opts {
  bucket: string;
  region: string;
  endpoint?: string;
  accessKeyId: string;
  secretAccessKey: string;
  publicUrl?: string;
  /** Injectable for tests: anything with `send(command)`. */
  client?: { send: (cmd: any) => Promise<any> };
}

/** S3 or any S3-compatible store (Cloudflare R2, MinIO, ...). */
export const s3Driver = (o: S3Opts): StorageDriver => ({
  name: 's3',
  async save({ buffer, ext, mime, folder }) {
    // Loaded lazily so deployments that don't use S3 don't pay for the SDK at startup.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
    const client =
      o.client ??
      new S3Client({
        region: o.region,
        endpoint: o.endpoint || undefined,
        forcePathStyle: !!o.endpoint,
        credentials: { accessKeyId: o.accessKeyId, secretAccessKey: o.secretAccessKey },
      });
    const key = `${folder ?? monthFolder()}/${randomName()}${ext}`;
    try {
      await client.send(new PutObjectCommand({ Bucket: o.bucket, Key: key, Body: buffer, ContentType: mime, CacheControl: 'public, max-age=31536000, immutable' }));
    } catch (err: any) {
      throw new AppError(`Upload ke S3 gagal: ${err?.message ?? 'unknown'}`, 502);
    }
    const base = o.publicUrl
      ? o.publicUrl.replace(/\/$/, '')
      : o.endpoint
        ? `${o.endpoint.replace(/\/$/, '')}/${o.bucket}`
        : `https://${o.bucket}.s3.${o.region}.amazonaws.com`;
    return { url: `${base}/${key}`, key, driver: 's3' };
  },
});

/* --------------------------------------------------------------- factory */
let cached: StorageDriver | null = null;

export const getStorage = (): StorageDriver => {
  if (cached) return cached;
  cached =
    STORAGE_DRIVER === 'cloudinary'
      ? cloudinaryDriver({ cloudName: CLOUDINARY_CLOUD_NAME, apiKey: CLOUDINARY_API_KEY, apiSecret: CLOUDINARY_API_SECRET })
      : STORAGE_DRIVER === 's3'
        ? s3Driver({ bucket: S3_BUCKET, region: S3_REGION, endpoint: S3_ENDPOINT, accessKeyId: S3_ACCESS_KEY_ID, secretAccessKey: S3_SECRET_ACCESS_KEY, publicUrl: S3_PUBLIC_URL })
        : localDriver();
  return cached;
};

/** Test hook. */
export const setStorageForTests = (d: StorageDriver | null) => {
  cached = d;
};
