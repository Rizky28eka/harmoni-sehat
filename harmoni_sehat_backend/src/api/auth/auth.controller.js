const User = require('../../models/User');
const Pasien = require('../../models/Pasien');
const Doctor = require('../../models/Doctor');
const Apoteker = require('../../models/Apoteker');
const Spesialisasi = require('../../models/Spesialisasi');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler'); // Assuming you have this or will add it

// Helper function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, role, nama_lengkap, no_hp, nomor_sip, spesialisasi, nomor_stra, alamat_tempat_kerja } = req.body;

  // Normalize role from frontend (e.g., 'dokter' to 'doctor')
  let normalizedRole = role ? role.toLowerCase() : 'pasien';
  if (normalizedRole === 'dokter') normalizedRole = 'doctor';

  // Basic validation
  if (!email || !password || !nama_lengkap || !no_hp) {
    res.status(400);
    throw new Error('Please enter all required fields: email, password, nama_lengkap, phone number.');
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User with that email already exists');
  }

  let user;
  let profile;
  try {
    // Create User
    user = await User.create({
      email,
      password,
      phone: no_hp, // Map frontend's no_hp to backend's phone
      role: normalizedRole,
    });

    if (!user) {
      res.status(400);
      throw new Error('Invalid user data provided');
    }

    let profileData = {
      user_id: user._id,
      nama_lengkap: nama_lengkap,
    };

    // Create associated profile based on role
    if (normalizedRole === 'pasien') {
      // Pasien-specific fields (provinsi_id, kota_id are now optional in model)
      profile = await Pasien.create(profileData);
    } else if (normalizedRole === 'doctor') {
      if (!nomor_sip || !spesialisasi) {
        res.status(400);
        throw new Error('Doctor registration requires SIP number and specialization.');
      }
      // Find specialization ID from name
      const foundSpesialisasi = await Spesialisasi.findOne({ nama_spesialisasi: spesialisasi });
      if (!foundSpesialisasi) {
        res.status(400);
        throw new Error(`Specialization '${spesialisasi}' not found. Please provide a valid specialization.`);
      }

      profileData.no_sip = nomor_sip;
      profileData.spesialisasi_id = foundSpesialisasi._id;
      // Other doctor fields are optional or have defaults
      profile = await Doctor.create(profileData);
    } else if (normalizedRole === 'apoteker') {
      if (!nomor_stra || !alamat_tempat_kerja) {
        res.status(400);
        throw new Error('Pharmacist registration requires STRA number and workplace address.');
      }
      profileData.no_sipa = nomor_stra; // Map frontend's nomor_stra to backend's no_sipa
      profileData.alamat = alamat_tempat_kerja; // Map frontend's alamat_tempat_kerja to backend's alamat
      // Other apoteker fields are optional or have defaults
      profile = await Apoteker.create(profileData);
    } else if (normalizedRole === 'admin') {
      // Admin profile creation might be handled differently or later
      // For now, just create the user, admin profile can be added manually or via separate process
      profile = { _id: user._id, message: 'Admin user created. Admin profile needs manual setup.' };
    }

    if (!profile) {
      res.status(400);
      throw new Error('Failed to create user profile.');
    }

    res.status(201).json({
      status: 'success',
      data: {
        user: {
          _id: user._id,
          email: user.email,
          role: user.role,
          phone: user.phone,
        },
        profile_id: profile._id, // Return the ID of the created profile
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    // If profile creation fails, clean up the created user to prevent orphaned data
    if (user && user._id) {
      await User.findByIdAndDelete(user._id);
    }
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    let profileId = null;
    // Find associated profile based on role
    if (user.role === 'pasien') {
      const pasienProfile = await Pasien.findOne({ user_id: user._id });
      if (pasienProfile) profileId = pasienProfile._id;
    } else if (user.role === 'doctor') {
      const doctorProfile = await Doctor.findOne({ user_id: user._id });
      if (doctorProfile) profileId = doctorProfile._id;
    } else if (user.role === 'apoteker') {
      const apotekerProfile = await Apoteker.findOne({ user_id: user._id });
      if (apotekerProfile) profileId = apotekerProfile._id;
    }

    res.json({
      status: 'success',
      data: {
        user: {
          _id: user._id,
          email: user.email,
          role: user.role,
          phone: user.phone,
        },
        profile_id: profileId, // Return the ID of the associated profile
        token: generateToken(user._id),
      },
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

module.exports = {
  registerUser,
  loginUser,
};