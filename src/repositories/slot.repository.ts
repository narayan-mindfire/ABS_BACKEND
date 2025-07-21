import SlotModel from "../models/Slot";
import mongoose from "mongoose";
import { BaseRepository } from "./BaseRepository";

class SlotRepositoryClass extends BaseRepository<any> {
  constructor() {
    super(SlotModel);
  }

  findByDoctorId(doctorId: mongoose.Types.ObjectId) {
    return this.model.find({ doctor_id: doctorId });
  }

  findByDoctorAndDate(doctorId: string, slotDate: string) {
    return this.model.find({ doctor_id: doctorId, slot_date: slotDate });
  }
}

export const SlotRepository = new SlotRepositoryClass();
