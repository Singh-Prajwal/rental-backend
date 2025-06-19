// src/controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

const generateToken = (id: string) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) throw new Error('JWT_SECRET is not defined');
  return jwt.sign({ id }, jwtSecret, { expiresIn: '30d' });
};

export const registerUser:any = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
//   try {
      const userExists = await User.findOne({ email });
      console.log("userExists: ", userExists)
    // if (userExists && userExists!==null) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("hashedPassword: ", hashedPassword)
    const user:any = await User.create({ name, email, password: hashedPassword });
    console.log("user: ", user)
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
//   } catch (error) { res.status(500).json({ message: 'Server error', error }); }
};

export const loginUser:any = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log("email",password,email)
  try {
    const user: any = await User.findOne({ email }).select('+password');
    // Explicitly select password
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("await bcrypt.compare(password, user.password!)", isMatch)
    
    if (isMatch) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) { res.status(500).json({ message: 'Server error', error }); }
};