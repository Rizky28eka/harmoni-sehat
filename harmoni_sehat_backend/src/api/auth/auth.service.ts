import jwt, { SignOptions } from 'jsonwebtoken';
import User, { IUser } from '../../models/User';
import AppError from '../../utils/AppError';
import env from '../../config/env';

const signToken = (id: string) => {
  const jwtOptions: SignOptions = {
    // Using `as any` here is a pragmatic workaround for a known issue with
    // @types/jsonwebtoken where a generic string is not assignable to the
    // more specific StringValue type for `expiresIn`.
    expiresIn: env.jwtExpiresIn as any,
  };
  return jwt.sign({ id }, env.jwtSecret, jwtOptions);
};

export const createUserInput = async (input: Partial<IUser>) => {
  const userExists = await User.findOne({ email: input.email });
  if (userExists) {
    throw new AppError('Email already exists', 409);
  }

  const user = await User.create(input);

  // Remove password from output
  const userObject = user.toObject();
  delete userObject.password;

  const token = signToken(user._id.toString());
  return { user: userObject, token };
};

export const loginUserInput = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Incorrect email or password', 401);
  }

  // Remove password from output
  const userObject = user.toObject();
  delete userObject.password;

  const token = signToken(user._id.toString());
  return { user: userObject, token };
};
