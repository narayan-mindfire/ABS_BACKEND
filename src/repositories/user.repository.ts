import UserModel from "../models/User";
import DoctorModel from "../models/Doctor";
import PatientModel from "../models/Patient";
import { UserType } from "../types/models";
import { BaseRepository } from "./BaseRepository";

class UserRepositoryClass extends BaseRepository<any> {
  constructor() {
    super(UserModel);
  }

  findUsersByType(user_type: UserType) {
    return this.model.find({ user_type });
  }

  findDoctorDetails(userIds: string[]) {
    return DoctorModel.find({ doctor_id: { $in: userIds } });
  }

  findPatientDetails(userIds: string[]) {
    return PatientModel.find({ patient_id: { $in: userIds } });
  }

  findDoctorByUserId(id: string) {
    return DoctorModel.findOne({ doctor_id: id });
  }

  findPatientByUserId(id: string) {
    return PatientModel.findOne({ patient_id: id });
  }

  updateDoctorProfile(id: string, updates: any) {
    return DoctorModel.findOneAndUpdate({ doctor_id: id }, updates, {
      new: true,
    });
  }

  updatePatientProfile(id: string, updates: any) {
    return PatientModel.findOneAndUpdate({ patient_id: id }, updates, {
      new: true,
    });
  }

  deleteDoctorProfile(id: string) {
    return DoctorModel.findOneAndDelete({ doctor_id: id });
  }

  deletePatientProfile(id: string) {
    return PatientModel.findOneAndDelete({ patient_id: id });
  }

  deleteUser(id: string) {
    return this.model.findByIdAndDelete(id);
  }

  updateUser(id: string, updates: any) {
    return this.model.findByIdAndUpdate(id, updates, { new: true });
  }
}

export const UserRepository = new UserRepositoryClass();
