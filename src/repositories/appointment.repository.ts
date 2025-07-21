import AppointmentModel from "../models/Appointment";
import SlotModel from "../models/Slot";
import { Appointment, SlotDocument } from "../types/models";
import { BaseRepository } from "./BaseRepository";
import mongoose from "mongoose";

class AppointmentRepositoryClass {
  private appointmentRepo = new BaseRepository<Appointment>(AppointmentModel);
  private slotRepo = new BaseRepository<SlotDocument>(SlotModel);

  findAll() {
    return AppointmentModel.find()
      .populate("patient_id", "first_name last_name")
      .populate("doctor_id", "first_name last_name specialization")
      .populate("slot_id", "slot_date slot_time");
  }

  findById(id: string) {
    return this.appointmentRepo.findById(id);
  }

  createAppointment(data: Partial<Appointment>) {
    return this.appointmentRepo.create(data);
  }

  updateAppointment(id: string, data: Partial<Appointment>) {
    return this.appointmentRepo.update(id, data);
  }

  deleteAppointment(id: string) {
    return this.appointmentRepo.delete(id);
  }

  createSlot(data: Partial<SlotDocument>) {
    return this.slotRepo.create(data);
  }

  findSlotById(slotId: mongoose.Types.ObjectId) {
    return this.slotRepo.findById(slotId.toString());
  }

  deleteSlot(slotId: string) {
    return this.slotRepo.delete(slotId);
  }

  findSlot(doctor_id: string, slot_date: Date, slot_time: string) {
    return SlotModel.findOne({ doctor_id, slot_date, slot_time });
  }

  findByPatient(patientId: string) {
    return AppointmentModel.find({ patient_id: patientId })
      .populate("doctor_id", "first_name last_name specialization")
      .populate("slot_id");
  }

  findByDoctor(doctorId: string) {
    return AppointmentModel.find({ doctor_id: doctorId })
      .populate("patient_id", "first_name last_name")
      .populate("slot_id");
  }
}

export const AppointmentRepository = new AppointmentRepositoryClass();
