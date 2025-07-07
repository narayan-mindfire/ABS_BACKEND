import mongoose, { Document, Schema } from 'mongoose';
import { User, UserType } from '../types/models';

const userSchema = new Schema<User>({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone_number: {
    type: String,
    validate: {
      validator: (v: string) => /^[0-9]{10}$/.test(v),
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  user_type: {
    type: String,
    enum: Object.values(UserType),
    required: true
  },
  password: { type: String, required: true },
}, {
    timestamps : true,
}
);

export default mongoose.model<User>('User', userSchema);
