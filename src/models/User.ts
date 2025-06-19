import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'guest' | 'manager' | 'admin';
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['guest', 'manager', 'admin'], default: 'guest' },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password comparison method
UserSchema.methods.comparePassword = function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password!);
};

export default mongoose.model<IUser>('User', UserSchema);

// // src/models/User.ts
// import mongoose, { Document, Schema } from 'mongoose';

// export interface IUser extends Document {
//   user: mongoose.Types.ObjectId;
//   name: string;
//   email: string;
//   password?: string; // Password will be selected: false
//   role: 'guest' | 'manager' | 'admin';
// }

// const UserSchema: Schema = new Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true, select: false }, // `select: false` means it won't be returned in queries by default
//   role: { type: String, enum: ['guest', 'manager', 'admin'], default: 'guest' },
//   user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
// }, { timestamps: true });

// export default mongoose.model<IUser>('User', UserSchema);