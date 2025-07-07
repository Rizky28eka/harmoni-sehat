# Harmoni Sehat Backend

Backend API for the Harmoni Sehat application, a comprehensive Indonesian health management platform.

## Project Structure

```
harmoni_sehat_backend/
├── config/             # Database configuration
├── controllers/        # Request handlers
├── middlewares/        # Custom middleware (error handling, etc.)
├── models/             # Mongoose models
├── routes/             # API routes
├── services/           # Business logic
├── scripts/            # Scripts (seeding, etc.)
├── .env.example        # Example environment variables
├── package.json
└── server.js           # Main application file
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm (v8+)
- MongoDB

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/harmoni_sehat_project.git
   cd harmoni_sehat_project/harmoni_sehat_backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `harmoni_sehat_backend` directory and add the following environment variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key_for_token_signing
   ENCRYPTION_KEY=your_32_byte_hex_encryption_key_for_phone_numbers
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_google_app_password
   EMAIL_FROM="Harmoni Sehat <no-reply@harmonisehat.com>"
   GOOGLE_CLIENT_ID=your_google_oauth_client_id
   GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
   ```

### Running the Server

- To start the server in development mode (with hot-reloading):
  ```bash
  npm run dev
  ```

- To start the server in production mode:
  ```bash
  npm start
  ```

The server will be running at `http://localhost:3001`.

### Database Migration & Seeding

Before running the application for the first time or after significant schema changes, you should run database migrations. This will drop existing collections and create new ones based on your Mongoose models, ensuring your database schema is up-to-date.

To run migrations (this will clear your database data):
```bash
cd harmoni_sehat_backend
npm run migrate -- --rollback && npm run migrate
```

To populate the database with dummy data (after migration):
```bash
cd harmoni_sehat_backend
npm run seed
```

This will execute the `scripts/seed.js` file, which uses `@faker-js/faker` to generate realistic Indonesian patient data, including custom user IDs and encrypted phone numbers.

## Authentication Features

This backend implements a robust authentication system with the following features:

- **Email/Password Registration & Login:** Standard user registration and login with secure password hashing (bcrypt).
- **Email Verification:** New user accounts require email verification using a one-time code sent via Nodemailer.
- **Google OAuth 2.0 Integration:** Users can register and log in using their Google accounts. Google users are automatically verified.
- **Encrypted Phone Numbers:** Sensitive phone number data is encrypted at rest using AES-256-GCM, ensuring privacy.
- **Unique Phone Number Check:** Despite encryption, the system can still check for unique phone numbers during registration using a secure hashing mechanism.
- **Custom User IDs:** Each user is assigned a unique, role-based custom ID (e.g., `08-XXXXXXX` for Pasien, `10-XXXXXXX` for Dokter, `20-XXXXXXX` for Apoteker, `04-XXXXXXX` for Admin).
- **Password Reset:** Secure password reset functionality using OTP (One-Time Password) sent to the user's email.
- **Protected Routes:** API endpoints are protected using JWT (JSON Web Tokens) for secure access control.

## API Documentation

### Auth API
- **POST /api/auth/register**
  - Description: Register a new user.
  - Request Body:
    ```json
    {
      "email": "user@example.com",
      "nama_lengkap": "Nama Lengkap",
      "no_hp": "081234567890",
      "password": "StrongPassword123!",
      "confirmPassword": "StrongPassword123!",
      "role": "Pasien" // or "Dokter", "Apoteker"
      // Additional fields for Dokter/Apoteker roles
      // "spesialisasi": "Umum",
      // "noIzinPraktik": "SIP12345",
      // "alamatKlinik": "Jl. Contoh No. 1",
      // "noSTRA": "STRA12345",
      // "alamatApotek": "Jl. Apotek No. 1"
    }
    ```
  - Response: Success message and email for verification.

- **POST /api/auth/verify-account**
  - Description: Verify user account with code.
  - Request Body:
    ```json
    {
      "email": "user@example.com",
      "code": "123456"
    }
    ```
  - Response: Success message.

- **POST /api/auth/login**
  - Description: Log in a user.
  - Request Body:
    ```json
    {
      "username": "user@example.com",
      "password": "StrongPassword123!",
      "role": "Pasien" // or "Dokter", "Apoteker"
    }
    ```
  - Response: User data and JWT token.

- **GET /api/auth/google**
  - Description: Initiate Google OAuth login. Redirects to Google consent screen.

- **GET /api/auth/google/callback**
  - Description: Google OAuth callback URL. Handles successful Google login/registration.

- **POST /api/auth/forgot-password**
  - Description: Request OTP for password reset.
  - Request Body:
    ```json
    {
      "email": "user@example.com"
    }
    ```
  - Response: Success message (OTP sent to email).

- **POST /api/auth/reset-password**
  - Description: Reset password using OTP.
  - Request Body:
    ```json
    {
      "email": "user@example.com",
      "otp": "123456",
      "newPassword": "NewStrongPassword123!"
    }
    ```
  - Response: Success message.

- **GET /api/auth/protected**
  - Description: Example of a protected route. Requires JWT in Authorization header.
  - Headers: `Authorization: Bearer <token>`
  - Response: Protected data.

- **GET /api/auth/profile**
  - Description: Get authenticated user's profile. Requires JWT.
  - Headers: `Authorization: Bearer <token>`
  - Response: User profile data.

- **PUT /api/auth/profile**
  - Description: Update authenticated user's profile. Requires JWT.
  - Headers: `Authorization: Bearer <token>`
  - Request Body:
    ```json
    {
      "nama_lengkap": "Updated Name",
      "no_hp": "089876543210"
    }
    ```
  - Response: Updated user profile data.

- **PUT /api/auth/change-password**
  - Description: Change authenticated user's password. Requires JWT.
  - Headers: `Authorization: Bearer <token>`
  - Request Body:
    ```json
    {
      "currentPassword": "OldStrongPassword123!",
      "newPassword": "NewStrongPassword123!"
    }
    ```
  - Response: Success message.

- **POST /api/auth/logout**
  - Description: Log out a user. Requires JWT.
  - Headers: `Authorization: Bearer <token>`
  - Response: Success message.

### Pasien API

- **GET /api/pasiens**
  - Description: Get all pasiens.
  - Response: An array of pasien objects.

- **GET /api/pasiens/:id**
  - Description: Get a single pasien by ID.
  - Response: A single pasien object.

- **POST /api/pasiens**
  - Description: Create a new pasien.
  - Request Body:
    ```json
    {
      "nama": "John Doe",
      "nik": "1234567890123456",
      "tanggal_lahir": "1990-01-01",
      "jenis_kelamin": "Laki-laki",
      "alamat": "Jl. Jend. Sudirman No. 1, Jakarta",
      "no_telepon": "081234567890"
    }
    ```
  - Response: The newly created pasien object.

- **PUT /api/pasiens/:id**
  - Description: Update an existing pasien.
  - Request Body: Same as POST request.
  - Response: The updated pasien object.

- **DELETE /api/pasiens/:id**
  - Description: Delete a pasien.
  - Response: The deleted pasien object.