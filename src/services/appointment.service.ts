import { AppointmentRepository } from "../repositories/appointment.repository";
import { AppointmentStatus, SlotDocument, UserType } from "../types/models";
import mongoose from "mongoose";

export const AppointmentService = {
  async getAllAppointments() {
    return AppointmentRepository.findAll();
  },

  async createAppointment(user: any, body: any) {
    const { doctor_id, slot_date, slot_time, purpose } = body;

    if (!doctor_id || !slot_date || !slot_time) {
      throw new Error("Missing required fields");
    }

    const requestedSlot = new Date(`${slot_date}T${slot_time}`);
    if (requestedSlot < new Date()) {
      throw new Error(
        "The requested slot is older than current time, hence invalid"
      );
    }

    const existingSlot = await AppointmentRepository.findSlot(
      doctor_id,
      new Date(slot_date),
      slot_time
    );
    if (existingSlot) throw new Error("This slot is already booked");

    const slot = await AppointmentRepository.createSlot({
      doctor_id,
      slot_date: new Date(slot_date),
      slot_time,
      expire_at: requestedSlot,
    });

    return AppointmentRepository.createAppointment({
      patient_id: user._id,
      doctor_id,
      slot_id: slot._id,
      purpose,
      status: AppointmentStatus.Booked,
    });
  },

  async updateAppointment(id: string, body: any) {
    const { slot_date, slot_time, purpose, status } = body;

    const appointment = await AppointmentRepository.findById(id);
    if (!appointment) throw new Error("Appointment not found");

    let updatedSlotId = appointment.slot_id;

    const currentSlot: SlotDocument | null =
      await AppointmentRepository.findSlotById(
        appointment.slot_id as mongoose.Types.ObjectId
      );

    const isSlotChangeRequested =
      slot_date &&
      slot_time &&
      (!currentSlot ||
        currentSlot.slot_date.toISOString().split("T")[0] !== slot_date ||
        currentSlot.slot_time !== slot_time);

    if (isSlotChangeRequested) {
      const conflict = await AppointmentRepository.findSlot(
        appointment.doctor_id.toString(),
        new Date(slot_date),
        slot_time
      );
      if (conflict) throw new Error("The selected new slot is already booked");

      if (currentSlot)
        await AppointmentRepository.deleteSlot(currentSlot._id.toString());

      const newSlot = await AppointmentRepository.createSlot({
        doctor_id: appointment.doctor_id.toString(),
        slot_date: new Date(slot_date),
        slot_time,
        expire_at: new Date(`${slot_date}T${slot_time}`),
      });

      updatedSlotId = newSlot._id as mongoose.Types.ObjectId;
    }

    return AppointmentRepository.updateAppointment(id, {
      purpose: purpose ?? appointment.purpose,
      status: status ?? appointment.status,
      slot_id: updatedSlotId,
      updated_at: new Date(),
    });
  },

  async deleteAppointment(id: string) {
    const appointment = await AppointmentRepository.findById(id);
    if (!appointment) throw new Error("Appointment not found");

    await AppointmentRepository.deleteSlot(appointment.slot_id.toString());
    return appointment.deleteOne();
  },

  async getAppointmentsByUser(user: any) {
    const isDoctor = user.user_type === UserType.Doctor;

    const appointments = isDoctor
      ? await AppointmentRepository.findByDoctor(user._id)
      : await AppointmentRepository.findByPatient(user._id);

    return appointments
      .map((appointment) => {
        const nameObj = isDoctor
          ? (appointment.patient_id as any)
          : (appointment.doctor_id as any);
        const slot = appointment.slot_id as any;

        if (!nameObj || !slot) return null;

        return {
          id: appointment._id,
          name: `${nameObj.first_name} ${nameObj.last_name}`,
          email: nameObj.email,
          doctor: isDoctor
            ? undefined
            : `${(appointment.doctor_id as any).first_name} ${
                (appointment.doctor_id as any).last_name
              }`,
          date: slot.slot_date.toISOString().split("T")[0],
          slot: slot.slot_time,
          purpose: appointment.purpose || "",
          status: appointment.status,
        };
      })
      .filter(Boolean);
  },
};
