import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { AppointmentService } from "../services/appointment.service";

export const getAppointments = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await AppointmentService.getAllAppointments();
    res.status(200).json(data);
  }
);

export const createAppointment = asyncHandler(
  async (req: any, res: Response) => {
    const data = await AppointmentService.createAppointment(req.user, req.body);
    res.status(201).json(data);
  }
);

export const updateAppointment = asyncHandler(
  async (req: Request, res: Response) => {
    const updated = await AppointmentService.updateAppointment(
      req.params.id,
      req.body
    );
    res.status(200).json(updated);
  }
);

export const deleteAppointment = asyncHandler(
  async (req: Request, res: Response) => {
    await AppointmentService.deleteAppointment(req.params.id);
    res.status(200).json({ message: `Appointment ${req.params.id} deleted` });
  }
);

export const getMyAppointments = asyncHandler(
  async (req: any, res: Response) => {
    const data = await AppointmentService.getAppointmentsByUser(req.user);
    res.status(200).json(data);
  }
);
