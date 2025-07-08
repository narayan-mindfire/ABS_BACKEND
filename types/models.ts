import mongoose, { Document } from 'mongoose';

export enum UserType {
  Patient = 'patient',
  Doctor = 'doctor',
  Admin = 'admin'
}

export enum SlotTime {
  T10 = '10:00',
  T11 = '11:00',
  T12 = '12:00',
  T14 = '14:00',
  T15 = '15:00',
  T16 = '16:00',
  T17 = '17:00'
}

export enum Specialization {
  Cardiology = 'Cardiology',
  Medicine = 'Medicine',
  Dermatology = 'Dermatology',
  Neurology = 'Neurology',
  Pediatrics = 'Pediatrics'
}

export enum AppointmentStatus {
  Booked = 'booked',
  Completed = 'completed',
  Cancelled = 'cancelled',
  NoShow = 'no-show'
}

export interface User {
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  user_type: UserType;
  password: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Patient extends Document {
  patient_id: mongoose.Types.ObjectId;
  gender?: string;
  date_of_birth?: Date;
}

export interface Doctor extends Document {
  doctor_id: mongoose.Types.ObjectId;
  specialization: Specialization;
  bio?: string;
}

export interface Slot extends Document {
  doctor_id: mongoose.Types.ObjectId;
  slot_date: Date;
  slot_time: string;
  expire_at: Date;
}

export interface Appointment extends Document {
  patient_id: mongoose.Types.ObjectId;
  doctor_id: mongoose.Types.ObjectId;
  slot_id: mongoose.Types.ObjectId;
  status: AppointmentStatus;
  purpose?: string;
  created_at?: Date;
  updated_at?: Date;
}