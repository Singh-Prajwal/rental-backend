// src/models/Booking.ts
import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';

// Interface to define the properties of a Booking document
export interface IBooking extends Document {
  user: mongoose.Types.ObjectId | IUser; 
  propertyId: string;
  propertyName: string;
  checkInDate: Date;
  checkOutDate: Date;
  guests: number;
  totalPrice: number;
    status: 'Pending' | 'Confirmed' | 'Cancelled';
     accessCode?: string; 
}

const BookingSchema: Schema = new Schema({
   user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', 
  },
  propertyId: { type: String, required: true },
  propertyName: { type: String, required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required:true },
  guests: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'],
    default: 'Pending',
    },
  accessCode: { type: String, unique: true, sparse: true },
}, { timestamps: true });

export default mongoose.model<IBooking>('Booking', BookingSchema);