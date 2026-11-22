import Redis from 'ioredis';

const url = process.env.REDIS_URL;
let client: Redis | null = null;

const getClient = () => {
  if (!url || process.env.NODE_ENV === 'test') return null;
  if (!client) {
    client = new Redis(url, { maxRetriesPerRequest: 1, enableOfflineQueue: false, lazyConnect: false });
    client.on('error', () => undefined); // cache is best-effort, never fatal
  }
  return client;
};

/** Read-through cache that silently degrades to a direct call when Redis is absent/down. */
export const cached = async <T>(key: string, ttlSeconds: number, loader: () => Promise<T>): Promise<T> => {
  const r = getClient();
  if (r) {
    try {
      const hit = await r.get(key);
      if (hit) return JSON.parse(hit) as T;
    } catch { /* fall through */ }
  }
  const value = await loader();
  if (r) {
    try { await r.set(key, JSON.stringify(value), 'EX', ttlSeconds); } catch { /* ignore */ }
  }
  return value;
};

export const invalidate = async (prefix: string) => {
  const r = getClient();
  if (!r) return;
  try {
    const keys = await r.keys(`${prefix}*`);
    if (keys.length) await r.del(...keys);
  } catch { /* ignore */ }
};
