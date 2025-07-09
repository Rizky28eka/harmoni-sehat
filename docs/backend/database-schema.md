# Backend Database Schema

This document outlines the main Mongoose models used in the Harmoni Sehat backend and their key fields.

## User

Represents a user account in the system. Linked to specific roles (Patient, Doctor, Admin, Pharmacist).

-   `email`: String, unique, required
-   `password`: String, required (hashed)
-   `is_active`: Boolean, default true
-   `roles`: Array of Strings (populated from UserRole), virtual
-   `createdAt`: Date
-   `updatedAt`: Date

## Role

Defines the different roles a user can have.

-   `nama_peran`: String, unique, required (e.g., 'patient', 'doctor', 'admin', 'pharmacist')

## UserRole

Links a User to a Role.

-   `user_id`: ObjectId (refers to User)
-   `role_id`: ObjectId (refers to Role)
-   `createdAt`: Date
-   `updatedAt`: Date

## Patient

Stores specific details for users with the 'patient' role.

-   `user_id`: ObjectId (refers to User), unique, required
-   `nama`: String, required
-   `nik`: String, unique, required
-   `tanggal_lahir`: Date, required
-   `jenis_kelamin`: Enum ('Laki-laki', 'Perempuan'), required
-   `alamat`: String, required
-   `no_telepon`: String, required
-   `createdAt`: Date
-   `updatedAt`: Date

## Doctor

Stores specific details for users with the 'doctor' role.

-   `user_id`: ObjectId (refers to User), unique, required
-   `nama`: String, required
-   `nomor_str`: String, unique, required
-   `specialization_id`: ObjectId (refers to Specialization), required
-   `biaya_konsultasi`: Number, required
-   `foto`: String (URL)
-   `bio`: String
-   `status`: Enum ('active', 'inactive', 'pending'), default 'pending'
-   `createdAt`: Date
-   `updatedAt`: Date

## Specialization

Defines medical specializations.

-   `nama`: String, unique, required
-   `deskripsi`: String
-   `is_active`: Boolean, default true
-   `createdAt`: Date
-   `updatedAt`: Date

## Clinic

Represents a medical clinic or facility.

-   `nama`: String, required
-   `alamat`: String, required
-   `no_telepon`: String, required
-   `email`: String, unique, required
-   `status`: Enum ('active', 'inactive'), default 'active'
-   `createdAt`: Date
-   `updatedAt`: Date

## MedicalRecord

Stores a patient's medical history.

-   `patient_id`: ObjectId (refers to Patient), unique, required
-   `riwayat_penyakit`: Array of Strings
-   `alergi`: Array of Strings
-   `riwayat_vaksinasi`: Array of Strings
-   `createdAt`: Date
-   `updatedAt`: Date

## Drug

Represents a pharmaceutical drug.

-   `nama`: String, unique, required
-   `deskripsi`: String
-   `kategori`: String, required
-   `harga`: Number, required
-   `stok`: Number, required
-   `satuan`: String, required
-   `butuh_resep`: Boolean, default false
-   `tgl_kadaluarsa`: Date, required
-   `createdAt`: Date
-   `updatedAt`: Date

## DrugCart

Represents an item in a patient's drug cart.

-   `patient_id`: ObjectId (refers to Patient), required
-   `drug_id`: ObjectId (refers to Drug), required
-   `jumlah`: Number, required
-   `createdAt`: Date
-   `updatedAt`: Date

## DrugOrder

Represents a patient's drug order.

-   `patient_id`: ObjectId (refers to Patient), required
-   `kode_pesanan`: String, unique, required
-   `total_harga`: Number, required
-   `status`: Enum ('pending', 'processing', 'shipped', 'delivered', 'cancelled'), default 'pending'
-   `alamat_pengiriman`: String, required
-   `createdAt`: Date
-   `updatedAt`: Date

## DrugOrderDetail

Represents a detail item within a drug order.

-   `order_id`: ObjectId (refers to DrugOrder), required
-   `drug_id`: ObjectId (refers to Drug), required
-   `harga_satuan`: Number, required
-   `jumlah`: Number, required
-   `subtotal`: Number, required
-   `createdAt`: Date
-   `updatedAt`: Date

## Consultation

Represents a patient-doctor consultation.

-   `patient_id`: ObjectId (refers to Patient), required
-   `doctor_id`: ObjectId (refers to Doctor), required
-   `schedule_id`: ObjectId (refers to PracticeSchedule), required
-   `tanggal`: Date, required
-   `status`: Enum ('scheduled', 'completed', 'cancelled', 'pending'), default 'pending'
-   `keluhan`: String, required
-   `diagnosa`: String
-   `tindakan`: String
-   `catatan_dokter`: String
-   `video_call_url`: String
-   `createdAt`: Date
-   `updatedAt`: Date

## ChatMessage

Represents a chat message within a consultation.

-   `consultation_id`: ObjectId (refers to Consultation), required
-   `sender_id`: ObjectId (refers to User), required
-   `isi`: String, required
-   `tipe`: Enum ('text', 'image', 'document'), required
-   `file_url`: String
-   `is_read`: Boolean, default false
-   `createdAt`: Date
-   `updatedAt`: Date

## DoctorReview

Represents a review given by a patient to a doctor after a consultation.

-   `patient_id`: ObjectId (refers to Patient), required
-   `doctor_id`: ObjectId (refers to Doctor), required
-   `consultation_id`: ObjectId (refers to Consultation), unique, required
-   `rating`: Number (1-5), required
-   `komentar`: String
-   `createdAt`: Date
-   `updatedAt`: Date

## PracticeSchedule

Represents a doctor's practice schedule at a specific clinic.

-   `doctor_id`: ObjectId (refers to Doctor), required
-   `clinic_id`: ObjectId (refers to Clinic), required
-   `hari`: Enum ('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'), required
-   `jam_mulai`: String (HH:MM), required
-   `jam_selesai`: String (HH:MM), required
-   `is_active`: Boolean, default true
-   `createdAt`: Date
-   `updatedAt`: Date

## DoctorClinic

Represents an association between a doctor and a clinic.

-   `doctor_id`: ObjectId (refers to Doctor), required
-   `clinic_id`: ObjectId (refers to Clinic), required
-   `status`: Enum ('active', 'inactive'), default 'active'
-   `createdAt`: Date
-   `updatedAt`: Date

## Prescription

Represents a medical prescription issued after a consultation.

-   `consultation_id`: ObjectId (refers to Consultation), unique, required
-   `catatan`: String
-   `status`: Enum ('active', 'inactive', 'expired'), default 'active'
-   `expired_at`: Date, required
-   `createdAt`: Date
-   `updatedAt`: Date

## PrescriptionDrug

Represents a specific drug item within a prescription.

-   `prescription_id`: ObjectId (refers to Prescription), required
-   `drug_id`: ObjectId (refers to Drug), required
-   `dosis`: String, required
-   `jumlah`: Number, required
-   `aturan_pakai`: String, required
-   `createdAt`: Date
-   `updatedAt`: Date

## HealthArticle

Represents a health-related article published in the system.

-   `judul`: String, unique, required
-   `slug`: String, unique, required
-   `konten`: String, required
-   `author_id`: ObjectId (refers to Admin or Doctor), required
-   `author_type`: Enum ('Admin', 'Doctor'), required
-   `status_publikasi`: Enum ('draft', 'published', 'archived'), default 'draft'
-   `createdAt`: Date
-   `updatedAt`: Date

## Media

Represents media files associated with various models.

-   `model_type`: String (e.g., 'User', 'HealthArticle'), required
-   `model_id`: ObjectId, required
-   `url`: String, required
-   `mime_type`: String
-   `size`: Number
-   `createdAt`: Date
-   `updatedAt`: Date

## Notification

Represents a notification sent to a user.

-   `user_id`: ObjectId (refers to User), required
-   `judul`: String, required
-   `isi`: String, required
-   `tipe`: Enum ('info', 'warning', 'error', 'success'), required
-   `is_read`: Boolean, default false
-   `createdAt`: Date
-   `updatedAt`: Date

## PaymentMethod

Defines available payment methods.

-   `nama`: String, required
-   `kode`: String, unique, required
-   `deskripsi`: String
-   `is_active`: Boolean, default true
-   `createdAt`: Date
-   `updatedAt`: Date

## Transaction

Records financial transactions in the system.

-   `user_id`: ObjectId (refers to User), required
-   `total_biaya`: Number, required
-   `status`: Enum ('pending', 'completed', 'failed', 'refunded'), default 'pending'
-   `payment_method_id`: ObjectId (refers to PaymentMethod), required
-   `external_id`: String, unique
-   `transaksiable_id`: ObjectId (polymorphic reference), required
-   `transaksiable_type`: Enum ('Consultation', 'DrugOrder'), required
-   `createdAt`: Date
-   `updatedAt`: Date

## UserProfile

Stores additional profile details for a user.

-   `user_id`: ObjectId (refers to User), unique, required
-   `foto`: String (URL)
-   `bio`: String
-   `updatedAt`: Date

## UserRole

Associates a user with a specific role.

-   `user_id`: ObjectId (refers to User), required
-   `role_id`: ObjectId (refers to Role), required
-   `createdAt`: Date
-   `updatedAt`: Date

