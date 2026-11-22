import { Router } from 'express';
import protect from '../../middlewares/protect';
import Transaction from '../../models/Transaction';
import { AppError } from '../../utils/AppError';
import { asSystem } from '../../utils/requestContext';
import {
  verifyMidtransSignature, settleTransaction, failTransaction, canSimulate, isMockPayments,
} from '../../services/payment';

const router = Router();

/** Midtrans HTTP notification. Authenticated by signature, not by JWT. */
router.post('/webhook', async (req, res, next) => {
  try {
    if (!verifyMidtransSignature(req.body)) throw new AppError('Invalid signature', 403);
    const { order_id, transaction_status, fraud_status, transaction_id } = req.body;
    if (transaction_status === 'settlement' || (transaction_status === 'capture' && fraud_status === 'accept')) {
      await settleTransaction(order_id, transaction_id);
    } else if (['deny', 'cancel', 'failure'].includes(transaction_status)) {
      await failTransaction(order_id, 'failed');
    } else if (transaction_status === 'expire') {
      await failTransaction(order_id, 'expired');
    }
    res.status(200).json({ status: 'ok' });
  } catch (e) {
    next(e);
  }
});

router.get('/:orderId', protect, async (req, res, next) => {
  try {
    // Row-level scope guarantees the caller only finds their own transactions.
    const tx = await Transaction.findOne({ order_id: req.params.orderId });
    if (!tx) throw new AppError('Transaksi tidak ditemukan', 404);
    res.json({ status: 'success', data: tx, mock: isMockPayments() });
  } catch (e) {
    next(e);
  }
});

/** Sandbox-only helper used while no payment gateway key is configured. */
router.post('/:orderId/simulate', protect, async (req, res, next) => {
  try {
    if (!canSimulate()) throw new AppError('Simulation is disabled', 403);
    const outcome = req.body?.outcome === 'failed' ? 'failed' : 'success';
    const tx = await Transaction.findOne({ order_id: req.params.orderId });
    if (!tx) throw new AppError('Transaksi tidak ditemukan', 404);
    if (tx.status !== 'pending') throw new AppError('Transaksi sudah diproses', 409);
    outcome === 'success' ? await settleTransaction(tx.order_id) : await failTransaction(tx.order_id, 'failed');
    const fresh = await asSystem(() => Transaction.findById(tx._id));
    res.json({ status: 'success', data: fresh });
  } catch (e) {
    next(e);
  }
});

export default router;
