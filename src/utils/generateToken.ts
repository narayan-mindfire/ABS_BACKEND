import jwt from "jsonwebtoken";

export interface Payload {
  id: string;
  email: string;
  user_type: string;
}

/**
 * Generates a JSON Web Token (JWT) for the given user payload.
 * @param payload - An object containing the user's `id`, `email`, and `user_type`.
 * @returns A signed JWT as a string, valid for 1 hour.
 */
export const generateToken = ({ id, email, user_type }: Payload) => {
  return jwt.sign({ id, email, user_type }, process.env.JWT_SECRET!, {
    expiresIn: '10h',
  });
};

/**
 * Generates a JSON Web Token (JWT) for the given user payload.
 * @param payload - An object containing the user's `id`, `email`, and `user_type`.
 * @returns A signed JWT as a string, valid for 1 hour.
 */
export const generateRefreshToken = ({ id, email, user_type }: Payload) => {
  return jwt.sign({id, email, user_type}, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });
};