import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './config/db';
import { PORT } from './config/env';
import errorHandler from './middlewares/errorHandler';
import AppError from './utils/AppError';

// Import routes
import userRoutes from './api/user/user.routes';
import medicalRecordRoutes from './api/medicalRecord/medicalRecord.routes';

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

app.use('/api/users', userRoutes);
app.use('/api/medicalrecords', medicalRecordRoutes);

// Handle undefined routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
