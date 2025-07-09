import { Router } from 'express';
import PaymentMethodController from './paymentMethod.controller';
import validate from '../../middlewares/validator';
import { protect } from '../../middlewares/protect';
import { authorize } from '../../middlewares/authorize';
import { createPaymentMethodSchema, updatePaymentMethodSchema } from './paymentMethod.validation';

const router = Router();

// All payment method routes are protected
router.use(protect);

// Routes that can be accessed by any authenticated user (e.g., to list available payment methods)
router.get('/', PaymentMethodController.getAllPaymentMethods);
router.get('/:id', PaymentMethodController.getPaymentMethodById);

// Routes restricted to admin
router.use(authorize('admin'));
router.post('/', validate(createPaymentMethodSchema), PaymentMethodController.createPaymentMethod);
router.put('/:id', validate(updatePaymentMethodSchema), PaymentMethodController.updatePaymentMethod);
router.delete('/:id', PaymentMethodController.deletePaymentMethod);

export default router;
