import jwt from "jsonwebtoken";

interface Payload {
  id: string;
  email: string;
  user_type: string;
}

export const generateToken = ({ id, email, user_type }: Payload) => {
  return jwt.sign({ id, email, user_type }, process.env.JWT_SECRET!, {
    expiresIn: '1h',
  });
};