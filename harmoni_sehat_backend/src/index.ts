import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import { PORT } from './config/env';
import errorHandler from './middlewares/errorHandler';

dotenv.config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());

import roleRoutes from './api/role/role.routes';
import userRoutes from './api/user/user.routes';
import patientRoutes from './api/patient/patient.routes';
import doctorRoutes from './api/doctor/doctor.routes';
import pharmacistRoutes from './api/pharmacist/pharmacist.routes';
import adminRoutes from './api/admin/admin.routes';
import userRoleRoutes from './api/userRole/userRole.routes';
import userProfileRoutes from './api/userProfile/userProfile.routes';
import specializationRoutes from './api/specialization/specialization.routes';
import clinicRoutes from './api/clinic/clinic.routes';
import doctorClinicRoutes from './api/doctorClinic/doctorClinic.routes';
import practiceScheduleRoutes from './api/practiceSchedule/practiceSchedule.routes';
import consultationRoutes from './api/consultation/consultation.routes';
import chatMessageRoutes from './api/chatMessage/chatMessage.routes';
import medicalRecordRoutes from './api/medicalRecord/medicalRecord.routes';
import doctorReviewRoutes from './api/doctorReview/doctorReview.routes';
import healthArticleRoutes from './api/healthArticle/healthArticle.routes';
import notificationRoutes from './api/notification/notification.routes';
import activityLogRoutes from './api/activityLog/activityLog.routes';
import mediaRoutes from './api/media/media.routes';
import refreshTokenRoutes from './api/refreshToken/refreshToken.routes';
import paymentMethodRoutes from './api/paymentMethod/paymentMethod.routes';
import transactionRoutes from './api/transaction/transaction.routes';
import drugRoutes from './api/drug/drug.routes';
import drugCartRoutes from './api/drugCart/drugCart.routes';
import drugOrderRoutes from './api/drugOrder/drugOrder.routes';
import drugOrderDetailRoutes from './api/drugOrderDetail/drugOrderDetail.routes';
import prescriptionRoutes from './api/prescription/prescription.routes';
import prescriptionDrugRoutes from './api/prescriptionDrug/prescriptionDrug.routes';

// Routes
app.use('/api/roles', roleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/pharmacists', pharmacistRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/user-roles', userRoleRoutes);
app.use('/api/user-profiles', userProfileRoutes);
app.use('/api/specializations', specializationRoutes);
app.use('/api/clinics', clinicRoutes);
app.use('/api/doctor-clinics', doctorClinicRoutes);
app.use('/api/practice-schedules', practiceScheduleRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/chat-messages', chatMessageRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/doctor-reviews', doctorReviewRoutes);
app.use('/api/health-articles', healthArticleRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/activity-logs', activityLogRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/refresh-tokens', refreshTokenRoutes);
app.use('/api/payment-methods', paymentMethodRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/drugs', drugRoutes);
app.use('/api/drug-carts', drugCartRoutes);
app.use('/api/drug-orders', drugOrderRoutes);
app.use('/api/drug-order-details', drugOrderDetailRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/prescription-drugs', prescriptionDrugRoutes);

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});