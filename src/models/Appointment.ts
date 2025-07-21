import mongoose, { Schema } from 'mongoose';
import { Appointment, AppointmentStatus } from '../types/models';

const appointmentSchema = new Schema<Appointment>({
  patient_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  doctor_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  slot_id: { type: Schema.Types.ObjectId, ref: 'Slot', required: true },
  status: {
    type: String,
    enum: Object.values(AppointmentStatus),
    default: AppointmentStatus.Booked
  },
  purpose: String,
},{
  timestamps: true
}

);

export default mongoose.model<Appointment>('Appointment', appointmentSchema);
