import { Router } from 'express';
import DrugController from './drug.controller';
import validate from '../../middlewares/validator';
import { protect } from '../../middlewares/protect';
import { authorize } from '../../middlewares/authorize';
import { createDrugSchema, updateDrugSchema } from './drug.validation';

const router = Router();

// Routes that can be accessed by any authenticated user
router.use(protect);
router.get('/', DrugController.getAllDrugs);
router.get('/:id', DrugController.getDrugById);

// Routes restricted to admin or pharmacist
router.use(authorize('admin', 'pharmacist'));
router.post('/', validate(createDrugSchema), DrugController.createDrug);
router.put('/:id', validate(updateDrugSchema), DrugController.updateDrug);
router.delete('/:id', DrugController.deleteDrug);

export default router;
