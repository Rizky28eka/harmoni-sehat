import { AsyncLocalStorage } from 'async_hooks';
import { Actor } from './actor';

export interface RequestContext {
  actor?: Actor;
  /** Internal/system operations (webhooks, jobs) bypass row-level scoping. */
  system?: boolean;
}

export const requestContext = new AsyncLocalStorage<RequestContext>();

/** Run a callback bypassing row-level scoping (for trusted server-side logic). */
export const asSystem = <T>(fn: () => Promise<T>): Promise<T> =>
  requestContext.run({ system: true }, fn);
