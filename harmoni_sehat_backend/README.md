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

## Database Schema & Relationship Overview

This section provides a high-level overview of the database schema used in the Harmoni Sehat backend application. It aims to help new developers quickly understand the data structure, the primary function of each collection (table), key fields, and the relationships between them.

The database uses MongoDB, a NoSQL document database. Mongoose ODM is used to define application-level schemas, ensuring data structure and validation. Each "table" described below represents a Mongoose Model (collection) in the MongoDB database.

### Key Collections and Their Functions

Here's a summary of the most important collections, their main purpose, and key fields:

*   **User**
    *   **Function:** Stores fundamental user authentication information (email, password, role). This is the base for all user types.
    *   **Key Fields:** `_id` (ObjectId), `email` (String, unique), `password` (String), `role` (String, Enum: 'pasien', 'doctor', 'apoteker', 'admin'), `is_active` (Boolean).

*   **Pasien**
    *   **Function:** Stores detailed profile information for users with the 'pasien' role.
    *   **Key Fields:** `_id` (ObjectId), `user_id` (ObjectId, Foreign Key to `User`, unique), `nama_lengkap` (String), `tanggal_lahir` (Date), `jenis_kelamin` (String).

*   **Doctor**
    *   **Function:** Stores detailed professional information for users with the 'doctor' role.
    *   **Key Fields:** `_id` (ObjectId), `user_id` (ObjectId, Foreign Key to `User`, unique), `nama_lengkap` (String), `no_sip` (String, unique), `spesialisasi_id` (ObjectId, Foreign Key to `Spesialisasi`), `tarif_konsultasi` (Number).

*   **Apoteker**
    *   **Function:** Stores detailed professional information for users with the 'apoteker' role.
    *   **Key Fields:** `_id` (ObjectId), `user_id` (ObjectId, Foreign Key to `User`, unique), `nama_lengkap` (String), `no_sipa` (String, unique), `apotek_id` (ObjectId, Foreign Key to `Apotek`).

*   **Admin**
    *   **Function:** Stores detailed profile information for users with the 'admin' role.
    *   **Key Fields:** `_id` (ObjectId), `user_id` (ObjectId, Foreign Key to `User`, unique), `nama_lengkap` (String), `level_akses` (String).

*   **Appointment**
    *   **Function:** Manages scheduled appointments between patients and doctors.
    *   **Key Fields:** `_id` (ObjectId), `pasien_id` (ObjectId, Foreign Key to `Pasien`), `doctor_id` (ObjectId, Foreign Key to `Doctor`), `kode_appointment` (String, unique), `tanggal_appointment` (Date), `status` (String).

*   **Konsultasi**
    *   **Function:** Stores details of consultation sessions, including patient complaints, doctor's diagnosis, and consultation status.
    *   **Key Fields:** `_id` (ObjectId), `pasien_id` (ObjectId, Foreign Key to `Pasien`), `doctor_id` (ObjectId, Foreign Key to `Doctor`), `kode_konsultasi` (String, unique), `tanggal_konsultasi` (Date), `status` (String).

*   **Resep**
    *   **Function:** Stores prescription details issued by doctors, linking to specific drugs and pharmacies.
    *   **Key Fields:** `_id` (ObjectId), `konsultasi_id` (ObjectId, Foreign Key to `Konsultasi`, unique), `doctor_id` (ObjectId, Foreign Key to `Doctor`), `pasien_id` (ObjectId, Foreign Key to `Pasien`), `apotek_id` (ObjectId, Foreign Key to `Apotek`), `kode_resep` (String, unique), `status` (String).

*   **Obat**
    *   **Function:** Contains comprehensive information about various medications available in the system.
    *   **Key Fields:** `_id` (ObjectId), `nama_obat` (String), `kategori_obat_id` (ObjectId, Foreign Key to `KategoriObat`), `bentuk_obat` (String), `harga` (Number).

*   **Apotek**
    *   **Function:** Stores information about pharmacies, including location, contact, and operational hours.
    *   **Key Fields:** `_id` (ObjectId), `nama_apotek` (String), `alamat` (String), `email` (String, unique), `provinsi_id` (ObjectId, Foreign Key to `Provinsi`), `kota_id` (ObjectId, Foreign Key to `Kota`).

*   **StokObat**
    *   **Function:** Manages the inventory of drugs at each pharmacy.
    *   **Key Fields:** `_id` (ObjectId), `obat_id` (ObjectId, Foreign Key to `Obat`), `apotek_id` (ObjectId, Foreign Key to `Apotek`), `jumlah_stok` (Number), `tanggal_kadaluarsa` (Date).

*   **Pembayaran**
    *   **Function:** Records all payment transactions within the system, linking to consultations or prescriptions.
    *   **Key Fields:** `_id` (ObjectId), `konsultasi_id` (ObjectId, Foreign Key to `Konsultasi`), `resep_id` (ObjectId, Foreign Key to `Resep`), `pasien_id` (ObjectId, Foreign Key to `Pasien`), `kode_pembayaran` (String, unique), `total_bayar` (Number), `status_pembayaran` (String).

*   **Pengiriman**
    *   **Function:** Tracks the delivery of prescriptions from pharmacies to patients.
    *   **Key Fields:** `_id` (ObjectId), `resep_id` (ObjectId, Foreign Key to `Resep`, unique), `kurir_id` (ObjectId, Foreign Key to `Kurir`), `alamat_pengiriman` (String), `status_pengiriman` (String).

*   **MedicalRecord**
    *   **Function:** Stores detailed medical records for patients, including diagnoses and treatments.
    *   **Key Fields:** `_id` (ObjectId), `pasien_id` (ObjectId, Foreign Key to `Pasien`), `konsultasi_id` (ObjectId, Foreign Key to `Konsultasi`), `doctor_id` (ObjectId, Foreign Key to `Doctor`), `tanggal_rekam` (Date), `diagnosa_utama` (String).

*   **VitalSigns**
    *   **Function:** Records vital signs data for patients, often linked to consultations or medical records.
    *   **Key Fields:** `_id` (ObjectId), `pasien_id` (ObjectId, Foreign Key to `Pasien`), `konsultasi_id` (ObjectId, Foreign Key to `Konsultasi`), `tanggal_periksa` (Date), `tekanan_darah_sistolik` (Number), `suhu_tubuh` (Number).

*   **Spesialisasi**
    *   **Function:** Defines medical specializations for doctors.
    *   **Key Fields:** `_id` (ObjectId), `nama_spesialisasi` (String, unique), `deskripsi` (String).

*   **Provinsi & Kota**
    *   **Function:** Hierarchical collections for geographical locations.
    *   **Key Fields:** `_id` (ObjectId), `nama_provinsi` (String, unique) / `nama_kota` (String), `kode_provinsi` (String, unique) / `kode_kota` (String, unique), `provinsi_id` (Foreign Key to `Provinsi` in `Kota`).

### Relationship Overview

Relationships between collections are established using `ObjectId` references. Here's a summary of the key relationships:

*   **User (1) -- (1) Admin, Doctor, Apoteker, Pasien:**
    *   Each `User` record is linked to exactly one specific role profile (Admin, Doctor, Apoteker, or Pasien).
    *   `Admin.user_id`, `Doctor.user_id`, `Apoteker.user_id`, `Pasien.user_id` all reference `User._id`.

*   **User (1) -- (Many) AppAnalytics, AuditTrail, Feedback, Notifikasi, Log, UserPromo, ReviewRating:**
    *   A single `User` can generate multiple analytics events, audit trails, feedback entries, notifications, log entries, promo usages, and reviews.
    *   `AppAnalytics.user_id`, `AuditTrail.user_id`, `Feedback.user_id`, `Notifikasi.user_id`, `Log.user_id`, `UserPromo.user_id`, `ReviewRating.reviewer_id` all reference `User._id`.

*   **Doctor (1) -- (Many) Appointment, JadwalDoctor, Konsultasi, MedicalRecord, Resep:**
    *   A `Doctor` can have many appointments, schedules, consultation sessions, medical records, and issue multiple prescriptions.
    *   `Appointment.doctor_id`, `JadwalDoctor.doctor_id`, `Konsultasi.doctor_id`, `MedicalRecord.doctor_id`, `Resep.doctor_id` all reference `Doctor._id`.

*   **Pasien (1) -- (Many) Appointment, Konsultasi, MedicalRecord, Pembayaran, Resep, VitalSigns:**
    *   A `Pasien` can have many appointments, consultation sessions, medical records, payments, prescriptions, and vital signs entries.
    *   `Appointment.pasien_id`, `Konsultasi.pasien_id`, `MedicalRecord.pasien_id`, `Pembayaran.pasien_id`, `Resep.pasien_id`, `VitalSigns.pasien_id` all reference `Pasien._id`.

*   **Konsultasi (1) -- (1) ChatSession:**
    *   Each `Konsultasi` (consultation) has one associated `ChatSession`.
    *   `ChatSession.konsultasi_id` references `Konsultasi._id`.

*   **Konsultasi (1) -- (Many) ChatMessage, Pembayaran, Resep, MedicalRecord, VitalSigns, ReviewRating:**
    *   A `Konsultasi` can involve multiple chat messages, payments, prescriptions, medical records, vital signs, and reviews.
    *   `ChatMessage.konsultasi_id`, `Pembayaran.konsultasi_id`, `Resep.konsultasi_id`, `MedicalRecord.konsultasi_id`, `VitalSigns.konsultasi_id`, `ReviewRating.konsultasi_id` all reference `Konsultasi._id`.

*   **Resep (1) -- (Many) DetailResep, Pengiriman, Pembayaran:**
    *   A `Resep` (prescription) can contain multiple `DetailResep` (individual drug items), be associated with one `Pengiriman` (delivery), and one `Pembayaran`.
    *   `DetailResep.resep_id`, `Pengiriman.resep_id`, `Pembayaran.resep_id` all reference `Resep._id`.

*   **Obat (1) -- (Many) DetailResep, StokObat:**
    *   A single `Obat` (drug) can be part of many prescription details and have multiple stock entries across pharmacies.
    *   `DetailResep.obat_id`, `DetailResep.obat_pengganti_id`, `StokObat.obat_id` all reference `Obat._id`.

*   **Apotek (1) -- (Many) Apoteker, StokObat, Resep:**
    *   An `Apotek` (pharmacy) can employ multiple `Apoteker` (pharmacists), manage various `StokObat` (drug stock) entries, and process many `Resep` (prescriptions).
    *   `Apoteker.apotek_id`, `StokObat.apotek_id`, `Resep.apotek_id` all reference `Apotek._id`.

*   **Provinsi (1) -- (Many) Kota, Apotek, Klinik, Pasien, RumahSakit:**
    *   A `Provinsi` (province) can contain multiple `Kota` (cities), `Apotek` (pharmacies), `Klinik` (clinics), `Pasien` (patients), and `RumahSakit` (hospitals).
    *   `Kota.provinsi_id`, `Apotek.provinsi_id`, `Klinik.provinsi_id`, `Pasien.provinsi_id`, `RumahSakit.provinsi_id` all reference `Provinsi._id`.

*   **Kota (1) -- (Many) Apotek, Klinik, Pasien, RumahSakit:**
    *   A `Kota` (city) can contain multiple `Apotek` (pharmacies), `Klinik` (clinics), `Pasien` (patients), and `RumahSakit` (hospitals).
    *   `Apotek.kota_id`, `Klinik.kota_id`, `Pasien.kota_id`, `RumahSakit.kota_id` all reference `Kota._id`. 

*   **Spesialisasi (1) -- (Many) Doctor:**
    *   Satu `Spesialisasi` dapat terkait dengan banyak `Doctor`.
    *   `Doctor.spesialisasi_id` -> `Spesialisasi._id` (One-to-Many)

*   **RumahSakit (1) -- (Many) Doctor:**
    *   Satu `RumahSakit` dapat terkait dengan banyak `Doctor`.
    *   `Doctor.rumah_sakit_id` -> `RumahSakit._id` (One-to-Many)

*   **Klinik (1) -- (Many) Doctor:**
    *   Satu `Klinik` dapat terkait dengan banyak `Doctor`.
    *   `Doctor.klinik_id` -> `Klinik._id` (One-to-Many)

*   **KategoriArtikel (1) -- (Many) ArtikelKesehatan:**
    *   Satu `KategoriArtikel` dapat memiliki banyak `ArtikelKesehatan`.
    *   `ArtikelKesehatan.kategori_artikel_id` -> `KategoriArtikel._id` (One-to-Many)

*   **KategoriObat (1) -- (Many) Obat:**
    *   Satu `KategoriObat` dapat memiliki banyak `Obat`.
    *   `Obat.kategori_obat_id` -> `KategoriObat._id` (One-to-Many)

*   **Kurir (1) -- (Many) Pengiriman:**
    *   Satu `Kurir` dapat melakukan banyak `Pengiriman`.
    *   `Pengiriman.kurir_id` -> `Kurir._id` (One-to-Many)

*   **Promo (1) -- (Many) UserPromo:**
    *   Satu `Promo` dapat digunakan oleh banyak `UserPromo`.
    *   `UserPromo.promo_id` -> `Promo._id` (One-to-Many)

*   **Pembayaran (1) -- (1) UserPromo:**
    *   Satu `Pembayaran` dapat terkait dengan satu `UserPromo`.
    *   `UserPromo.pembayaran_id` -> `Pembayaran._id` (One-to-One)

*   **MedicalRecord (1) -- (Many) VitalSigns:**
    *   Satu `MedicalRecord` dapat memiliki banyak `VitalSigns`.
    *   `VitalSigns.medical_record_id` -> `MedicalRecord._id` (One-to-Many)

### Common Data Flow Example: Patient Consultation & Prescription

To illustrate how these collections interact, consider a common user flow:

1.  **User Registration/Login:** A new user registers or an existing user logs in. A `User` record is created/authenticated, and a corresponding `Pasien` profile is created (or linked).
2.  **Doctor Search & Appointment:** The `Pasien` searches for a `Doctor` (potentially filtering by `Spesialisasi`, `RumahSakit`, or `Klinik`). They then book an `Appointment` with a `Doctor`, which might also create a `JadwalDoctor` entry.
3.  **Consultation:** At the scheduled time, a `Konsultasi` session begins between the `Pasien` and `Doctor`. `ChatMessage` records are created for the chat communication. `VitalSigns` data might be recorded.
4.  **Medical Record & Prescription:** The `Doctor` creates a `MedicalRecord` for the `Pasien` based on the `Konsultasi`. If medication is needed, the `Doctor` issues a `Resep`.
5.  **Pharmacy & Drug Fulfillment:** The `Resep` is sent to an `Apotek`. The `Apotek` checks `StokObat` for availability. `DetailResep` records specify each drug.
6.  **Payment:** A `Pembayaran` record is created for the `Konsultasi` and/or `Resep`. If a `Promo` is applied, a `UserPromo` record is created.
7.  **Delivery:** If drugs are delivered, a `Pengiriman` record is created, assigned to a `Kurir`, and tracked.
8.  **Review & Analytics:** After the process, the `Pasien` might leave a `ReviewRating` for the `Doctor` or `Apotek`. All user actions are logged in `AppAnalytics` and `AuditTrail`.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! This project is maintained by [rizky28eka](https://github.com/Rizky28eka).

