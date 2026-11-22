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
-   **Real-time**: Socket.IO
-   **Testing**: Jest + Supertest + mongodb-memory-server

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

## ✨ Fitur

- **Pasien**: cari dokter (filter spesialisasi/rating/biaya), booking slot + pembayaran, chat real-time & video call, rekam medis (PDF), resep → tebus di apotek, toko obat (keranjang, checkout, pelacakan), asisten AI (deteksi darurat + rekomendasi dokter), pengingat obat, artikel kesehatan, notifikasi.
- **Dokter**: jadwal praktik, antrean harian, konsultasi, rekam medis & resep digital, ulasan.
- **Apoteker**: antrean pesanan, pengiriman, manajemen stok.
- **Admin**: verifikasi STR/SIPA, statistik.
- **Keamanan**: RBAC + row-level access, refresh token berotasi, rate limiting, helmet, sanitasi NoSQL injection, enkripsi field rekam medis (AES-256-GCM), hapus akun (UU PDP).

## ⚙️ Menjalankan

### Cepat dengan Docker
```bash
cp harmoni_sehat_backend/.env.example harmoni_sehat_backend/.env   # isi JWT_SECRET
docker compose up --build
docker compose exec api node dist/utils/seeder.js   # opsional: data demo (non-production)
```

### Manual
```bash
# Backend (butuh MongoDB)
cd harmoni_sehat_backend
cp .env.example .env        # WAJIB isi JWT_SECRET dan MONGO_URI
npm install
npm run seed                # data demo (password: Harmoni123!)
npm run dev
npm test                    # 39 test integrasi (MongoDB in-memory)

# Frontend
cd harmoni_sehat_frontend
flutter pub get
flutter run --dart-define=API_BASE_URL=http://<IP>:8000/api/v1
flutter test
```

Dokumentasi lengkap: [API](docs/backend/api-reference.md) · [Frontend](docs/frontend/how-to-run.md).

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