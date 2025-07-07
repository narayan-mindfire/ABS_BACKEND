import mongoose, { Schema } from 'mongoose';
import { Patient } from '../types/models';

const patientSchema = new Schema<Patient>({
  patient_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  gender: String,
  date_of_birth: Date
});

export default mongoose.model<Patient>('Patient', patientSchema);
