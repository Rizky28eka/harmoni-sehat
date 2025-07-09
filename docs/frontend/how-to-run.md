# Frontend How-to-Run Guide

This guide provides instructions on how to set up and run the Harmoni Sehat frontend application locally.

## Prerequisites

-   Node.js (v18 or higher recommended)
-   npm (Node Package Manager)

## Installation

1.  **Navigate to the frontend directory:**
    ```bash
    cd harmoni_sehat_project/harmoni_sehat_frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Environment Variables

Create a `.env` file in the `harmoni_sehat_frontend` directory if needed. Typically, frontend applications might need environment variables for API base URLs or public keys.

```env
# Example: Backend API URL
VITE_API_BASE_URL=http://localhost:5000/api
```

## Running the Frontend

1.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The frontend application will typically be available at `http://localhost:5173` (or another port specified by Vite).

2.  **Build for production:**
    ```bash
    npm run build
    ```

3.  **Preview production build:**
    ```bash
    npm run preview
    ```
