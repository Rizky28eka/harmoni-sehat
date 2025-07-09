import { Router } from 'express';
import DrugOrderDetailController from './drugOrderDetail.controller';
import validate from '../../middlewares/validator';
import { protect } from '../../middlewares/protect';
import { authorize } from '../../middlewares/authorize';
import { createDrugOrderDetailSchema, updateDrugOrderDetailSchema } from './drugOrderDetail.validation';

const router = Router();

// All drug order detail routes are protected
router.use(protect);

// Routes for admin/pharmacist to manage all order details
router.post('/', authorize('admin', 'pharmacist'), validate(createDrugOrderDetailSchema), DrugOrderDetailController.createDrugOrderDetail);
router.get('/', authorize('admin', 'pharmacist'), DrugOrderDetailController.getAllDrugOrderDetails);

// Routes for specific order detail by ID (ownership check in controller)
router.get('/:id', authorize('admin', 'pharmacist', 'patient'), DrugOrderDetailController.getDrugOrderDetailById);
router.put('/:id', authorize('admin', 'pharmacist', 'patient'), validate(updateDrugOrderDetailSchema), DrugOrderDetailController.updateDrugOrderDetail);
router.delete('/:id', authorize('admin', 'pharmacist', 'patient'), DrugOrderDetailController.deleteDrugOrderDetail);

// Route to get all details for a specific order ID
router.get('/order/:orderId', authorize('admin', 'pharmacist', 'patient'), DrugOrderDetailController.getDrugDetailsByOrderId);

export default router;
