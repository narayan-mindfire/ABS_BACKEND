import UserModel from "../models/User";
import DoctorModel from "../models/Doctor";
import PatientModel from "../models/Patient";
import { BaseRepository } from "./BaseRepository";
import { Doctor, Patient, User } from "../types/models";
import mongoose from "mongoose";

class UserRepository extends BaseRepository<
  User & { _id: mongoose.Types.ObjectId }
> {
  constructor() {
    super(UserModel);
  }

  findByEmail(email: string) {
    return this.findOne({ email });
  }
}

class DoctorRepository extends BaseRepository<Doctor> {
  constructor() {
    super(DoctorModel);
  }
}

class PatientRepository extends BaseRepository<Patient> {
  constructor() {
    super(PatientModel);
  }
}
class AuthRepositoryClass {
  private userRepo = new UserRepository();
  private doctorRepo = new DoctorRepository();
  private patientRepo = new PatientRepository();

  findUserByEmail(email: string) {
    return this.userRepo.findByEmail(email);
  }

  createUser(userData: Partial<User>) {
    return this.userRepo.create(userData);
  }

  createDoctor(doctorData: Partial<Doctor>) {
    return this.doctorRepo.create(doctorData);
  }

  createPatient(patientData: Partial<Patient>) {
    return this.patientRepo.create(patientData);
  }
}

export const AuthRepository = new AuthRepositoryClass();
