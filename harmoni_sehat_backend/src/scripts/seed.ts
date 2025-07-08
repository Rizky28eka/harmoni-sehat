import 'dotenv/config';
import { faker } from '@faker-js/faker/locale/id_ID';
import mongoose from 'mongoose';
import Pasien from '../models/Pasien';
import User from '../models/User';
import connectDB from '../config/db';
import { generateCustomUserId, encrypt, createHash } from '../services/userService';
import logger from '../utils/logger';

// Cities in Java Island
const javaCities = [
    'Jakarta', 'Bandung', 'Surabaya', 'Semarang', 'Yogyakarta', 
    'Bogor', 'Tangerang', 'Bekasi', 'Depok', 'Cirebon', 'Malang', 'Solo'
];

/**
 * Seed the database with dummy data.
 */
const seedDB = async () => {
    await connectDB();

    try {
    // Clear existing data
        await Pasien.deleteMany({});
        await User.deleteMany({});

        logger.info('Cleared existing data.');

        // Create users and pasiens
        for (let i = 0; i < 20; i++) {
            const user = new User({
                email: faker.internet.email(),
                password: 'password123', // In a real app, this should be hashed
                role: 'Pasien', // Corrected capitalization
                nama_lengkap: faker.person.fullName(), // Added nama_lengkap
                customUserId: generateCustomUserId('Pasien'), // Generate customUserId
                no_hp: encrypt(faker.phone.number('08##########')), // Encrypt phone number
                no_hp_hash: createHash(faker.phone.number('08##########')) // Create hash for phone number
            });
            await user.save();

            const pasien = new Pasien({
                user_id: user._id,
                // nama: faker.person.fullName(), // nama is now in User model
                nik: faker.string.numeric(16),
                tanggal_lahir: faker.date.between({ from: '1950-01-01', to: '2005-12-31' }),
                jenis_kelamin: faker.helpers.arrayElement(['Laki-laki', 'Perempuan']),
                alamat: `${faker.location.streetAddress()}, ${faker.helpers.arrayElement(javaCities)}`,
                // no_telepon: faker.phone.number('08##########') // no_telepon is now in User model
            });
            await pasien.save();
        }

        logger.info('Database seeded successfully!');
    } catch (error: any) {
        logger.error('Error seeding database:', error);
    } finally {
        void mongoose.connection.close();
    }
};

void seedDB();
