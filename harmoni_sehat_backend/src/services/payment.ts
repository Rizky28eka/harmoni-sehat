import crypto from 'crypto';
import Transaction, { ITransaction } from '../models/Transaction';
import { AppError } from '../utils/AppError';
import { asSystem } from '../utils/requestContext';
import { MIDTRANS_SERVER_KEY, MIDTRANS_IS_PRODUCTION, PUBLIC_BASE_URL, NODE_ENV } from '../config/env';

export type PayableType = 'Consultation' | 'DrugOrder';

type Hook = (tx: ITransaction) => Promise<void>;
const paidHooks = new Map<PayableType, Hook>();
const failedHooks = new Map<PayableType, Hook>();

/** Domain modules register what should happen once a payment settles / fails. */
export const onPaid = (type: PayableType, hook: Hook) => paidHooks.set(type, hook);
export const onFailed = (type: PayableType, hook: Hook) => failedHooks.set(type, hook);

export const isMockPayments = () => !MIDTRANS_SERVER_KEY;

const snapBase = () =>
  MIDTRANS_IS_PRODUCTION ? 'https://app.midtrans.com/snap/v1' : 'https://app.sandbox.midtrans.com/snap/v1';

export const newOrderId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

interface CreatePaymentInput {
  userId: string;
  amount: number;
  type: PayableType;
  entityId: string;
  metodeId?: string;
  customer?: { name?: string; email?: string; phone?: string };
  itemName: string;
}

export const createPayment = async (input: CreatePaymentInput) => {
  const order_id = newOrderId(input.type === 'Consultation' ? 'KNS' : 'OBT');
  let payment_url: string | undefined;
  let payment_token: string | undefined;

  if (!isMockPayments()) {
    const res = await fetch(`${snapBase()}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Basic ${Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString('base64')}`,
      },
      body: JSON.stringify({
        transaction_details: { order_id, gross_amount: Math.round(input.amount) },
        item_details: [{ id: input.entityId, price: Math.round(input.amount), quantity: 1, name: input.itemName.slice(0, 50) }],
        customer_details: { first_name: input.customer?.name, email: input.customer?.email, phone: input.customer?.phone },
        expiry: { unit: 'minutes', duration: 30 },
      }),
    });
    const body: any = await res.json().catch(() => ({}));
    if (!res.ok || !body.token) {
      throw new AppError(`Payment gateway error: ${body?.error_messages?.join(', ') ?? res.status}`, 502);
    }
    payment_url = body.redirect_url;
    payment_token = body.token;
  } else {
    payment_url = `${PUBLIC_BASE_URL}/api/v1/payments/${order_id}/simulate`;
  }

  return asSystem(() =>
    Transaction.create({
      user_id: input.userId,
      total_biaya: input.amount,
      status: 'pending',
      metode_pembayaran_id: input.metodeId,
      order_id,
      payment_url,
      payment_token,
      transaksiable_id: input.entityId,
      transaksiable_type: input.type,
    } as any),
  );
};

export const settleTransaction = async (order_id: string, externalId?: string) => {
  const tx = await asSystem(() =>
    Transaction.findOneAndUpdate(
      { order_id, status: 'pending' },
      { status: 'completed', paid_at: new Date(), ...(externalId ? { external_id: externalId } : {}) },
      { new: true },
    ),
  );
  if (!tx) return null; // already settled / unknown: idempotent
  await paidHooks.get(tx.transaksiable_type as PayableType)?.(tx);
  return tx;
};

export const failTransaction = async (order_id: string, status: 'failed' | 'expired' = 'failed') => {
  const tx = await asSystem(() => Transaction.findOneAndUpdate({ order_id, status: 'pending' }, { status }, { new: true }));
  if (!tx) return null;
  await failedHooks.get(tx.transaksiable_type as PayableType)?.(tx);
  return tx;
};

export const verifyMidtransSignature = (body: any): boolean => {
  if (!MIDTRANS_SERVER_KEY) return false;
  const { order_id, status_code, gross_amount, signature_key } = body ?? {};
  if (!order_id || !status_code || !gross_amount || !signature_key) return false;
  const expected = crypto
    .createHash('sha512')
    .update(`${order_id}${status_code}${gross_amount}${MIDTRANS_SERVER_KEY}`)
    .digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(String(signature_key)));
  } catch {
    return false;
  }
};

export const canSimulate = () => isMockPayments() && NODE_ENV !== 'production';

const coreBase = () => (MIDTRANS_IS_PRODUCTION ? 'https://api.midtrans.com/v2' : 'https://api.sandbox.midtrans.com/v2');

export interface RefundResult {
  ok: boolean;
  error?: string;
}

/**
 * Refunds a settled transaction through the gateway (Midtrans Core API) and records the outcome.
 * In sandbox/mock mode (no server key) the refund is recorded as successful immediately.
 * Never throws: a failed refund is stored as `refund_status: 'failed'` so an admin can retry.
 */
export const refundTransaction = async (txId: any, reason = 'Pembatalan'): Promise<RefundResult> => {
  const tx = await asSystem(() => Transaction.findOne({ _id: txId, status: 'completed' }));
  if (!tx) return { ok: false, error: 'Transaksi tidak ditemukan atau belum dibayar' };

  const markRefunded = () =>
    asSystem(() => Transaction.updateOne({ _id: tx._id }, { status: 'refunded', refund_status: 'refunded', refunded_at: new Date(), $unset: { refund_error: 1 } }));
  const markFailed = (error: string) =>
    asSystem(() => Transaction.updateOne({ _id: tx._id }, { refund_status: 'failed', refund_error: error.slice(0, 300) }));

  if (isMockPayments()) {
    await markRefunded();
    return { ok: true };
  }

  try {
    const res = await fetch(`${coreBase()}/${encodeURIComponent(tx.order_id)}/refund`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Basic ${Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString('base64')}`,
      },
      // Stable refund_key makes the call idempotent, so retries can never refund twice.
      body: JSON.stringify({ refund_key: `rf-${tx.order_id}`, amount: Math.round(tx.total_biaya), reason }),
    });
    const body: any = await res.json().catch(() => ({}));
    // Midtrans answers HTTP 200 and reports the real outcome in `status_code`.
    if (res.ok && String(body.status_code) === '200') {
      await markRefunded();
      return { ok: true };
    }
    const error = `Refund ditolak gateway (${body.status_code ?? res.status}): ${body.status_message ?? 'tanpa pesan'}`;
    await markFailed(error);
    return { ok: false, error };
  } catch (err: any) {
    const error = `Gagal menghubungi gateway: ${err?.message ?? 'unknown'}`;
    await markFailed(error);
    return { ok: false, error };
  }
};
