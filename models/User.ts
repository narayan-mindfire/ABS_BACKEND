import mongoose, { Schema } from 'mongoose';
import { User, UserType } from '../types/models';
import * as bcrypt from "bcryptjs"
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

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


export default mongoose.model<User>('User', userSchema);
