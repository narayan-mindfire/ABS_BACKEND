import { AuthRepository } from "../repositories/auth.repository";
import { UserType } from "../types/models";
import {
  generateRefreshToken,
  generateToken,
  Payload,
} from "../utils/generateToken";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const AuthService = {
  async register(userPayload: any) {
    const {
      first_name,
      last_name,
      email,
      phone_number,
      user_type,
      password,
      specialization,
      bio,
      gender,
      date_of_birth,
    } = userPayload;

    if (!first_name || !last_name || !email || !user_type || !password) {
      throw new Error("Missing required user fields");
    }

    const existingUser = await AuthRepository.findUserByEmail(email);
    if (existingUser) throw new Error("User with this email already exists");

    const user = await AuthRepository.createUser({
      first_name,
      last_name,
      email,
      phone_number,
      user_type,
      password,
    });

    if (user_type === UserType.Doctor) {
      if (!specialization)
        throw new Error("Specialization is required for doctors");

      await AuthRepository.createDoctor({
        doctor_id: user._id,
        specialization,
        bio,
      });
    }

    if (user_type === UserType.Patient) {
      if (!date_of_birth)
        throw new Error("Date of birth is required for patients");
      if (!gender) throw new Error("Gender is required for patients");

      await AuthRepository.createPatient({
        patient_id: user._id,
        gender,
        date_of_birth,
      });
    }

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      user_type: user.user_type,
    });

    const refreshToken = generateRefreshToken({
      id: user._id.toString(),
      email: user.email,
      user_type: user.user_type,
    });

    return {
      user,
      token,
      refreshToken,
    };
  },

  async login(email: string, password: string) {
    const user = await AuthRepository.findUserByEmail(email);
    if (!user) throw new Error("Invalid email");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid password");

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      user_type: user.user_type,
    });

    const refreshToken = generateRefreshToken({
      id: user._id.toString(),
      email: user.email,
      user_type: user.user_type,
    });

    return {
      user,
      token,
      refreshToken,
    };
  },

  refreshAccessToken(token: string) {
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET!
    ) as Payload;
    const accessToken = generateToken({
      id: decoded.id,
      email: decoded.email,
      user_type: decoded.user_type,
    });
    return accessToken;
  },
};
