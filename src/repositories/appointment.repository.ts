import AppointmentModel from "../models/Appointment";
import SlotModel from "../models/Slot";
import mongoose from "mongoose";

export const AppointmentRepository = {
  async findAll() {
    return AppointmentModel.find()
      .populate("patient_id", "first_name last_name")
      .populate("doctor_id", "first_name last_name specialization")
      .populate("slot_id", "slot_date slot_time");
  },

  async createSlot(data: {
    doctor_id: string;
    slot_date: Date;
    slot_time: string;
    expire_at: Date;
  }) {
    return SlotModel.create(data);
  },

  async findSlot(doctor_id: string, slot_date: Date, slot_time: string) {
    return SlotModel.findOne({ doctor_id, slot_date, slot_time });
  },

  async createAppointment(data: any) {
    return AppointmentModel.create(data);
  },

  async findById(id: string) {
    return AppointmentModel.findById(id);
  },

  async findSlotById(slotId: mongoose.Types.ObjectId) {
    return SlotModel.findById(slotId);
  },

  async updateAppointment(id: string, data: any) {
    return AppointmentModel.findByIdAndUpdate(id, data, { new: true });
  },

  async deleteAppointment(id: string) {
    return AppointmentModel.findByIdAndDelete(id);
  },

  async deleteSlot(slotId: string) {
    return SlotModel.findByIdAndDelete(slotId);
  },

  async findByPatient(patientId: string) {
    return AppointmentModel.find({ patient_id: patientId })
      .populate("doctor_id", "first_name last_name specialization")
      .populate("slot_id");
  },

  async findByDoctor(doctorId: string) {
    return AppointmentModel.find({ doctor_id: doctorId })
      .populate("patient_id", "first_name last_name")
      .populate("slot_id");
  },
};
