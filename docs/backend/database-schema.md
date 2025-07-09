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

*(Add other models as their CRUD is implemented)*