import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import UserModel from "../models/User";
import DoctorModel from "../models/Doctor";
import PatientModel from "../models/Patient";
import { User, UserType } from "../types/models";

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
    res.statusCode =400;
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
    res.statusCode = 404;
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
    res.statusCode = 404;
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
    res.statusCode = 404;
    throw new Error("User to be deleted doesn't exist");
  }

  const user_type = user.user_type;

  if (user_type === UserType.Doctor) {
    await DoctorModel.findOneAndDelete({ doctor_id: user_id });
  } else if (user_type === UserType.Patient) {
    await PatientModel.findOneAndDelete({ patient_id: user_id });
  } else {
    res.statusCode = 400;
    throw new Error("user_type must be either doctor or patient");
  }

  await UserModel.findByIdAndDelete(user_id);
  res.status(202);
});

// @desc Get current logged-in user
// @route GET /api/v1/users/me
// @access Private
export const getMe = asyncHandler(async (req: any, res: Response) => {
  const user = await UserModel.findById(req.user._id).select('-password');
  
  if (!user) {
    res.statusCode = 404;
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
    res.statusCode = 404;
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
    res.statusCode = 404;
    throw new Error("User to be deleted doesn't exist");
  }

  const user_type = user.user_type;

  if (user_type === UserType.Doctor) {
    await DoctorModel.findOneAndDelete({ doctor_id: user_id });
  } else if (user_type === UserType.Patient) {
    await PatientModel.findOneAndDelete({ patient_id: user_id });
  } else {
    res.statusCode = 400;
    throw new Error("user_type must be either doctor or patient");
  }

  await UserModel.findByIdAndDelete(user_id);
  res.status(204);
});