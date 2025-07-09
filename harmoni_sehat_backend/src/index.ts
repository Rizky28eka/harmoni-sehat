import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './config/db';
import env from './config/env';
import errorHandler from './middlewares/errorHandler';
import AppError from './utils/AppError';

// Import routes
import authRoutes from './api/auth/auth.routes';
import userRoutes from './api/user/user.routes';
import medicalRecordRoutes from './api/medicalRecord/medicalRecord.routes';
import patientRoutes from './api/patient/patient.routes';
import doctorRoutes from './api/doctor/doctor.routes';
import roleRoutes from './api/role/role.routes';
import specializationRoutes from './api/specialization/specialization.routes';
import clinicRoutes from './api/clinic/clinic.routes';
import drugRoutes from './api/drug/drug.routes';
import pharmacistRoutes from './api/pharmacist/pharmacist.routes';
import drugCartRoutes from './api/drugCart/drugCart.routes';
import drugOrderRoutes from './api/drugOrder/drugOrder.routes';
import drugOrderDetailRoutes from './api/drugOrderDetail/drugOrderDetail.routes';
import consultationRoutes from './api/consultation/consultation.routes';
import chatMessageRoutes from './api/chatMessage/chatMessage.routes';
import doctorReviewRoutes from './api/doctorReview/doctorReview.routes';
import practiceScheduleRoutes from './api/practiceSchedule/practiceSchedule.routes';
import doctorClinicRoutes from './api/doctorClinic/doctorClinic.routes';
import prescriptionRoutes from './api/prescription/prescription.routes';
import prescriptionDrugRoutes from './api/prescriptionDrug/prescriptionDrug.routes';
import healthArticleRoutes from './api/healthArticle/healthArticle.routes';
import mediaRoutes from './api/media/media.routes';
import notificationRoutes from './api/notification/notification.routes';
import paymentMethodRoutes from './api/paymentMethod/paymentMethod.routes';
import transactionRoutes from './api/transaction/transaction.routes';
import userProfileRoutes from './api/userProfile/userProfile.routes';
import userRoleRoutes from './api/userRole/userRole.routes';
import adminRoutes from './api/admin/admin.routes';
import activityLogRoutes from './api/activityLog/activityLog.routes';
import refreshTokenRoutes from './api/refreshToken/refreshToken.routes';

// Import models to ensure they are registered with Mongoose
import './models/Role';
import './models/UserRole';
import './models/UserProfile';
import './models/Doctor';
import './models/Pharmacist';
import './models/Patient';
import './models/Admin';
import './models/Clinic';
import './models/DoctorClinic';
import './models/PracticeSchedule';
import './models/Specialization';
import './models/ActivityLog';
import './models/Media';
import './models/RefreshToken';
import './models/Notification';
import './models/HealthArticle';
import './models/Consultation';
import './models/MedicalRecord';
import './models/ChatMessage';
import './models/DoctorReview';
import './models/Prescription';
import './models/Drug';
import './models/PrescriptionDrug';
import './models/DrugCart';
import './models/DrugOrder';
import './models/DrugOrderDetail';
import './models/PaymentMethod';
import './models/Transaction';

const app = express();

// Connect to database
connectDB();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Harmoni Sehat Backend API');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/medicalrecords', medicalRecordRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/specializations', specializationRoutes);
app.use('/api/clinics', clinicRoutes);
app.use('/api/drugs', drugRoutes);
app.use('/api/pharmacists', pharmacistRoutes);
app.use('/api/drugcarts', drugCartRoutes);
app.use('/api/drugorders', drugOrderRoutes);
app.use('/api/drugorderdetails', drugOrderDetailRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/chatmessages', chatMessageRoutes);
app.use('/api/doctorreviews', doctorReviewRoutes);
app.use('/api/practiceschedules', practiceScheduleRoutes);
app.use('/api/doctorclinics', doctorClinicRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/prescriptiondrugs', prescriptionDrugRoutes);

// Handle undefined routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(errorHandler);

// Start server
app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
});
