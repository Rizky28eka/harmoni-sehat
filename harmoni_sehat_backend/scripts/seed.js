require('dotenv').config();
const { faker } = require('@faker-js/faker/locale/id_ID');
const mongoose = require('mongoose');
const Pasien = require('../models/Pasien');
const User = require('../models/User');
const connectDB = require('../config/db');
const { generateCustomUserId, encrypt, createHash } = require('../services/userService'); // Import generateCustomUserId, encrypt, createHash

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

    console.log('Cleared existing data.');

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
        nik: faker.number.int({ min: 1000000000000000, max: 9999999999999999 }).toString(),
        tanggal_lahir: faker.date.between({ from: '1950-01-01', to: '2005-12-31' }),
        jenis_kelamin: faker.helpers.arrayElement(['Laki-laki', 'Perempuan']),
        alamat: `${faker.location.streetAddress()}, ${faker.helpers.arrayElement(javaCities)}`,
        // no_telepon: faker.phone.number('08##########') // no_telepon is now in User model
      });
      await pasien.save();
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();