"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const db_1 = __importDefault(require("./config/db"));
const env_1 = require("./config/env");
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const AppError_1 = __importDefault(require("./utils/AppError"));
// Import routes
const user_routes_1 = __importDefault(require("./api/user/user.routes"));
const medicalRecord_routes_1 = __importDefault(require("./api/medicalRecord/medicalRecord.routes"));
// Import models to ensure they are registered with Mongoose
require("./models/Role");
require("./models/UserRole");
require("./models/UserProfile");
require("./models/Doctor");
require("./models/Pharmacist");
require("./models/Patient");
require("./models/Admin");
require("./models/Clinic");
require("./models/DoctorClinic");
require("./models/PracticeSchedule");
require("./models/Specialization");
require("./models/ActivityLog");
require("./models/Media");
require("./models/RefreshToken");
require("./models/Notification");
require("./models/HealthArticle");
require("./models/Consultation");
require("./models/MedicalRecord");
require("./models/ChatMessage");
require("./models/DoctorReview");
require("./models/Prescription");
require("./models/Drug");
require("./models/PrescriptionDrug");
require("./models/DrugCart");
require("./models/DrugOrder");
require("./models/DrugOrderDetail");
require("./models/PaymentMethod");
require("./models/Transaction");
const app = (0, express_1.default)();
// Connect to database
(0, db_1.default)();
// Middlewares
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// Routes
app.get('/', (req, res) => {
    res.send('Harmoni Sehat Backend API');
});
app.use('/api/users', user_routes_1.default);
app.use('/api/medicalrecords', medicalRecord_routes_1.default);
// Handle undefined routes
app.all('*', (req, res, next) => {
    next(new AppError_1.default(`Can't find ${req.originalUrl} on this server!`, 404));
});
// Global error handler
app.use(errorHandler_1.default);
// Start server
app.listen(env_1.PORT, () => {
    console.log(`Server running on port ${env_1.PORT}`);
});
