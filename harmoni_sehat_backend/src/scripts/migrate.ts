import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db';
import logger from '../utils/logger';

// Load Models
import User from '../models/User';
import Peran from '../models/Peran';
import PeranPengguna from '../models/PeranPengguna';
import Admin from '../models/Admin';

import bcrypt from 'bcryptjs';
import { generateCustomUserId } from '../services/userService'; // Import generateCustomUserId

const migrateDB = async () => {
    try {
        await connectDB();

        logger.info('Dropping existing collections...');
        const collections = await mongoose.connection.db.listCollections().toArray();
        for (const collection of collections) {
            await mongoose.connection.db.dropCollection(collection.name);
            logger.info(`Collection ${collection.name} dropped.`);
        }

        logger.info('Creating default roles...');
        const roles = await Peran.insertMany([
            { nama_peran: 'Admin' },
            { nama_peran: 'Dokter' },
            { nama_peran: 'Pasien' },
            { nama_peran: 'Apoteker' },
        ]);
        logger.info('Default roles created.', roles);

        logger.info('Creating initial admin user...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const adminUser = await User.create({
            email: 'admin@harmoni.sehat',
            password: hashedPassword,
            is_active: true,
            role: 'Admin', // Add role
            nama_lengkap: 'Super Admin', // Add nama_lengkap
            customUserId: generateCustomUserId('Admin'), // Generate customUserId
        });
        logger.info('Admin user created.', adminUser);

        const adminRole = roles.find(role => role.nama_peran === 'Admin');
        if (adminRole) {
            await PeranPengguna.create({
                user_id: adminUser._id,
                peran_id: adminRole._id,
            });
            logger.info('Admin user assigned to Admin role.');
        } else {
            logger.warn('Admin role not found, skipping assignment.');
        }

        await Admin.create({
            user_id: adminUser._id,
            // nama: 'Super Admin', // This field is in User model, not Admin model
        });
        logger.info('Admin profile created.');

        logger.info('Migration complete!');
        process.exit(0);
    } catch (err: any) {
        logger.error(err.message);
        process.exit(1);
    }
};

void migrateDB();