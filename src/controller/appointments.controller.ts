import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import AppointmentModel from "../models/Appointment";
import SlotModel from "../models/Slot";
import { Appointment, AppointmentStatus, UserType } from "../types/models";
import mongoose from "mongoose";

// @desc    Get all appointments
// @route   GET /api/v1/appointments
// @access  Private
export const getAppointments = asyncHandler(
  async (req: Request, res: Response) => {
    const appointments = await AppointmentModel.find()
      .populate("patient_id", "first_name last_name")
      .populate("doctor_id", "first_name last_name specialization")
      .populate("slot_id", "slot_date slot_time");

    res.status(200).json(appointments);
  }
);

// @desc    Create new appointment
// @route   POST /api/v1/appointments
// @access  Private (patient only)
export const createAppointment = asyncHandler(
  async (req: any, res: Response) => {
    const { doctor_id, slot_date, slot_time, purpose } = req.body;
    const patient_id = (req as any).user._id;
    if (!doctor_id) {
      res.status(400);
      throw new Error("No such doctor");
    }
    if (!doctor_id || !slot_date || !slot_time) {
      res.status(400);
      throw new Error("Missing required fields");
    }

    const requestedSlot = new Date(`${slot_date}T${slot_time}`);
    if (requestedSlot < new Date()) {
      res.status(400);
      throw new Error(
        "The requested slot is older than current time, hence invalid"
      );
    }

    const existingSlot = await SlotModel.findOne({
      doctor_id,
      slot_date: new Date(slot_date),
      slot_time,
    });

    if (existingSlot) {
      res.status(400);
      throw new Error("This slot is already booked");
    }

    const expireAt = new Date(`${slot_date}T${slot_time}`);
    const slot = await SlotModel.create({
      doctor_id,
      slot_date,
      slot_time,
      expire_at: expireAt,
    });

    const appointment = await AppointmentModel.create({
      patient_id,
      doctor_id,
      slot_id: slot._id,
      purpose,
      status: AppointmentStatus.Booked,
    });

    res.status(201).json(appointment);
  }
);

// @desc    Update appointment
// @route   PUT /api/v1/appointments/:id
// @access  Private
export const updateAppointment = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { slot_date, slot_time, purpose, status } = req.body;

    const appointment = (await AppointmentModel.findById(id)) as Appointment;
    if (!appointment) {
      res.status(404);
      throw new Error("Appointment not found");
    }

    const doctor_id = appointment.doctor_id;
    let updatedSlotId = appointment.slot_id;

    const currentSlot = await SlotModel.findById(appointment.slot_id);

    const isSlotChangeRequested =
      slot_date &&
      slot_time &&
      (!currentSlot ||
        currentSlot.slot_date.toISOString().split("T")[0] !== slot_date ||
        currentSlot.slot_time !== slot_time);

    if (isSlotChangeRequested) {
      const conflict = await SlotModel.findOne({
        doctor_id,
        slot_date: new Date(slot_date),
        slot_time,
      });

      if (conflict) {
        res.status(400);
        throw new Error("The selected new slot is already booked");
      }

      if (currentSlot) await currentSlot.deleteOne();

      const expireAt = new Date(`${slot_date}T${slot_time}`);
      const newSlot = await SlotModel.create({
        doctor_id,
        slot_date: new Date(slot_date),
        slot_time,
        expire_at: expireAt,
      });
      updatedSlotId = newSlot._id as mongoose.Types.ObjectId;
    }

    const updated = await AppointmentModel.findByIdAndUpdate(
      id,
      {
        purpose: purpose ?? appointment.purpose,
        status: status ?? appointment.status,
        slot_id: updatedSlotId,
        updated_at: new Date(),
      },
      { new: true }
    );

    res.status(200).json(updated);
  }
);

// @desc    Delete appointment
// @route   DELETE /api/v1/appointments/:id
// @access  Private
export const deleteAppointment = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const appointment = await AppointmentModel.findById(id);
    if (!appointment) {
      res.status(404);
      throw new Error("Appointment not found");
    }
    await SlotModel.findByIdAndDelete(appointment.slot_id);
    await appointment.deleteOne();

    res.status(200).json({ message: `Appointment ${id} deleted` });
  }
);

// @desc    Get user's appointments
export const getMyAppointments = asyncHandler(
  async (req: any, res: Response) => {
    const user = req.user;
    let appointments;
    if (user.user_type === UserType.Patient) {
      appointments = await AppointmentModel.find({ patient_id: user._id })
        .populate("doctor_id", "first_name last_name specialization")
        .populate("slot_id");
    } else if (user.user_type === UserType.Doctor) {
      appointments = await AppointmentModel.find({ doctor_id: user._id })
        .populate("patient_id", "first_name last_name")
        .populate("slot_id");
    } else {
      res.status(403);
      throw new Error("Invalid user type");
    }

    const formatted = appointments
      .map((appointment) => {
        const isDoctor = user.user_type === UserType.Doctor;
        const nameObj = isDoctor
          ? (appointment.patient_id as any)
          : (appointment.doctor_id as any);

        const slot = appointment.slot_id as any;

        if (!nameObj || !slot) {
          console.warn(
            `Invalid appointment data. Possibly deleted user or slot. Skipping appointment with ID: ${appointment._id}`
          );
          return null;
        }

        const data = {
          id: appointment._id,
          name: `${nameObj.first_name} ${nameObj.last_name}`,
          email: nameObj.email,
          doctor: isDoctor
            ? undefined
            : `${(appointment.doctor_id as any).first_name} ${
                (appointment.doctor_id as any).last_name
              }`,
          date: slot?.slot_date?.toISOString().split("T")[0],
          slot: slot?.slot_time,
          purpose: appointment.purpose || "",
          status: appointment.status,
        };
        return data;
      })
      .filter(Boolean);

    res.status(200).json(formatted);
  }
);
