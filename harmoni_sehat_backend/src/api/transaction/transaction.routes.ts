import { Router } from 'express';
import TransactionController from './transaction.controller';
import validate from '../../middlewares/validator';
import { protect } from '../../middlewares/protect';
import { authorize } from '../../middlewares/authorize';
import { createTransactionSchema, updateTransactionSchema } from './transaction.validation';

const router = Router();

// All transaction routes are protected
router.use(protect);

// Routes for creating transactions (user_id comes from logged-in user)
router.post('/', authorize('patient', 'doctor', 'pharmacist', 'admin'), validate(createTransactionSchema), TransactionController.createTransaction);

// Routes for getting user's own transactions
router.get('/me', TransactionController.getMyTransactions);

// Routes for admin to get all transactions
router.get('/', authorize('admin'), TransactionController.getAllTransactions);

// Routes for specific transaction by ID
router.get('/:id', TransactionController.getTransactionById);
router.put('/:id', TransactionController.updateTransaction);
router.delete('/:id', TransactionController.deleteTransaction);

export default router;
