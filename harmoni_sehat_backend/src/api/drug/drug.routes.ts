import { requireVerifiedProfessional } from '../../middlewares/verified';
import { accessPolicy } from '../../middlewares/accessPolicy';
import { Router } from 'express';
import drugController from './drug.controller';
import { validate } from '../../middlewares/validator';
import { createDrugSchema, updateDrugSchema } from './drug.validation';

const router = Router();
router.use(accessPolicy("any", ["farmasi"]));
router.use((req, res, next) => (['dokter', 'farmasi'].includes((req as any).userRole) ? requireVerifiedProfessional(req, res, next) : next()));

router.route('/')
  .post(validate(createDrugSchema), drugController.createDrug)
  .get(drugController.getAllDrugs);

router.route('/:id')
  .get(drugController.getDrugById)
  .put(validate(updateDrugSchema), drugController.updateDrug)
  .delete(drugController.deleteDrug);

export default router;