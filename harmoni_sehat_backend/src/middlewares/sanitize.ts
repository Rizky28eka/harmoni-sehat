import { Request, Response, NextFunction } from 'express';

const clean = (value: any): any => {
  if (Array.isArray(value)) return value.map(clean);
  if (value && typeof value === 'object') {
    const out: Record<string, any> = {};
    for (const key of Object.keys(value)) {
      if (key.startsWith('$') || key.includes('.')) continue; // NoSQL operator injection
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
      out[key] = clean(value[key]);
    }
    return out;
  }
  return value;
};

/** Strips Mongo operators ($ne, $gt, ...) and prototype-pollution keys from body/params. */
const sanitize = (req: Request, _res: Response, next: NextFunction) => {
  if (req.body) req.body = clean(req.body);
  if (req.params) {
    for (const k of Object.keys(req.params)) {
      if (typeof req.params[k] !== 'string') delete (req.params as any)[k];
    }
  }
  const q = req.query as Record<string, any>;
  for (const k of Object.keys(q)) {
    if (k.startsWith('$')) delete q[k];
  }
  next();
};

export default sanitize;
