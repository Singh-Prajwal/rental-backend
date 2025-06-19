import mongoose, { Document, Schema } from 'mongoose';

export interface ITechnicianVisit extends Document {
  supportRequestId: mongoose.Types.ObjectId;
  technicianName: string;
  scheduledAt: Date;
  notes: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

const TechnicianVisitSchema: Schema = new Schema({
  supportRequestId: { type: Schema.Types.ObjectId, ref: 'SupportRequest', required: true },
  technicianName: { type: String, required: true },
  scheduledAt: { type: Date, required: true },
  notes: { type: String },
  status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' },
}, { timestamps: true });

export default mongoose.model<ITechnicianVisit>('TechnicianVisit', TechnicianVisitSchema);