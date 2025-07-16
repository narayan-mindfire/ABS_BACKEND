import UserModel from "../models/User";
import DoctorModel from "../models/Doctor";
import PatientModel from "../models/Patient";

export const AuthRepository = {
  findUserByEmail: (email: string) => UserModel.findOne({ email }),

  createUser: (userData: any) => UserModel.create(userData),

  createDoctor: (doctorData: any) => DoctorModel.create(doctorData),

  createPatient: (patientData: any) => PatientModel.create(patientData),
};
