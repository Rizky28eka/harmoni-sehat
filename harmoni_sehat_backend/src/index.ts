import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import { PORT } from './config/env';
import errorHandler from './middlewares/errorHandler';
import cors from 'cors';

dotenv.config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors()); // Add CORS middleware
app.use(express.json());

import roleRoutes from './api/role/role.routes';
import userRoutes from './api/user/user.routes';
import patientRoutes from './api/patient/patient.routes';
import doctorRoutes from './api/doctor/doctor.routes';
import pharmacistRoutes from './api/pharmacist/pharmacist.routes';
import adminRoutes from './api/admin/admin.routes';
import authRoutes from './api/auth/auth.routes';
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
import geminiRoutes from './api/gemini/gemini.routes';

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to Harmoni Sehat API!');
});

app.get('/api/v1', (req, res) => {
    res.send('Welcome to Harmoni Sehat API v1!');
});

app.use('/api/v1/roles', roleRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/patients', patientRoutes);
app.use('/api/v1/doctors', doctorRoutes);
app.use('/api/v1/pharmacists', pharmacistRoutes);
app.use('/api/v1/admins', adminRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user-roles', userRoleRoutes);
app.use('/api/v1/user-profiles', userProfileRoutes);
app.use('/api/v1/specializations', specializationRoutes);
app.use('/api/v1/clinics', clinicRoutes);
app.use('/api/v1/doctor-clinics', doctorClinicRoutes);
app.use('/api/v1/practice-schedules', practiceScheduleRoutes);
app.use('/api/v1/consultations', consultationRoutes);
app.use('/api/v1/chat-messages', chatMessageRoutes);
app.use('/api/v1/medical-records', medicalRecordRoutes);
app.use('/api/v1/doctor-reviews', doctorReviewRoutes);
app.use('/api/v1/health-articles', healthArticleRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/activity-logs', activityLogRoutes);
app.use('/api/v1/media', mediaRoutes);
app.use('/api/v1/refresh-tokens', refreshTokenRoutes);
app.use('/api/v1/payment-methods', paymentMethodRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/drugs', drugRoutes);
app.use('/api/v1/drug-carts', drugCartRoutes);
app.use('/api/v1/drug-orders', drugOrderRoutes);
app.use('/api/v1/drug-order-details', drugOrderDetailRoutes);
app.use('/api/v1/prescriptions', prescriptionRoutes);
app.use('/api/prescription-drugs', prescriptionDrugRoutes);
app.use('/api/v1/gemini', geminiRoutes);

// Error handling middleware
app.use(errorHandler);

import http from 'http';
import { Server } from 'socket.io';

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for now, refine in production
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  // Example: Listen for chat messages
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg); // Broadcast to all connected clients
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});