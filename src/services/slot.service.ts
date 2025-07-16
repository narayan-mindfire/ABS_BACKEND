import { SlotRepository } from "../repositories/slot.repository";
import mongoose from "mongoose";

export const SlotService = {
  async getBookedSlots(slotId?: string) {
    if (slotId) {
      const slot = await SlotRepository.findById(slotId);
      if (!slot) throw new Error("Invalid slot ID");
      return slot;
    }
    return SlotRepository.findAll();
  },

  async getSlotsByDoctor(doctorId: mongoose.Types.ObjectId) {
    return SlotRepository.findByDoctorId(doctorId);
  },

  async getSlotsByDoctorAndDate(doctorId: string, slotDate: string) {
    const slots = await SlotRepository.findByDoctorAndDate(doctorId, slotDate);
    return slots.map((slot: { slot_time: any }) => slot.slot_time);
  },
};
