import mongoose, { Document, Schema } from 'mongoose';
import { Slot } from '../types/models';

const slotSchema = new Schema<Slot>({
  doctor_id: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  slot_date: { type: Date, required: true },
  slot_time: { type: String, required: true },
  duration: { type: Number, required: true },
  is_available: { type: Boolean, default: true }
});

export default mongoose.model<Slot>('Slot', slotSchema);
