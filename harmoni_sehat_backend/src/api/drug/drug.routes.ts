import { Router } from 'express';
import drugController from './drug.controller';
import { validate } from '../../middlewares/validator';
import { createDrugSchema, updateDrugSchema } from './drug.validation';

const router = Router();

router.route('/')
  .post(validate(createDrugSchema), drugController.createDrug)
  .get(drugController.getAllDrugs);

router.route('/:id')
  .get(drugController.getDrugById)
  .put(validate(updateDrugSchema), drugController.updateDrug)
  .delete(drugController.deleteDrug);

export default router;