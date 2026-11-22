import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { AppError } from '../utils/AppError';

/**
 * Validates a request with a zod schema.
 *  - Schemas shaped `z.object({ body, query, params })` validate those parts.
 *  - Flat schemas (`z.object({ field... })`) validate `req.body`.
 * The parsed body replaces `req.body`, so unknown fields are stripped (no mass assignment).
 */
export const validate =
  (schema: AnyZodObject) => async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const shape = (schema as any).shape ?? {};
      const wrapped = 'body' in shape || 'params' in shape || 'query' in shape;
      if (wrapped) {
        const parsed: any = await schema.parseAsync({
          body: req.body ?? {},
          query: req.query,
          params: req.params,
        });
        if (parsed.body) req.body = parsed.body;
      } else {
        req.body = await schema.parseAsync(req.body ?? {});
      }
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        return next(
          new AppError(
            error.issues.map((i) => (i.path.length ? `${i.path.join('.')}: ` : '') + i.message).join(', '),
            400,
          ),
        );
      }
      return next(error);
    }
  };
