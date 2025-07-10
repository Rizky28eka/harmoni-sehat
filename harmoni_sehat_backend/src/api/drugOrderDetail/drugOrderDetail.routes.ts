import { Router } from 'express';
import drugOrderDetailController from './drugOrderDetail.controller';
import { validate } from '../../middlewares/validator';
import { createDrugOrderDetailSchema, updateDrugOrderDetailSchema } from './drugOrderDetail.validation';

const router = Router();

router.route('/')
  .post(validate(createDrugOrderDetailSchema), drugOrderDetailController.createDrugOrderDetail)
  .get(drugOrderDetailController.getAllDrugOrderDetails);

router.route('/:id')
  .get(drugOrderDetailController.getDrugOrderDetailById)
  .put(validate(updateDrugOrderDetailSchema), drugOrderDetailController.updateDrugOrderDetail)
  .delete(drugOrderDetailController.deleteDrugOrderDetail);

export default router;