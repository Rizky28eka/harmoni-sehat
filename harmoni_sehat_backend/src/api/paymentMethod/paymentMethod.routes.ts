import { Router } from 'express';
import paymentMethodController from './paymentMethod.controller';
import { validate } from '../../middlewares/validator';
import { createPaymentMethodSchema, updatePaymentMethodSchema } from './paymentMethod.validation';

const router = Router();

router.route('/')
  .post(validate(createPaymentMethodSchema), paymentMethodController.createPaymentMethod)
  .get(paymentMethodController.getAllPaymentMethods);

router.route('/:id')
  .get(paymentMethodController.getPaymentMethodById)
  .put(validate(updatePaymentMethodSchema), paymentMethodController.updatePaymentMethod)
  .delete(paymentMethodController.deletePaymentMethod);

export default router;