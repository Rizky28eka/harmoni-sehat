import crypto from 'crypto';
import { ENCRYPTION_KEY } from '../config/env';

const PREFIX = 'enc:v1:';
const key = ENCRYPTION_KEY ? crypto.createHash('sha256').update(ENCRYPTION_KEY).digest() : null;

/** AES-256-GCM. Pass-through when ENCRYPTION_KEY is unset so development stays simple. */
export const encryptField = (value?: string): string | undefined => {
  if (value == null || value === '' || !key || value.startsWith(PREFIX)) return value;
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ct = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  return `${PREFIX}${iv.toString('base64')}:${cipher.getAuthTag().toString('base64')}:${ct.toString('base64')}`;
};

export const decryptField = (value?: string): string | undefined => {
  if (value == null || !value.startsWith(PREFIX)) return value;
  if (!key) return '[terenkripsi]';
  try {
    const [iv, tag, ct] = value.slice(PREFIX.length).split(':').map((p) => Buffer.from(p, 'base64'));
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(ct), decipher.final()]).toString('utf8');
  } catch {
    return '[tidak dapat didekripsi]';
  }
};
