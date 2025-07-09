import { Router } from 'express';
import DrugCartController from './drugCart.controller';
import validate from '../../middlewares/validator';
import { protect } from '../../middlewares/protect';
import { authorize } from '../../middlewares/authorize';
import { createDrugCartSchema, updateDrugCartSchema } from './drugCart.validation';

const router = Router();

// All drug cart routes are protected
router.use(protect);

// Routes for patient to manage their own cart
router.post('/', authorize('patient'), validate(createDrugCartSchema), DrugCartController.createDrugCart);
router.get('/me', authorize('patient'), DrugCartController.getMyDrugCart);
router.delete('/me', authorize('patient'), DrugCartController.clearMyDrugCart);

// Routes for specific cart item by ID (patient can only access their own)
router.get('/:id', authorize('patient', 'admin', 'pharmacist'), DrugCartController.getDrugCartById);
router.put('/:id', authorize('patient', 'admin', 'pharmacist'), validate(updateDrugCartSchema), DrugCartController.updateDrugCart);
router.delete('/:id', authorize('patient', 'admin', 'pharmacist'), DrugCartController.deleteDrugCart);

// Admin/Pharmacist can potentially view all carts (not implemented yet, but route is here)
// router.get('/', authorize('admin', 'pharmacist'), DrugCartController.getAllDrugCarts); 

export default router;
