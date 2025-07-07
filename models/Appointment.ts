import mongoose, { Document, Schema } from 'mongoose';
import { Appointment, AppointmentStatus } from '../types/models';

const appointmentSchema = new Schema<Appointment>({
  patient_id: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor_id: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  slot_id: { type: Schema.Types.ObjectId, ref: 'Slot', required: true },
  status: {
    type: String,
    enum: Object.values(AppointmentStatus),
    default: AppointmentStatus.Booked
  },
  purpose: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.model<Appointment>('Appointment', appointmentSchema);
