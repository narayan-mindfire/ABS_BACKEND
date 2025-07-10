import express from "express"
import { createAppointment, deleteAppointment, getAppointments, updateAppointment } from "../controller/appointments.controller"
import { protect } from "../middleware/authMiddleware"
import {patientOnly} from "../middleware/allowPatient"
// appointment routers
const appointmentRouter = express.Router()

appointmentRouter.route("/").get(getAppointments).post(protect, patientOnly, createAppointment)
appointmentRouter.route("/:id").put(protect, updateAppointment).delete(protect, deleteAppointment)

export default appointmentRouter