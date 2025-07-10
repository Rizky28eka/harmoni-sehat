# Harmoni Sehat Frontend Application

Welcome to the documentation for the Harmoni Sehat frontend application. This application is built using Flutter, enabling cross-platform development for mobile (Android & iOS) and web from a single codebase. This frontend is designed to interact with the Harmoni Sehat backend API, providing an intuitive and responsive user interface for all health features.

## Overview

The Harmoni Sehat frontend is a comprehensive user interface for the health application. It allows users to:

-   Access health information and articles.
-   Conduct medical consultations.
-   Manage personal medical records.
-   Order medications and view transaction history.
-   Interact with chat features, including an AI Chatbot.
-   Manage user profiles and preferences.

## Key Features

-   **Responsive User Interface**: Designed to provide an optimal experience across various screen sizes and devices.
-   **Efficient State Management**: Utilizes GetX for reactive state management, ensuring fast and efficient UI updates.
-   **Intuitive Navigation**: An easy-to-use navigation system with GetX for seamless page transitions.
-   **API Integration**: Smooth communication with the Harmoni Sehat backend to retrieve and send data.
-   **Authentication & Authorization**: Secure handling of user sessions with JWT.
-   **Modularity**: A modular project structure simplifies feature development and maintenance.

## Technologies Used

-   **Framework**: Flutter (Dart)
-   **State Management**: GetX
-   **HTTP Client**: Dio
-   **UI/UX**: Material Design 3
-   **Local Storage**: SharedPreferences, Hive

## Getting Started

Follow these steps to set up and run the Harmoni Sehat frontend application locally.

### Prerequisites

Ensure you have the following software installed:

-   **Flutter SDK**: The latest stable version. You can verify your installation with `flutter doctor`.
-   **Code Editor**: Visual Studio Code with Flutter/Dart extensions, or Android Studio/IntelliJ IDEA with Flutter plugins.

### Installation

1.  **Clone the repository**: Navigate to the main project directory (`harmoni_sehat_project/`) and clone this repository.

    ```bash
    git clone <repository_url>
    cd harmoni_sehat_project/harmoni_sehat_frontend
    ```

2.  **Install dependencies**: From the `harmoni_sehat_frontend/` directory, run the following command to install all required Dart dependencies:

    ```bash
    flutter pub get
    ```

### Running the Application

Ensure the Harmoni Sehat backend is running and accessible by the frontend. To run the application, you can choose your target platform:

-   **On Android Device / Emulator**: Ensure a device is connected or an emulator is running.

    ```bash
    flutter run
    ```

-   **On iOS Device / Simulator**: Requires macOS with Xcode installed.

    ```bash
    flutter run
    ```

-   **In a Web Browser**: For quick development, use Chrome.

    ```bash
    flutter run -d chrome
    ```

    For other running options, please refer to the [Frontend How-To-Run Guide](docs/frontend/how-to-run.md).

## Additional Documentation

For more information about the Harmoni Sehat frontend, please refer to the following documents in the `docs/frontend/` directory:

-   **Frontend How-To-Run Guide**: Detailed steps to run the application on various platforms. [View Documentation](docs/frontend/how-to-run.md)
-   **Project Structure**: In-depth explanation of the project's folder structure and architecture. [View Documentation](docs/frontend/project-structure.md)
-   **State Management, DI, & Navigation**: How GetX is used to manage state, dependency injection, and navigation. [View Documentation](docs/frontend/state-management.md)
-   **API Integration**: Details on how the frontend communicates with the backend. [View Documentation](docs/frontend/api-integration.md)

## Project Structure

```
harmoni_sehat_frontend/
├── lib/                 # Dart source code
│   ├── main.dart        # Application entry point
│   ├── app/             # Core application configuration and feature modules
│   │   ├── modules/     # Feature modules (e.g., auth, chat)
│   │   ├── routes/      # Navigation route definitions
│   │   └── utils/       # General utility functions
│   └── shared/          # Shared components, services, and models
│       ├── widgets/     # Reusable UI widgets
│       ├── services/    # Classes for API integration
│       ├── models/      # Data model definitions
│       └── constants/   # Application constants
├── android/             # Android-specific configuration
├── ios/                 # iOS-specific configuration
├── web/                 # Web-specific configuration
├── pubspec.yaml         # Flutter dependencies and project metadata
└── README.md            # This file
```