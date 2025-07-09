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