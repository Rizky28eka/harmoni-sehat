import crypto from 'crypto';
import { STUN_URLS, TURN_URLS, TURN_SECRET } from '../config/env';

export interface IceServer {
  urls: string[];
  username?: string;
  credential?: string;
}

/**
 * ICE servers for WebRTC. STUN is always included. When TURN_URLS + TURN_SECRET are set
 * (coturn with `use-auth-secret`), short-lived credentials are minted per user so the
 * TURN relay can't be abused with leaked static credentials.
 */
export const getIceServers = (userId: string, ttlSeconds = 3600, now = Date.now()): IceServer[] => {
  const servers: IceServer[] = [{ urls: STUN_URLS }];
  if (TURN_URLS.length && TURN_SECRET) {
    const username = `${Math.floor(now / 1000) + ttlSeconds}:${userId}`;
    const credential = crypto.createHmac('sha1', TURN_SECRET).update(username).digest('base64');
    servers.push({ urls: TURN_URLS, username, credential });
  }
  return servers;
};
