import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { openapi } from './docs/openapi';
import errorHandler from './middlewares/errorHandler';
import sanitize from './middlewares/sanitize';
import { AppError } from './utils/AppError';
import { CORS_ORIGINS, NODE_ENV, UPLOAD_DIR } from './config/env';

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
import adminExtraRoutes from './api/admin/admin.extra.routes';
import shopRoutes from './api/shop/shop.routes';
import meRoutes from './api/me/me.routes';
import bookingRoutes from './api/booking/booking.routes';
import paymentRoutes from './api/payment/payment.routes';
const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);

// API docs are mounted before helmet: swagger-ui needs inline scripts that the default CSP blocks.
if (NODE_ENV !== 'production' || process.env.DOCS_ENABLED === 'true') {
  app.get('/api/openapi.json', (_req, res) => res.json(openapi));
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapi, { customSiteTitle: 'Harmoni Sehat API' }));
}
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: CORS_ORIGINS.includes('*') ? true : CORS_ORIGINS,
    credentials: !CORS_ORIGINS.includes('*'),
  }),
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: NODE_ENV === 'test' ? 100000 : 600,
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: 'error', message: 'Too many requests, please try again later.' },
  }),
);

// Payment webhooks need the raw body for signature checks; they are mounted before express.json().
app.use('/api/v1/payments/webhook', express.json({ limit: '1mb' }));

app.use(express.json({ limit: '1mb' }));
app.use(sanitize);

app.use('/uploads', express.static(path.resolve(UPLOAD_DIR), { setHeaders: (res) => res.setHeader('Cache-Control', 'public, max-age=86400') }));

app.get('/', (_req, res) => {
  res.send('Welcome to Harmoni Sehat API!');
});
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});
app.get('/api/v1', (_req, res) => {
  res.send('Welcome to Harmoni Sehat API v1!');
});

app.use('/api/v1/roles', roleRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/patients', patientRoutes);
app.use('/api/v1/doctors', doctorRoutes);
app.use('/api/v1/pharmacists', pharmacistRoutes);
app.use('/api/v1/admins/manage', adminExtraRoutes);
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
app.use('/api/v1/prescription-drugs', prescriptionDrugRoutes);
app.use('/api/v1/gemini', geminiRoutes);
app.use('/api/v1/booking', bookingRoutes);
app.use('/api/v1/me', meRoutes);
app.use('/api/v1/shop', shopRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use((req, _res, next) => next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404)));
app.use(errorHandler);

export default app;
