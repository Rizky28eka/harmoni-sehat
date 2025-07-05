# Harmoni Sehat Frontend

![Flutter Version](https://img.shields.io/badge/Flutter-3.x-blue?logo=flutter)
![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)

The `Harmoni Sehat` mobile application is a health platform built with Flutter and the GetX architecture. It is designed to facilitate seamless interaction between patients, doctors, and pharmacists, providing essential features for integrated health management.

## Key Features

*   **User Authentication**: Secure login, registration, and OTP verification system.
*   **Role-Based Navigation**: Users are directed to a dashboard tailored to their role (Patient, Doctor, Pharmacist) upon login.
*   **Profile Management**: Users can manage their personal and professional information.
*   **Online Consultations**: (Feature to be further developed/detailed)
*   **Prescription Management**: (Feature to be further developed/detailed)
*   **Medication Information**: (Feature to be further developed/detailed)

## Folder Structure

The project follows a modular architecture powered by GetX, separating features by user role to enhance scalability and ease of maintenance.

```
lib/
├── main.dart
└── app/
    ├── data/             # Repositories, providers, models, etc.
    ├── modules/          # Core application modules, divided by role
    │   ├── pasien/       # Module for the Patient role
    │   │   ├── bindings/
    │   │   ├── controllers/
    │   │   └── views/
    │   ├── dokter/       # Module for the Doctor role
    │   │   └── ...
    │   └── apoteker/     # Module for the Pharmacist role
    │       └── ...
    ├── routes/           # Application route definitions (AppPages, AppRoutes)
    └── shared/           # Shared components, utilities, constants, and themes
        ├── widgets/
        ├── utils/
        ├── constants/
        └── theme/
```

## Local Development Setup

Follow these steps to run the `Harmoni Sehat Frontend` project in your local environment.

### Prerequisites

*   [Flutter SDK](https://flutter.dev/docs/get-started/install) (Latest stable version recommended)
*   [Android Studio](https://developer.android.com/studio) or [Xcode](https://developer.apple.com/xcode/) (for mobile development)
*   A code editor like [VS Code](https://code.visualstudio.com/) with the Flutter extension.

### Steps

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/your-username/harmoni_sehat_project.git
    cd harmoni_sehat_project/harmoni_sehat_frontend
    ```

2.  **Install Dependencies**:
    Run the following command in your terminal to download all required dependencies:
    ```bash
    flutter pub get
    ```

3.  **Platform Setup (Android/iOS)**:
    *   Ensure you have a configured emulator or a physical device connected.
    *   Run `flutter doctor` to verify your setup and resolve any issues.
    *   For iOS, you may need to run `pod install` in the `ios/` directory.

4.  **Run the Application**:
    Once dependencies are installed and your platform is configured, you can run the app:
    ```bash
    flutter run
    ```
    Select an available device or emulator when prompted.

## Core Dependencies

This project relies on several key dependencies:

*   `get`: For state management, dependency injection, and route management.
*   `http`: For making HTTP requests to the backend API.
*   `shared_preferences`: For storing simple key-value data locally.
*   `get_storage`: A fast, extra-light, and synchronous key-value storage solution.
*   `font_awesome_flutter`: For a wide range of icons.
*   `geolocator` & `geocoding`: For location-based services.
*   `cupertino_icons`: For iOS-style icons.

## Contribution

(Contribution guidelines can be added here in the future.)

## License

(License information can be added here in the future.)
