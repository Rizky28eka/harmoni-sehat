import { Schema, model, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password?: string;
  is_active: boolean;
  role: Types.ObjectId; // Add role field
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 5, // Example: minimum length for email
      validate: {
        validator: function (v: string) {
          return /^\S+@\S+\.\S+$/.test(v); // Basic email regex validation
        },
        message: (props: { value: string }) => `${props.value} is not a valid email address!`,
      },
      index: true, // Add index for efficient lookups
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false, // Don't return password by default
      validate: {
        validator: function (v: string) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v); // At least one uppercase, one lowercase, one number, one special character, min 8 chars
        },
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character, and be at least 8 characters long.',
      },
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
      index: true, // Add index for efficient lookups
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true },
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password!, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password!);
};

const User = model<IUser>('User', UserSchema);

export default User;
