import express from "express"
import { createAppointment, deleteAppointment, getAppointments, updateAppointment } from "../controller/appointments.controller"

// appointment routers
const appointmentRouter = express.Router()

appointmentRouter.route("/").get(getAppointments).post(createAppointment)
appointmentRouter.route("/:id").put(updateAppointment).delete(deleteAppointment)

export default appointmentRouter