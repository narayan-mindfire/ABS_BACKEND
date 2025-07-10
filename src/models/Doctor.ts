import mongoose, { Schema } from 'mongoose';
import { Doctor, Specialization } from '../types/models';

const doctorSchema = new Schema<Doctor>({
  doctor_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  specialization: {
    type: String,
    enum: Object.values(Specialization),
    required: true
  },
  bio: String
});

export default mongoose.model<Doctor>('Doctor', doctorSchema);
