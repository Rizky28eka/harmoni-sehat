# Backend API Endpoints

This document provides a summary of the main API endpoints available in the Harmoni Sehat backend. All endpoints are prefixed with `/api`.

## Authentication & Authorization

-   **`/api/auth/register`** (POST): Register a new user.
-   **`/api/auth/login`** (POST): Authenticate a user and receive a JWT.

## User Management (`/api/users`)

*Requires `Authorization: Bearer <token>` header.*

-   **`GET /`** (Protected: `admin`): Get all users.
-   **`GET /:id`** (Protected: `admin`): Get a user by ID.
-   **`PUT /:id`** (Protected: `admin`): Update a user by ID.
-   **`DELETE /:id`** (Protected: `admin`): Delete a user by ID.

## Medical Records (`/api/medicalrecords`)

*Requires `Authorization: Bearer <token>` header. Ownership-based authorization applied.*

-   **`GET /my-record`** (Protected: `patient`): Get the medical record of the logged-in patient.
-   **`POST /`** (Protected: `patient`): Create a medical record for the logged-in patient.
-   **`GET /:id`** (Protected: `admin`, `doctor`, `patient`): Get a medical record by ID. (Patient can only access their own).
-   **`PUT /:id`** (Protected: `admin`, `doctor`, `patient`): Update a medical record by ID. (Patient can only update their own).
-   **`DELETE /:id`** (Protected: `admin`, `doctor`, `patient`): Delete a medical record by ID. (Patient can only delete their own).

## Patient Profiles (`/api/patients`)

*Requires `Authorization: Bearer <token>` header. Ownership-based authorization applied.*

-   **`POST /`** (Protected: any authenticated user): Create a patient profile for the logged-in user.
-   **`GET /me`** (Protected: any authenticated user): Get the patient profile of the logged-in user.
-   **`GET /`** (Protected: `admin`, `doctor`): Get all patient profiles.
-   **`GET /:id`** (Protected: `admin`, `doctor`, `patient`): Get a patient profile by ID. (Patient can only access their own).
-   **`PUT /:id`** (Protected: `admin`, `patient`): Update a patient profile by ID. (Patient can only update their own).
-   **`DELETE /:id`** (Protected: `admin`): Delete a patient profile by ID.

## Doctor Profiles (`/api/doctors`)

*Requires `Authorization: Bearer <token>` header. Ownership-based authorization applied.*

-   **`POST /`** (Protected: `doctor`): Create a doctor profile for the logged-in user.
-   **`GET /me`** (Protected: `doctor`): Get the doctor profile of the logged-in user.
-   **`GET /`** (Protected: `admin`, `patient`, `doctor`): Get all doctor profiles.
-   **`GET /:id`** (Protected: `admin`, `patient`, `doctor`): Get a doctor profile by ID. (Doctor can only access their own).
-   **`PUT /:id`** (Protected: `admin`, `doctor`): Update a doctor profile by ID. (Doctor can only update their own).
-   **`DELETE /:id`** (Protected: `admin`): Delete a doctor profile by ID.

## Role Management (`/api/roles`)

*Requires `Authorization: Bearer <token>` header. Restricted to `admin`.*

-   **`POST /`** (Protected: `admin`): Create a new role.
-   **`GET /`** (Protected: `admin`): Get all roles.
-   **`GET /:id`** (Protected: `admin`): Get a role by ID.
-   **`PUT /:id`** (Protected: `admin`): Update a role by ID.
-   **`DELETE /:id`** (Protected: `admin`): Delete a role by ID.

## Specialization Management (`/api/specializations`)

*Requires `Authorization: Bearer <token>` header.*

-   **`GET /`** (Protected: any authenticated user): Get all specializations.
-   **`GET /:id`** (Protected: any authenticated user): Get a specialization by ID.
-   **`POST /`** (Protected: `admin`): Create a new specialization.
-   **`PUT /:id`** (Protected: `admin`): Update a specialization by ID.
-   **`DELETE /:id`** (Protected: `admin`): Delete a specialization by ID.

## Clinic Management (`/api/clinics`)

*Requires `Authorization: Bearer <token>` header.*

-   **`GET /`** (Protected: any authenticated user): Get all clinics.
-   **`GET /:id`** (Protected: any authenticated user): Get a clinic by ID.
-   **`POST /`** (Protected: `admin`): Create a new clinic.
-   **`PUT /:id`** (Protected: `admin`): Update a clinic by ID.
-   **`DELETE /:id`** (Protected: `admin`): Delete a clinic by ID.

## Drug Management (`/api/drugs`)

*Requires `Authorization: Bearer <token>` header.*

-   **`GET /`** (Protected: any authenticated user): Get all drugs.
-   **`GET /:id`** (Protected: any authenticated user): Get a drug by ID.
-   **`POST /`** (Protected: `admin`, `pharmacist`): Create a new drug.
-   **`PUT /:id`** (Protected: `admin`, `pharmacist`): Update a drug by ID.
-   **`DELETE /:id`** (Protected: `admin`, `pharmacist`): Delete a drug by ID.

## Drug Cart Management (`/api/drugcarts`)

*Requires `Authorization: Bearer <token>` header. Ownership-based authorization applied.*

-   **`POST /`** (Protected: `patient`): Add a drug to the logged-in patient's cart.
-   **`GET /me`** (Protected: `patient`): Get the logged-in patient's drug cart.
-   **`DELETE /me`** (Protected: `patient`): Clear the logged-in patient's drug cart.
-   **`GET /:id`** (Protected: `patient`, `admin`, `pharmacist`): Get a specific drug cart item by ID. (Patient can only access their own).
-   **`PUT /:id`** (Protected: `patient`, `admin`, `pharmacist`): Update a specific drug cart item by ID. (Patient can only update their own).
-   **`DELETE /:id`** (Protected: `patient`, `admin`, `pharmacist`): Delete a specific drug cart item by ID. (Patient can only delete their own).

## Drug Order Management (`/api/drugorders`)

*Requires `Authorization: Bearer <token>` header. Ownership-based authorization applied.*

-   **`POST /`** (Protected: `patient`): Create a new drug order for the logged-in patient.
-   **`GET /me`** (Protected: `patient`): Get all drug orders for the logged-in patient.
-   **`GET /`** (Protected: `admin`, `pharmacist`): Get all drug orders.
-   **`GET /:id`** (Protected: `admin`, `pharmacist`, `patient`): Get a specific drug order by ID. (Patient can only access their own).
-   **`PUT /:id`** (Protected: `admin`, `pharmacist`, `patient`): Update a specific drug order by ID. (Patient can only update their own).
-   **`DELETE /:id`** (Protected: `admin`, `patient`): Delete a specific drug order by ID. (Patient can only delete their own).

## Consultation Management (`/api/consultations`)

*Requires `Authorization: Bearer <token>` header. Ownership-based authorization applied.*

-   **`POST /`** (Protected: `patient`): Create a new consultation.
-   **`GET /me`** (Protected: `patient`, `doctor`): Get consultations for the logged-in patient or doctor.
-   **`GET /`** (Protected: `admin`): Get all consultations.
-   **`GET /:id`** (Protected: `admin`, `patient`, `doctor`): Get a consultation by ID. (Patient/Doctor can only access their own).
-   **`PUT /:id`** (Protected: `admin`, `patient`, `doctor`): Update a consultation by ID. (Patient/Doctor can only update their own).
-   **`DELETE /:id`** (Protected: `admin`, `patient`, `doctor`): Delete a consultation by ID. (Patient/Doctor can only delete their own).

## Chat Message Management (`/api/chatmessages`)

*Requires `Authorization: Bearer <token>` header. Ownership-based authorization applied.*

-   **`POST /`** (Protected: `patient`, `doctor`, `admin`): Create a new chat message.
-   **`GET /consultation/:consultationId`** (Protected: `patient`, `doctor`, `admin`): Get chat messages for a specific consultation.
-   **`GET /`** (Protected: `admin`): Get all chat messages.
-   **`GET /:id`** (Protected: `patient`, `doctor`, `admin`): Get a chat message by ID. (Participant/Admin can access).
-   **`PUT /:id`** (Protected: `patient`, `doctor`, `admin`): Update a chat message by ID. (Sender/Admin can update).
-   **`DELETE /:id`** (Protected: `patient`, `doctor`, `admin`): Delete a chat message by ID. (Sender/Admin can delete).

## Doctor Review Management (`/api/doctorreviews`)

*Requires `Authorization: Bearer <token>` header. Ownership-based authorization applied.*

-   **`POST /`** (Protected: `patient`): Create a new doctor review.
-   **`GET /`** (Protected: any authenticated user): Get all doctor reviews.
-   **`GET /doctor/:doctorId`** (Protected: any authenticated user): Get doctor reviews for a specific doctor.
-   **`GET /:id`** (Protected: `patient`, `admin`, `doctor`): Get a doctor review by ID. (Patient can only access their own).
-   **`PUT /:id`** (Protected: `patient`, `admin`): Update a doctor review by ID. (Patient can only update their own).
-   **`DELETE /:id`** (Protected: `patient`, `admin`): Delete a doctor review by ID. (Patient can only delete their own).

## Practice Schedule Management (`/api/practiceschedules`)

*Requires `Authorization: Bearer <token>` header. Ownership-based authorization applied.*

-   **`POST /`** (Protected: `doctor`): Create a new practice schedule.
-   **`GET /me`** (Protected: `doctor`): Get practice schedules for the logged-in doctor.
-   **`GET /`** (Protected: `admin`): Get all practice schedules.
-   **`GET /:id`** (Protected: `admin`, `doctor`, `patient`): Get a practice schedule by ID. (Doctor can only access their own).
-   **`PUT /:id`** (Protected: `admin`, `doctor`): Update a practice schedule by ID. (Doctor can only update their own).
-   **`DELETE /:id`** (Protected: `admin`, `doctor`): Delete a practice schedule by ID. (Doctor can only delete their own).

## Doctor-Clinic Association Management (`/api/doctorclinics`)

*Requires `Authorization: Bearer <token>` header. Ownership-based authorization applied.*

-   **`POST /`** (Protected: `doctor`): Create a new doctor-clinic association.
-   **`GET /doctor/:doctorId`** (Protected: `doctor`, `admin`): Get doctor-clinic associations for a specific doctor.
-   **`GET /`** (Protected: `admin`): Get all doctor-clinic associations.
-   **`GET /:id`** (Protected: `admin`, `doctor`): Get a doctor-clinic association by ID. (Doctor can only access their own).
-   **`PUT /:id`** (Protected: `admin`, `doctor`): Update a doctor-clinic association by ID. (Doctor can only update their own).
-   **`DELETE /:id`** (Protected: `admin`, `doctor`): Delete a doctor-clinic association by ID. (Doctor can only delete their own).

## Prescription Management (`/api/prescriptions`)

*Requires `Authorization: Bearer <token>` header. Ownership-based authorization applied.*

-   **`POST /`** (Protected: `doctor`): Create a new prescription.
-   **`GET /me`** (Protected: `patient`, `doctor`): Get prescriptions for the logged-in patient or doctor.
-   **`GET /`** (Protected: `admin`): Get all prescriptions.
-   **`GET /:id`** (Protected: `admin`, `patient`, `doctor`): Get a prescription by ID. (Patient/Doctor can only access their own).
-   **`PUT /:id`** (Protected: `admin`, `doctor`, `patient`): Update a prescription by ID. (Patient/Doctor can only update their own).
-   **`DELETE /:id`** (Protected: `admin`, `doctor`, `patient`): Delete a prescription by ID. (Patient/Doctor can only delete their own).

## Prescription Drug Management (`/api/prescriptiondrugs`)

*Requires `Authorization: Bearer <token>` header. Ownership-based authorization applied.*

-   **`POST /`** (Protected: `doctor`): Create a new prescription drug.
-   **`GET /:id`** (Protected: `admin`, `patient`, `doctor`, `pharmacist`): Get a prescription drug by ID. (Patient/Doctor can only access their own).
-   **`PUT /:id`** (Protected: `admin`, `doctor`): Update a prescription drug by ID. (Doctor can only update their own).
-   **`DELETE /:id`** (Protected: `admin`, `doctor`): Delete a prescription drug by ID. (Doctor can only delete their own).
-   **`GET /prescription/:prescriptionId`** (Protected: `admin`, `patient`, `doctor`, `pharmacist`): Get all drugs for a specific prescription.
-   **`GET /`** (Protected: `admin`, `pharmacist`): Get all prescription drugs.

## Health Article Management (`/api/healtharticles`)

*Requires `Authorization: Bearer <token>` header. Ownership-based authorization applied.*

-   **`POST /`** (Protected: `admin`, `doctor`): Create a new health article.
-   **`GET /`** (Protected: any authenticated user): Get all health articles.
-   **`GET /:id`** (Protected: any authenticated user): Get a health article by ID.
-   **`PUT /:id`** (Protected: `admin`, `doctor`): Update a health article by ID. (Author/Admin can update).
-   **`DELETE /:id`** (Protected: `admin`, `doctor`): Delete a health article by ID. (Author/Admin can delete).

## Media Management (`/api/media`)

*Requires `Authorization: Bearer <token>` header. Ownership-based authorization applied.*

-   **`POST /`** (Protected: `admin`, `doctor`, `patient`): Create new media.
-   **`GET /`** (Protected: `admin`): Get all media.
-   **`GET /:id`** (Protected: `admin`, `doctor`, `patient`): Get media by ID. (Owner/Admin can access).
-   **`PUT /:id`** (Protected: `admin`, `doctor`, `patient`): Update media by ID. (Owner/Admin can update).
-   **`DELETE /:id`** (Protected: `admin`, `doctor`, `patient`): Delete media by ID. (Owner/Admin can delete).
-   **`GET /model/:modelType/:modelId`** (Protected: `admin`, `doctor`, `patient`): Get media associated with a specific model.

## Notification Management (`/api/notifications`)

*Requires `Authorization: Bearer <token>` header. Ownership-based authorization applied.*

-   **`POST /`** (Protected: `admin`): Create a new notification.
-   **`GET /me`** (Protected: any authenticated user): Get notifications for the logged-in user.
-   **`GET /`** (Protected: `admin`): Get all notifications.
-   **`GET /:id`** (Protected: any authenticated user): Get a notification by ID. (Owner/Admin can access).
-   **`PUT /:id`** (Protected: any authenticated user): Update a notification by ID. (Owner/Admin can update).
-   **`DELETE /:id`** (Protected: any authenticated user): Delete a notification by ID. (Owner/Admin can delete).

## Payment Method Management (`/api/paymentmethods`)

*Requires `Authorization: Bearer <token>` header.*

-   **`GET /`** (Protected: any authenticated user): Get all payment methods.
-   **`GET /:id`** (Protected: any authenticated user): Get a payment method by ID.
-   **`POST /`** (Protected: `admin`): Create a new payment method.
-   **`PUT /:id`** (Protected: `admin`): Update a payment method by ID.
-   **`DELETE /:id`** (Protected: `admin`): Delete a payment method by ID.

## Transaction Management (`/api/transactions`)

*Requires `Authorization: Bearer <token>` header. Ownership-based authorization applied.*

-   **`POST /`** (Protected: `patient`, `doctor`, `pharmacist`, `admin`): Create a new transaction.
-   **`GET /me`** (Protected: any authenticated user): Get transactions for the logged-in user.
-   **`GET /`** (Protected: `admin`): Get all transactions.
-   **`GET /:id`** (Protected: any authenticated user): Get a transaction by ID. (Owner/Admin can access).
-   **`PUT /:id`** (Protected: any authenticated user): Update a transaction by ID. (Owner/Admin can update).
-   **`DELETE /:id`** (Protected: any authenticated user): Delete a transaction by ID. (Owner/Admin can delete).

## User Profile Management (`/api/userprofiles`)

*Requires `Authorization: Bearer <token>` header. Ownership-based authorization applied.*

-   **`POST /`** (Protected: `patient`, `doctor`, `pharmacist`, `admin`): Create a user profile for the logged-in user.
-   **`GET /me`** (Protected: any authenticated user): Get the user profile of the logged-in user.
-   **`GET /`** (Protected: `admin`): Get all user profiles.
-   **`GET /:id`** (Protected: any authenticated user): Get a user profile by ID. (Owner/Admin can access).
-   **`PUT /:id`** (Protected: any authenticated user): Update a user profile by ID. (Owner/Admin can update).
-   **`DELETE /:id`** (Protected: any authenticated user): Delete a user profile by ID. (Owner/Admin can delete).

## User Role Management (`/api/userroles`)

*Requires `Authorization: Bearer <token>` header. Restricted to `admin`.*

-   **`POST /`** (Protected: `admin`): Create a new user role association.
-   **`GET /`** (Protected: `admin`): Get all user role associations.
-   **`GET /:id`** (Protected: `admin`): Get a user role association by ID.
-   **`GET /user/:userId`** (Protected: `admin`): Get user role associations for a specific user.
-   **`PUT /:id`** (Protected: `admin`): Update a user role association by ID.
-   **`DELETE /:id`** (Protected: `admin`): Delete a user role association by ID.
