import { Request, Response, NextFunction } from 'express';
import { getActor } from '../utils/actor';
import { requestContext } from '../utils/requestContext';

/** Binds the caller to an AsyncLocalStorage so Mongoose row-level scoping can see it. */
const actorContext = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const actor = await getActor(req);
    (req as any).actor = actor;
    requestContext.run({ actor }, () => next());
  } catch (e) {
    next(e);
  }
};

export default actorContext;
