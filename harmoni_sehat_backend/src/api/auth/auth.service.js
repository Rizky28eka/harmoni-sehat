const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const knex = require('knex')(require('../../../knexfile').development);

const generateToken = (user) => {
  const payload = {
    id: user.id,
    role: user.role,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};

const findOrCreateUser = async (profile) => {
  const { email, name, provider, phoneNumber } = profile;

  let user = await knex('users').where({ email }).orWhere({ no_hp: phoneNumber }).first();

  if (user) {
    return user;
  }

  const [newUser] = await knex.transaction(async (trx) => {
    const [userId] = await trx('users').insert({
      email,
      no_hp: phoneNumber,
      role: 'pasien',
    });

    const user = await trx('users').where({ id: userId }).first();

    await trx('pasiens').insert({
      user_id: user.id,
      nama_lengkap: name,
    });

    return [user];
  });

  return newUser;
};

const registerUser = async (userData) => {
  const { nama_lengkap, email, password, no_hp } = userData;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const [newUser] = await knex.transaction(async (trx) => {
    const [userId] = await trx('users')
      .insert({
        email,
        password: hashedPassword,
        no_hp,
        role: 'pasien',
      });

    const user = await trx('users').where({ id: userId }).first();

    await trx('pasiens').insert({
      user_id: user.id,
      nama_lengkap,
    });

    return [user];
  });

  delete newUser.password;
  return newUser;
};

const loginUser = async (credentials) => {
  const { email, password } = credentials;

  const user = await knex('users').where({ email }).first();
  if (!user) {
    throw new Error('Kredensial tidak valid');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Kredensial tidak valid');
  }

  const token = generateToken(user);
  return { token };
};

module.exports = {
  registerUser,
  loginUser,
  findOrCreateUser,
  generateToken,
};
