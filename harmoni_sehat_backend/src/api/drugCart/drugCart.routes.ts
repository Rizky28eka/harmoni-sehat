import { Router } from 'express';
import drugCartController from './drugCart.controller';
import { validate } from '../../middlewares/validator';
import { createDrugCartSchema, updateDrugCartSchema } from './drugCart.validation';

const router = Router();

router.route('/')
  .post(validate(createDrugCartSchema), drugCartController.createDrugCart)
  .get(drugCartController.getAllDrugCarts);

router.route('/:id')
  .get(drugCartController.getDrugCartById)
  .put(validate(updateDrugCartSchema), drugCartController.updateDrugCart)
  .delete(drugCartController.deleteDrugCart);

export default router;