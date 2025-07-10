import { Router } from 'express';
import drugOrderController from './drugOrder.controller';
import { validate } from '../../middlewares/validator';
import { createDrugOrderSchema, updateDrugOrderSchema } from './drugOrder.validation';

const router = Router();

router.route('/')
  .post(validate(createDrugOrderSchema), drugOrderController.createDrugOrder)
  .get(drugOrderController.getAllDrugOrders);

router.route('/:id')
  .get(drugOrderController.getDrugOrderById)
  .put(validate(updateDrugOrderSchema), drugOrderController.updateDrugOrder)
  .delete(drugOrderController.deleteDrugOrder);

export default router;