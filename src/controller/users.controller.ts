import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import UserModel from "../models/User";
import DoctorModel from "../models/Doctor";
import PatientModel from "../models/Patient";
import { User, UserType } from "../types/models";
import * as bcrypt from "bcryptjs"
import { generateToken, Payload } from "../utils/generateToken";
import jwt from 'jsonwebtoken';

// @desc Create user (and doctor/patient profile if needed)
// @route POST /api/v1/users
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
  
  const refreshToken = generateToken({
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

// @desc  Gets list of users based on user type
// @route GET /api/v1/users/<user_type>
// @access Private
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const user_type = req.query.user_type as string;

  if(!user_type){
    const all_users = await UserModel.find()
    res.status(200).json(all_users);
  }

  if ( user_type !== UserType.Doctor && user_type !== UserType.Patient) {
    res.status(400);
    throw new Error("user_type must be either doctor or patient");
  }

  const users = await UserModel.find({ user_type });

  if (user_type === UserType.Doctor) {
    const doctorDetails = await DoctorModel.find({
      doctor_id: { $in: users.map((u) => u._id) },
    });

    const userDetails = users.map((user) => {
      const doc = doctorDetails.find(
        (d) => d.doctor_id.toString() === user._id.toString()
      );
      return {
        ...user.toObject(),
        specialization: doc?.specialization,
        bio: doc?.bio,
      };
    });

    res.status(200).json(userDetails);
    return;
  }

  if (user_type === UserType.Patient) {
    const patientDetails = await PatientModel.find({
      patient_id: { $in: users.map((u) => u._id) },
    });

    const userDetails = users.map((user) => {
      const pat = patientDetails.find(
        (p) => p.patient_id.toString() === user._id.toString()
      );
      return {
        ...user.toObject(),
        gender: pat?.gender,
        date_of_birth: pat?.date_of_birth,
      };
    });

    res.status(200).json(userDetails);
    return;
  }
});

// @desc Get user by ID
// @route GET /api/v1/users/:id
// @access Private
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await UserModel.findById(id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  let profileData = {};

  if (user.user_type === UserType.Doctor) {
    const doc = await DoctorModel.findOne({ doctor_id: user._id });
    if (doc) profileData = { specialization: doc.specialization, bio: doc.bio };
  }

  if (user.user_type === UserType.Patient) {
    const pat = await PatientModel.findOne({ patient_id: user._id });
    if (pat) profileData = { gender: pat.gender, date_of_birth: pat.date_of_birth };
  }

  res.status(200).json({ ...user.toObject(), ...profileData });
});

// @desc updates user based on user type
// @route PUT /api/v1/users/:id
// @access Private
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    first_name,
    last_name,
    email,
    phone_number,
    password,
    specialization,
    bio,
    gender,
    date_of_birth,
  } = req.body;

  const user = await UserModel.findById(id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.first_name = first_name ?? user.first_name;
  user.last_name = last_name ?? user.last_name;
  user.email = email ?? user.email;
  user.phone_number = phone_number ?? user.phone_number;
  if (password) {
    user.password = password;
  }

  await user.save();

  if (user.user_type === UserType.Doctor) {
    const doctor = await DoctorModel.findOne({ doctor_id: id });
    if (doctor) {
      doctor.specialization = specialization ?? doctor.specialization;
      doctor.bio = bio ?? doctor.bio;
      await doctor.save();
    }
  }

  if (user.user_type === UserType.Patient) {
    const patient = await PatientModel.findOne({ patient_id: id });
    if (patient) {
      patient.gender = gender ?? patient.gender;
      patient.date_of_birth = date_of_birth ?? patient.date_of_birth;
      await patient.save();
    }
  }

  res.status(200).json({ message: 'User updated successfully' });
});

// @desc deletes user and associated doctor/patient field
// @route DELETE /api/v1/users/:id
// @access Private
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const user_id = req.params.id;

  const user = (await UserModel.findById(user_id)) as User;
  if (!user) {
    res.status(404);
    throw new Error("User to be deleted doesn't exist");
  }

  const user_type = user.user_type;

  if (user_type === UserType.Doctor) {
    await DoctorModel.findOneAndDelete({ doctor_id: user_id });
  } else if (user_type === UserType.Patient) {
    await PatientModel.findOneAndDelete({ patient_id: user_id });
  } else {
    res.status(400);
    throw new Error("user_type must be either doctor or patient");
  }

  await UserModel.findByIdAndDelete(user_id);
  res.status(202);
});

// @desc Login user and get JWT token
// @route POST /api/v1/users/login
// @access Public
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
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

  const refreshToken = generateToken({
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


  res.status(200).json({
    token,
    user_id: user._id,
    user_type: user.user_type,
  });
});

// @desc Get current logged-in user
// @route GET /api/v1/users/me
// @access Private
export const getMe = asyncHandler(async (req: any, res: Response) => {
  const user = await UserModel.findById(req.user._id).select('-password');
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  let profileData = {};

  if (user.user_type === UserType.Doctor) {
    const doc = await DoctorModel.findOne({ doctor_id: user._id });
    if (doc) profileData = { specialization: doc.specialization, bio: doc.bio };
  }

  if (user.user_type === UserType.Patient) {
    const pat = await PatientModel.findOne({ patient_id: user._id });
    if (pat) profileData = { gender: pat.gender, date_of_birth: pat.date_of_birth };
  }
  res.status(200).json({ ...user.toObject(), ...profileData });
  res.status(200).json(user);
});

// @desc Update current logged-in user
// @route PUT /api/v1/users/me
// @access Private
export const updateMe = asyncHandler(async (req: any, res: Response) => {
  const {
    first_name,
    last_name,
    email,
    phone_number,
    password,
    specialization,
    bio,
    gender,
    date_of_birth,
  } = req.body;

  const user = await UserModel.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  
  user.first_name = first_name ?? user.first_name;
  user.last_name = last_name ?? user.last_name;
  user.email = email ?? user.email;
  user.phone_number = phone_number ?? user.phone_number;
  if (password) user.password = password;

  await user.save();

  if (user.user_type === UserType.Doctor) {
    const doctor = await DoctorModel.findOne({ doctor_id: user._id });
    if (doctor) {
      doctor.specialization = specialization ?? doctor.specialization;
      doctor.bio = bio ?? doctor.bio;
      await doctor.save();
    }
  }

  if (user.user_type === UserType.Patient) {
    const patient = await PatientModel.findOne({ patient_id: user._id });
    if (patient) {
      patient.gender = gender ?? patient.gender;
      patient.date_of_birth = date_of_birth ?? patient.date_of_birth;
      await patient.save();
    }
  }

  res.status(200).json({ message: "User updated successfully", user });
});

// @desc Delete current logged-in user
// @route PUT /api/v1/users/me
// @access Private
export const deleteMe = asyncHandler(async (req: any, res: Response) => {
  const user_id = req.user._id;

  const user = (await UserModel.findById(user_id)) as User;
  if (!user) {
    res.status(404);
    throw new Error("User to be deleted doesn't exist");
  }

  const user_type = user.user_type;

  if (user_type === UserType.Doctor) {
    await DoctorModel.findOneAndDelete({ doctor_id: user_id });
  } else if (user_type === UserType.Patient) {
    await PatientModel.findOneAndDelete({ patient_id: user_id });
  } else {
    res.status(400);
    throw new Error("user_type must be either doctor or patient");
  }

  await UserModel.findByIdAndDelete(user_id);
  res.status(204);
});

// @desc generates new access token again a valid refresh token
// @route PUT /api/v1/users/refresh-token
// @access Private
export const refreshToken = asyncHandler(async (req: any, res: any) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET!) as Payload;

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