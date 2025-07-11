import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import UserModel from "../models/User";
import DoctorModel from "../models/Doctor";
import PatientModel from "../models/Patient";
import { UserType } from "../types/models";
import * as bcrypt from "bcryptjs"
import { generateRefreshToken, generateToken, Payload } from "../utils/generateToken";
import jwt from 'jsonwebtoken';

// @desc Create user (and doctor/patient profile if needed)
// @route POST /api/v1/auth/register
// @access Private
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
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
  } = req.body;

  if (!first_name || !last_name || !email || !user_type || !password) {
    res.status(400);
    throw new Error("Missing required user fields");
  }

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("User with this email already exists");
  }

  const user = await UserModel.create({
    first_name,
    last_name,
    email,
    phone_number,
    user_type,
    password,
  });

  if (user_type === UserType.Doctor) {
    if (!specialization) {
      res.status(400);
      throw new Error("Specialization is required for doctors");
    }

    await DoctorModel.create({
      doctor_id: user._id,
      specialization,
      bio,
    });
  }

  if (user_type === UserType.Patient) {
    if(!date_of_birth){
      res.status(400);
      throw new Error("Date of birth is required for patients");
    }
    if(!gender){
      res.status(400);
      throw new Error("Gender is required for patients");
    }
    await PatientModel.create({
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
  })

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  });

  res.status(201).json({
    message: "User created successfully",
    user_id: user._id,
    user_type,
    token,
  });
});

// @desc Login user and get JWT token
// @route POST /api/v1/auth/login
// @access Public
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  console.log("login user called")
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error('Invalid email');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid password');
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
  })
  console.log("sent token: ", token);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  });
  console.log("refresh token", refreshToken)


  res.status(200).json({
    token,
    user_id: user._id,
    user_type: user.user_type,
  });
});

// @desc generates new access token again a valid refresh token
// @route PUT /api/v1/auth/refresh-token
// @access Private
export const refreshToken = asyncHandler(async (req: any, res: any) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.status(401).json({ message: "No refresh token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as Payload;
    const accessToken = generateToken({
      id: decoded.id,
      email: decoded.email,
      user_type: decoded.user_type,
    });

    res.status(200).json({ accessToken });
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
});