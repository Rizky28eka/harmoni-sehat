import { Router } from 'express';
import DrugOrderController from './drugOrder.controller';
import validate from '../../middlewares/validator';
import { protect } from '../../middlewares/protect';
import { authorize } from '../../middlewares/authorize';
import { createDrugOrderSchema, updateDrugOrderSchema } from './drugOrder.validation';

const router = Router();

// All drug order routes are protected
router.use(protect);

// Routes for patient to manage their own orders
router.post('/', authorize('patient'), validate(createDrugOrderSchema), DrugOrderController.createDrugOrder);
router.get('/me', authorize('patient'), DrugOrderController.getMyDrugOrders);

// Routes for admin/pharmacist to get all orders
router.get('/', authorize('admin', 'pharmacist'), DrugOrderController.getAllDrugOrders);

// Routes for specific order by ID
router.get('/:id', authorize('admin', 'pharmacist', 'patient'), DrugOrderController.getDrugOrderById);
router.put('/:id', authorize('admin', 'pharmacist', 'patient'), validate(updateDrugOrderSchema), DrugOrderController.updateDrugOrder);
router.delete('/:id', authorize('admin', 'patient'), DrugOrderController.deleteDrugOrder);

export default router;
