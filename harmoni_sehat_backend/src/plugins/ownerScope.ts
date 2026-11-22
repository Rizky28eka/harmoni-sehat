import { Schema } from 'mongoose';
import { requestContext } from '../utils/requestContext';
import { Actor } from '../utils/actor';

/**
 * Row-level security for Mongoose models.
 *
 * `scope(actor)` returns a filter restricting which documents the actor can touch,
 * or `null` to deny all access. `force(actor)` returns fields stamped on new documents
 * so a client can never create records on behalf of someone else.
 * Admins and system operations are never restricted.
 */
export interface OwnerScopeConfig {
  scope: (actor: Actor, op: 'read' | 'write') => Promise<Record<string, any> | null> | Record<string, any> | null;
  force?: (actor: Actor) => Record<string, any> | null;
}

const NONE = { _id: { $in: [] } };

const QUERY_OPS = [
  'find',
  'findOne',
  'countDocuments',
  'findOneAndUpdate',
  'findOneAndDelete',
  'findOneAndReplace',
  'updateOne',
  'updateMany',
  'deleteOne',
  'deleteMany',
] as const;

const READ_OPS = new Set(['find', 'findOne', 'countDocuments']);

export const ownerScope = (schema: Schema, config: OwnerScopeConfig) => {
  for (const op of QUERY_OPS) {
    schema.pre(op as any, async function (this: any) {
      const ctx = requestContext.getStore();
      const actor = ctx?.actor;
      if (!actor || ctx?.system || actor.isAdmin) return;
      const filter = await config.scope(actor, READ_OPS.has(op) ? 'read' : 'write');
      const scoped = filter ?? NONE;
      if (this.getOptions().upsert) {
        // $and cannot seed the inserted document, so merge plain equality scopes directly.
        this.setQuery({ ...this.getQuery(), ...scoped });
      } else {
        this.setQuery({ $and: [this.getQuery(), scoped] });
      }
    });
  }

  schema.pre('validate', function (this: any, next) {
    const ctx = requestContext.getStore();
    const actor = ctx?.actor;
    if (!this.isNew || !actor || ctx?.system || actor.isAdmin || !config.force) return next();
    const forced = config.force(actor);
    if (forced) Object.assign(this, forced);
    next();
  });
};
