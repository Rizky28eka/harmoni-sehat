"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const env_1 = require("./config/env");
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Connect to database
(0, db_1.default)();
// Middleware
app.use(express_1.default.json());
const role_routes_1 = __importDefault(require("./api/role/role.routes"));
const user_routes_1 = __importDefault(require("./api/user/user.routes"));
const patient_routes_1 = __importDefault(require("./api/patient/patient.routes"));
const doctor_routes_1 = __importDefault(require("./api/doctor/doctor.routes"));
const pharmacist_routes_1 = __importDefault(require("./api/pharmacist/pharmacist.routes"));
const admin_routes_1 = __importDefault(require("./api/admin/admin.routes"));
const auth_routes_1 = __importDefault(require("./api/auth/auth.routes"));
const userRole_routes_1 = __importDefault(require("./api/userRole/userRole.routes"));
const userProfile_routes_1 = __importDefault(require("./api/userProfile/userProfile.routes"));
const specialization_routes_1 = __importDefault(require("./api/specialization/specialization.routes"));
const clinic_routes_1 = __importDefault(require("./api/clinic/clinic.routes"));
const doctorClinic_routes_1 = __importDefault(require("./api/doctorClinic/doctorClinic.routes"));
const practiceSchedule_routes_1 = __importDefault(require("./api/practiceSchedule/practiceSchedule.routes"));
const consultation_routes_1 = __importDefault(require("./api/consultation/consultation.routes"));
const chatMessage_routes_1 = __importDefault(require("./api/chatMessage/chatMessage.routes"));
const medicalRecord_routes_1 = __importDefault(require("./api/medicalRecord/medicalRecord.routes"));
const doctorReview_routes_1 = __importDefault(require("./api/doctorReview/doctorReview.routes"));
const healthArticle_routes_1 = __importDefault(require("./api/healthArticle/healthArticle.routes"));
const notification_routes_1 = __importDefault(require("./api/notification/notification.routes"));
const activityLog_routes_1 = __importDefault(require("./api/activityLog/activityLog.routes"));
const media_routes_1 = __importDefault(require("./api/media/media.routes"));
const refreshToken_routes_1 = __importDefault(require("./api/refreshToken/refreshToken.routes"));
const paymentMethod_routes_1 = __importDefault(require("./api/paymentMethod/paymentMethod.routes"));
const transaction_routes_1 = __importDefault(require("./api/transaction/transaction.routes"));
const drug_routes_1 = __importDefault(require("./api/drug/drug.routes"));
const drugCart_routes_1 = __importDefault(require("./api/drugCart/drugCart.routes"));
const drugOrder_routes_1 = __importDefault(require("./api/drugOrder/drugOrder.routes"));
const drugOrderDetail_routes_1 = __importDefault(require("./api/drugOrderDetail/drugOrderDetail.routes"));
const prescription_routes_1 = __importDefault(require("./api/prescription/prescription.routes"));
const prescriptionDrug_routes_1 = __importDefault(require("./api/prescriptionDrug/prescriptionDrug.routes"));
const gemini_routes_1 = __importDefault(require("./api/gemini/gemini.routes"));
// Routes
app.use('/api/v1/roles', role_routes_1.default);
app.use('/api/v1/users', user_routes_1.default);
app.use('/api/v1/patients', patient_routes_1.default);
app.use('/api/v1/doctors', doctor_routes_1.default);
app.use('/api/v1/pharmacists', pharmacist_routes_1.default);
app.use('/api/v1/admins', admin_routes_1.default);
app.use('/api/v1/auth', auth_routes_1.default);
app.use('/api/v1/user-roles', userRole_routes_1.default);
app.use('/api/v1/user-profiles', userProfile_routes_1.default);
app.use('/api/v1/specializations', specialization_routes_1.default);
app.use('/api/v1/clinics', clinic_routes_1.default);
app.use('/api/v1/doctor-clinics', doctorClinic_routes_1.default);
app.use('/api/v1/practice-schedules', practiceSchedule_routes_1.default);
app.use('/api/v1/consultations', consultation_routes_1.default);
app.use('/api/v1/chat-messages', chatMessage_routes_1.default);
app.use('/api/v1/medical-records', medicalRecord_routes_1.default);
app.use('/api/v1/doctor-reviews', doctorReview_routes_1.default);
app.use('/api/v1/health-articles', healthArticle_routes_1.default);
app.use('/api/v1/notifications', notification_routes_1.default);
app.use('/api/v1/activity-logs', activityLog_routes_1.default);
app.use('/api/v1/media', media_routes_1.default);
app.use('/api/v1/refresh-tokens', refreshToken_routes_1.default);
app.use('/api/v1/payment-methods', paymentMethod_routes_1.default);
app.use('/api/v1/transactions', transaction_routes_1.default);
app.use('/api/v1/drugs', drug_routes_1.default);
app.use('/api/v1/drug-carts', drugCart_routes_1.default);
app.use('/api/v1/drug-orders', drugOrder_routes_1.default);
app.use('/api/v1/drug-order-details', drugOrderDetail_routes_1.default);
app.use('/api/v1/prescriptions', prescription_routes_1.default);
app.use('/api/prescription-drugs', prescriptionDrug_routes_1.default);
app.use('/api/v1/gemini', gemini_routes_1.default);
// Error handling middleware
app.use(errorHandler_1.default);
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
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
server.listen(env_1.PORT, () => {
    console.log(`Server running on port ${env_1.PORT}`);
});
