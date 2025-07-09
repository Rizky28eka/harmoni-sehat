import { Router } from 'express';
import PrescriptionDrugController from './prescriptionDrug.controller';
import validate from '../../middlewares/validator';
import { protect } from '../../middlewares/protect';
import { authorize } from '../../middlewares/authorize';
import { createPrescriptionDrugSchema, updatePrescriptionDrugSchema } from './prescriptionDrug.validation';

const router = Router();

// All prescription drug routes are protected
router.use(protect);

// Routes for doctors to create prescription drugs
router.post('/', authorize('doctor'), validate(createPrescriptionDrugSchema), PrescriptionDrugController.createPrescriptionDrug);

// Routes for specific prescription drug by ID
router.get('/:id', authorize('admin', 'patient', 'doctor', 'pharmacist'), PrescriptionDrugController.getPrescriptionDrugById);
router.put('/:id', authorize('admin', 'doctor'), validate(updatePrescriptionDrugSchema), PrescriptionDrugController.updatePrescriptionDrug);
router.delete('/:id', authorize('admin', 'doctor'), PrescriptionDrugController.deletePrescriptionDrug);

// Route to get all drugs for a specific prescription ID
router.get('/prescription/:prescriptionId', authorize('admin', 'patient', 'doctor', 'pharmacist'), PrescriptionDrugController.getPrescriptionDrugsByPrescriptionId);

// Routes for admin/pharmacist to get all prescription drugs
router.get('/', authorize('admin', 'pharmacist'), PrescriptionDrugController.getAllPrescriptionDrugs);

export default router;
