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

The server will be running at `http://localhost:5000`.

### Seeding the Database

To populate the database with dummy data, run the following command:

```bash
npm run seed
```

This will execute the `scripts/seed.js` file, which uses `@faker-js/faker` to generate realistic Indonesian patient data.

## API Documentation

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