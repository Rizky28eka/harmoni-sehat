# Harmoni Sehat Backend API

Welcome to the backend API documentation for the Harmoni Sehat application. This backend is built to comprehensively manage healthcare-related data and services, providing a strong foundation for the frontend application.

## Overview

The Harmoni Sehat backend is a RESTful API developed using Node.js, Express.js, and TypeScript. MongoDB is used as the primary database, modeled with Mongoose. The main focus of this backend is on security, scalability, and ease of maintenance, by providing various endpoints for health data management.

## Key Features

The Harmoni Sehat backend provides the following core functionalities:

-   **User Authentication & Authorization**: Secure user registration, login, and role-based access control (RBAC) using JSON Web Tokens (JWT). Supported roles include `admin`, `doctor`, `patient`, and `pharmacist`.
-   **Secure CRUD Operations**: Provides secure and validated Create, Read, Update, Delete (CRUD) operations for various data entities, including:
    -   User Management
    -   Medical Records
    -   Patient Profiles
    -   Doctor Profiles
    -   Role Management (admin-only)
    -   Specialization Management
    -   Clinic Management
    -   Drug Management
    -   Drug Cart Management
    -   Drug Order Management
    -   Drug Order Detail Management
    -   Consultation Management
    -   Chat Message Management
    -   Doctor Review Management
    -   Practice Schedule Management
    -   Doctor-Clinic Association Management
    -   Prescription Management
    -   Prescription Drug Management
    -   Health Article Management
    -   Media Management
    -   Notification Management
    -   Payment Method Management
    -   Transaction Management
    -   User Profile Management
    -   User Role Management
    -   Admin Management
    -   Activity Log Management
    -   Refresh Token Management
-   **Data Validation**: Robust input validation using Zod to ensure data integrity and cleanliness.
-   **Error Handling**: Centralized error handling system for consistent and informative API responses.
-   **Database Seeding**: Script to populate the database with dummy data, facilitating development and testing.

## Technologies Used

-   **Node.js**: JavaScript runtime environment.
-   **Express.js**: Minimalist and flexible web framework for Node.js.
-   **TypeScript**: Superset of JavaScript that adds static typing.
-   **MongoDB**: Document-based NoSQL database.
-   **Mongoose**: Object Data Modeling (ODM) for MongoDB.
-   **JSON Web Tokens (JWT)**: For token-based authentication.
-   **Bcrypt.js**: For secure password hashing.
-   **Zod**: For data schema validation.
-   **Dotenv**: For environment variable management.

## Getting Started

Follow these steps to set up and run the backend API locally.

### Prerequisites

Ensure you have the following software installed:

-   **Node.js**: Version 18 or higher recommended.
-   **npm**: Node Package Manager (usually installed with Node.js).
-   **MongoDB Atlas Account**: Or a running local MongoDB instance.

### Installation

1.  **Clone the repository**: Navigate to the main project directory (`harmoni_sehat_project/`) and clone this repository.

    ```bash
    git clone <repository_url>
    cd harmoni_sehat_project/harmoni_sehat_backend
    ```

2.  **Install dependencies**: From the `harmoni_sehat_backend/` directory, run the following command to install all project dependencies:

    ```bash
    npm install
    ```

### Environment Variables

Create a `.env` file in the `harmoni_sehat_backend/` directory and add the following environment variables. Replace the placeholder values with your actual credentials and configurations. For more details, refer to `docs/backend/env.example.md`.

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

1.  **Build the project**: Before seeding, ensure the project has been built.

    ```bash
    npm run build
    ```

2.  **Seed the database (WARNING: This will delete all existing data in the connected database)**:

    ```bash
    npm run seed
    ```

### Running the API

1.  **Start the development server**: To run the server in development mode with hot-reloading:

    ```bash
    npm run dev
    ```
    The API will be running at `http://localhost:5000` (or your specified PORT).

2.  **Start the production server (after building)**: To run the production server (after you have run `npm run build`):

    ```bash
    npm start
    ```

## Additional Documentation

For more information about the Harmoni Sehat backend, please refer to the following documents in the `docs/backend/` directory:

-   **API Endpoints**: A complete list of API endpoints, methods, and expected request/response formats. [View Documentation](docs/backend/api-endpoints.md)
-   **Database Schema**: Visual representation and detailed description of database models and their relationships. [View Documentation](docs/backend/database-schema.md)
-   **Setup Guide**: More detailed setup instructions. [View Documentation](docs/backend/setup-guide.md)

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