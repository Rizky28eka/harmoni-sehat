# Harmoni Sehat Backend Documentation

This document provides a comprehensive overview of the backend project for the Harmoni Sehat application, built with Node.js, Express.js, and MongoDB.

## General Description

The backend serves as the backbone for the Harmoni Sehat application, offering a complete RESTful API to manage various data models, including users, doctors, patients, pharmacies, medications, consultations, and more. The architecture has been refactored to use Mongoose and a generic, reusable CRUD controller, ensuring scalability, maintainability, and rapid development.

- **Framework:** Express.js
- **Language:** JavaScript (Node.js)
- **Database:** MongoDB (via Mongoose ODM)
- **Package Manager:** npm

## Local Development Setup

Follow these steps to install and run the backend project in your local environment.

### Prerequisites

Ensure you have the following software installed:

- [Node.js](https://nodejs.org/en/download/) (LTS version recommended)
- [npm](https://www.npmjs.com/get-npm) (usually included with Node.js)
- [MongoDB](https://www.mongodb.com/try/download/community) (or access to a MongoDB instance, e.g., MongoDB Atlas)

### Installation Steps

1.  **Clone the Repository:**
    ```bash
    git clone <YOUR_REPOSITORY_URL>
    cd harmoni_sehat_project/harmoni_sehat_backend
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the `harmoni_sehat_backend` root directory. You can use the following as a template:

    ```dotenv
    # MongoDB Configuration
    # Example for a local MongoDB instance
    MONGO_URI=mongodb://localhost:27017/harmoni_sehat_db

    # Example for MongoDB Atlas
    # MONGO_URI=mongodb+srv://<user>:<password>@<cluster-url>/harmoni_sehat_db?retryWrites=true&w=majority

    # Application Configuration
    PORT=3000
    JWT_SECRET=your_strong_jwt_secret_key # Replace with a strong secret key
    ```
    Replace the placeholder values with your actual database credentials and a secure JWT secret.

4.  **Seed the Database (Optional):**
    To populate the database with sample data using the custom seeder script:
    ```bash
    npm run seed-mongo
    ```

5.  **Run the Backend Server:**
    ```bash
    npm start
    ```
    The server will run on `http://localhost:3000` (or the port specified in your `.env` file).

## Backend Folder Structure

The backend directory is organized around a generic, resource-based API structure to promote code reuse and simplify maintenance.

```
harmoni_sehat_backend/
├───src/
│   ├───api/
│   │   ├───{resource_name}/
│   │   │   └───{resource_name}.route.js  # Defines API endpoints for a model
│   │   ├───auth/                       # Authentication-specific routes & controller
│   │   └───crud.controller.js          # Generic, reusable CRUD logic
│   ├───config/
│   │   ├───db.js                       # MongoDB connection logic
│   │   └───indonesiaLocations.js       # Static location data
│   ├───models/                         # Mongoose schema definitions for all models
│   └───app.js                          # Main Express.js application setup and route mounting
├───.env                              # Environment variables (ignored by git)
├───package.json                      # Project metadata and dependencies
├───seedMongo.js                      # Script for seeding the database
└───server.js                         # Main application entry point
```

## Key Scripts

-   **`npm install`**: Installs all project dependencies.
-   **`npm start`**: Starts the backend server.
-   **`npm run seed-mongo`**: Clears and seeds the database with a complete set of sample data.

## API Architecture

This backend employs a generic controller pattern (`crud.controller.js`) that provides standard **Create, Read, Update, and Delete** operations for all Mongoose models. This approach dramatically reduces boilerplate code.

Each resource (e.g., `pasiens`, `doctors`) has a simple route file that wires up its endpoints to the generic controller. The controller also includes a powerful `APIFeatures` class, enabling advanced filtering, sorting, field selection, and pagination directly through URL query parameters.

## Error Handling

The API uses centralized error handling to provide consistent and meaningful JSON error responses, typically including a `status` and `message` field.
