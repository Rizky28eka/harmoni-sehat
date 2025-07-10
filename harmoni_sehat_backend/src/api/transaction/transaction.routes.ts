import { Router } from 'express';
import transactionController from './transaction.controller';
import { validate } from '../../middlewares/validator';
import { createTransactionSchema, updateTransactionSchema } from './transaction.validation';

const router = Router();

router.route('/')
  .post(validate(createTransactionSchema), transactionController.createTransaction)
  .get(transactionController.getAllTransactions);

router.route('/:id')
  .get(transactionController.getTransactionById)
  .put(validate(updateTransactionSchema), transactionController.updateTransaction)
  .delete(transactionController.deleteTransaction);

export default router;