# Harmoni Sehat Project

Welcome to the Harmoni Sehat project, a comprehensive health application designed to provide a seamless experience for patients, doctors, pharmacists, and administrators. This application integrates advanced features such as AI chat for health inquiries, consultation scheduling, drug ordering, and medical record management. Built as a full-stack solution, this project combines a robust Node.js backend with a dynamic Flutter frontend.

## 🚀 Project Goals

The Harmoni Sehat project has the following main objectives:

-   **Patient Empowerment**: Provide tools for patients to manage their health, consult with doctors, order medications, and access health information easily.
-   **Doctor Efficiency**: Streamline consultation processes, schedule management, and patient record access for doctors.
-   **Pharmacy Integration**: Facilitate easy drug ordering and prescription management for pharmacists.
-   **AI-Powered Assistance**: Integrate AI chat for quick health-related queries and information.
-   **Scalable Architecture**: Develop a modular and scalable application capable of handling a growing user base and future feature additions.

## 💻 Technology Stack

### Backend

The Harmoni Sehat backend is built with modern technologies to ensure performance and reliability:

-   **Runtime**: Node.js
-   **Language**: TypeScript
-   **Framework**: Express.js
-   **Database**: MongoDB (with Mongoose ODM)
-   **Authentication**: JWT (JSON Web Tokens)
-   **Validation**: Zod
-   **Testing**: Jest

### Frontend

The Harmoni Sehat frontend is developed for multi-platform, providing a consistent user experience across various devices:

-   **Framework**: Flutter (Dart)
-   **State Management**: GetX
-   **HTTP Client**: Dio
-   **UI/UX**: Material Design 3
-   **Testing**: Flutter Test

### Development Tools

-   **Version Control**: Git
-   **Code Quality**: ESLint, Prettier (Backend), Flutter Analyzer (Frontend)
-   **Package Managers**: npm (Backend), pub (Frontend)

## 📁 Project Structure (Monorepo)

This project is organized as a monorepo, meaning both the backend and frontend applications reside within a single repository. This approach simplifies dependency management, code sharing, and the overall development workflow.

```
harmoni_sehat_project/
├── harmoni_sehat_backend/   # Node.js Express.js backend application
│   ├── src/                 # Source code
│   ├── tests/               # Backend tests
│   ├── package.json         # Backend dependencies and scripts
│   └── ...
├── harmoni_sehat_frontend/  # Flutter mobile and web application
│   ├── lib/                 # Dart source code
│   ├── android/             # Android specific files
│   ├── ios/                 # iOS specific files
│   ├── web/                 # Web specific files
│   ├── pubspec.yaml         # Frontend dependencies
│   └── ...
├── docs/                    # Project documentation
│   ├── backend/             # Backend-specific documentation
│   ├── frontend/            # Frontend-specific documentation
│   └── ...
├── .gitignore               # Git ignore file
├── README.md                # This file
└── LICENSE                  # Project license
```

## ⚙️ How to Run (General)

To get the Harmoni Sehat project up and running locally, you will need to set up both the backend and the frontend components.

### 1. Backend Setup

Navigate to the `harmoni_sehat_backend/` directory and follow the instructions in the [Backend Setup Guide](docs/backend/setup-guide.md).

### 2. Frontend Setup

Navigate to the `harmoni_sehat_frontend/` directory and follow the instructions in the [Frontend How-To-Run Guide](docs/frontend/how-to-run.md).

## 📚 Documentation

Comprehensive documentation for both the backend and frontend can be found in the `docs/` directory:

-   **Backend Documentation**: [docs/backend/](docs/backend/)
-   **Frontend Documentation**: [docs/frontend/](docs/frontend/)

## 🤝 Contributing

We highly welcome contributions to the Harmoni Sehat project! Please refer to the [Contributing Guide](CONTRIBUTING.md) for details on our development workflow, coding standards, and how to submit pull requests.

## 📜 License

This project is licensed under the [MIT License](LICENSE).

## 📞 Contact

For any questions or support, please contact [Rizky Eka](https://github.com/rizky28eka).