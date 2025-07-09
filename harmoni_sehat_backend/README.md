# Harmoni Sehat Backend API

This is the backend API for the Harmoni Sehat application, built to manage healthcare-related data and services.

## Features

-   **User Authentication & Authorization:** Secure user registration, login, and role-based access control (RBAC) using JWT.
    -   Roles: `admin`, `doctor`, `patient`, `pharmacist`.
-   **Secure CRUD Operations:**
    -   **User Management:** Secure Create, Read, Update, Delete (CRUD) operations for user profiles.
    -   **Medical Records:** Secure and validated CRUD operations for patient medical records, including ownership-based authorization.
    -   **Patient Profiles:** Secure and validated CRUD operations for patient profiles, including ownership-based authorization.
    -   **Doctor Profiles:** Secure and validated CRUD operations for doctor profiles, including ownership-based authorization.
    -   **Role Management:** Secure and validated CRUD operations for roles (admin-only).
    -   **Specialization Management:** Secure and validated CRUD operations for medical specializations.
    -   **Clinic Management:** Secure and validated CRUD operations for clinics.
    -   **Drug Management:** Secure and validated CRUD operations for drugs.
    -   **Drug Cart Management:** Secure and validated CRUD operations for patient drug carts, including ownership-based authorization.
    -   **Drug Order Management:** Secure and validated CRUD operations for patient drug orders, including ownership-based authorization.
    -   **Drug Order Detail Management:** Secure and validated CRUD operations for drug order details.
    -   **Consultation Management:** Secure and validated CRUD operations for consultations, including ownership-based authorization.
    -   **Chat Message Management:** Secure and validated CRUD operations for chat messages, including ownership-based authorization.
    -   **Doctor Review Management:** Secure and validated CRUD operations for doctor reviews, including ownership-based authorization.
    -   **Practice Schedule Management:** Secure and validated CRUD operations for practice schedules, including ownership-based authorization.
    -   **Doctor-Clinic Association Management:** Secure and validated CRUD operations for doctor-clinic associations, including ownership-based authorization.
    -   **Prescription Management:** Secure and validated CRUD operations for prescriptions, including ownership-based authorization.
    -   **Prescription Drug Management:** Secure and validated CRUD operations for prescription drugs, including ownership-based authorization.
    -   **Health Article Management:** Secure and validated CRUD operations for health articles, including ownership-based authorization.
    -   **Media Management:** Secure and validated CRUD operations for media, including ownership-based authorization.
    -   **Notification Management:** Secure and validated CRUD operations for notifications, including ownership-based authorization.
    -   **Payment Method Management:** Secure and validated CRUD operations for payment methods.
    -   **Transaction Management:** Secure and validated CRUD operations for transactions, including ownership-based authorization.
    -   **User Profile Management:** Secure and validated CRUD operations for user profiles, including ownership-based authorization.
    -   **User Role Management:** Secure and validated CRUD operations for user role associations.
    -   **Admin Management:** Secure and validated CRUD operations for admin profiles.
    -   **Activity Log Management:** Secure and validated CRUD operations for activity logs.
    -   **Refresh Token Management:** Secure and validated CRUD operations for refresh tokens.
-   **Data Validation:** Robust input validation using Zod.
-   **Error Handling:** Centralized error handling for consistent API responses.
-   **Database Seeding:** Script to populate the database with dummy data for development and testing.

## Technologies Used

-   **Node.js**
-   **Express.js** (Web Framework)
-   **TypeScript** (Language)
-   **MongoDB** (Database)
-   **Mongoose** (ODM for MongoDB)
-   **JSON Web Tokens (JWT)** (for Authentication)
-   **Bcrypt.js** (for Password Hashing)
-   **Zod** (for Data Validation)
-   **Dotenv** (for Environment Variables)

## Getting Started

Follow these steps to set up and run the backend API locally.

### Prerequisites

-   Node.js (v18 or higher recommended)
-   npm (Node Package Manager)
-   MongoDB Atlas account (or local MongoDB instance)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd harmoni_sehat_project/harmoni_sehat_backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Environment Variables

Create a `.env` file in the `harmoni_sehat_backend` directory and add the following environment variables. Replace the placeholder values with your actual credentials.

```env
# =========================
#  DATABASE
# =========================
MONGO_URI="your_mongodb_atlas_connection_string"
PORT=5000

# =========================
#  AUTHENTICATION & SECURITY
# =========================
JWT_SECRET="a_very_strong_and_long_secret_key_for_jwt"
JWT_EXPIRES_IN="90d"
SESSION_SECRET="another_strong_secret_for_sessions_if_used"
ENCRYPTION_KEY="a_strong_key_for_encryption_if_used"

# =========================
# ☎️ TWILIO (SMS Gateway) - Optional
# =========================
TWILIO_ACCOUNT_SID="your_twilio_account_sid"
TWILIO_AUTH_TOKEN="your_twilio_auth_token"
TWILIO_PHONE_NUMBER="+1234567890"

# =========================
#  GOOGLE OAUTH - Optional
# =========================
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# =========================
#  EMAIL SERVICE - Optional
# =========================
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your_email@gmail.com"
EMAIL_PASS="your_email_app_password"
EMAIL_FROM="Harmoni Sehat <no-reply@harmonisehat.com>"
```

### Database Setup

1.  **Build the project:**
    ```bash
    npm run build
    ```

2.  **Seed the database (WARNING: This will delete all existing data in the connected database):**
    ```bash
    npm run seed
    ```

### Running the API

1.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The API will be running at `http://localhost:5000` (or your specified PORT).

2.  **Start the production server (after building):**
    ```bash
    npm start
    ```

## API Endpoints

For a detailed list of all API endpoints, their methods, and expected request/response formats, please refer to the [API Endpoints Documentation](../../docs/backend/api-endpoints.md).

## Database Schema

For a visual representation and detailed description of the database models and their relationships, please refer to the [Database Schema Documentation](../../docs/backend/database-schema.md).

## Project Structure

```
harmoni_sehat_backend/
├── src/
│   ├── api/                  # Contains modules for different API resources
│   │   ├── auth/             # Authentication (register, login)
│   │   ├── user/             # User CRUD
│   │   ├── medicalRecord/    # Medical Record CRUD
│   │   ├── patient/          # Patient CRUD
│   │   ├── doctor/           # Doctor CRUD
│   │   ├── role/             # Role CRUD
│   │   ├── specialization/   # Specialization CRUD
│   │   ├── clinic/           # Clinic CRUD
│   │   ├── drug/             # Drug CRUD
│   │   ├── pharmacist/       # Pharmacist CRUD
│   │   ├── drugCart/         # Drug Cart CRUD
│   │   ├── drugOrder/        # Drug Order CRUD
│   │   ├── drugOrderDetail/  # Drug Order Detail CRUD
│   │   ├── consultation/     # Consultation CRUD
│   │   ├── chatMessage/      # Chat Message CRUD
│   │   ├── doctorReview/     # Doctor Review CRUD
│   │   ├── practiceSchedule/ # Practice Schedule CRUD
│   │   ├── doctorClinic/     # Doctor Clinic CRUD
│   │   ├── prescription/     # Prescription CRUD
│   │   ├── prescriptionDrug/ # Prescription Drug CRUD
│   │   ├── healthArticle/    # Health Article CRUD
│   │   ├── media/            # Media CRUD
│   │   ├── notification/     # Notification CRUD
│   │   ├── paymentMethod/    # Payment Method CRUD
│   │   ├── transaction/      # Transaction CRUD
│   │   ├── userProfile/      # User Profile CRUD
│   │   ├── userRole/         # User Role CRUD
│   │   ├── admin/            # Admin CRUD
│   │   ├── activityLog/      # Activity Log CRUD
│   │   └── refreshToken/     # Refresh Token CRUD
│   ├── config/               # Database connection, environment variables
│   ├── middlewares/          # Authentication, authorization, validation, error handling
│   ├── models/               # Mongoose schemas for database entities
│   ├── utils/                # Utility functions (AppError, ApiResponse, Seeder)
│   └── index.ts              # Main application entry point
├── .env.example              # Example environment variables file
├── package.json
├── tsconfig.json
└── README.md
```