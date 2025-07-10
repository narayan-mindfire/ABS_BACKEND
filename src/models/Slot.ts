import mongoose, { Schema } from 'mongoose';
import { Slot, SlotTime } from '../types/models';

const bookedSlotSchema = new Schema<Slot>({
  doctor_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  slot_date: { type: Date, required: true },
  slot_time: {
    type: String,
    enum: Object.values(SlotTime),
    required: true
  },
  expire_at: { type: Date, required: true }
});

bookedSlotSchema.index({ expire_at: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<Slot>('Slot', bookedSlotSchema);
