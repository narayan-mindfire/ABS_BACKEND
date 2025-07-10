import express from "express"
import { createAppointment, deleteAppointment, getAppointments, getMyAppointments, updateAppointment } from "../controller/appointments.controller"
import { protect } from "../middleware/authMiddleware"
import {patientOnly} from "../middleware/allowPatient"
import { adminOnly } from "../middleware/allowAdmin"
// appointment routers
const appointmentRouter = express.Router()

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Get all appointments
 *     description: Returns a list of all appointments with populated patient, doctor, and slot details.
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of appointments
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       403:
 *         description: Forbidden - Only admin users can access
 *   post:
 *     summary: Book a new appointment
 *     description: Allows a patient to book an appointment with a doctor for a specific date and time.
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patient_id
 *               - doctor_id
 *               - slot_date
 *               - slot_time
 *             properties:
 *               patient_id:
 *                 type: string
 *               doctor_id:
 *                 type: string
 *               slot_date:
 *                 type: string
 *                 format: date
 *               slot_time:
 *                 type: string
 *                 example: "09:00 AM"
 *               purpose:
 *                 type: string
 *                 example: "Regular checkup"
 *     responses:
 *       201:
 *         description: Appointment booked successfully
 *       400:
 *         description: Bad request (e.g. slot already booked)
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       403:
 *         description: Forbidden - Only patients can book appointments
 */
appointmentRouter.route("/").get(protect, adminOnly, getAppointments).post(protect, patientOnly, createAppointment)

/**
 * @swagger
 * /appointments/me:
 *   get:
 *     summary: Get current user's appointments
 *     description: Returns a list of appointments for the currently logged-in user (Doctor or Patient).
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of appointments for the current user
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       403:
 *         description: Forbidden - Only Doctors or Patients can access this route
 */
appointmentRouter.route("/me").get(protect, getMyAppointments)

/**
 * @swagger
 * /appointments/{id}:
 *   put:
 *     summary: Update an appointment
 *     description: Updates appointment details such as date, time, purpose, or status. If the slot is changed, it ensures the new slot is available.
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Appointment ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               slot_date:
 *                 type: string
 *                 format: date
 *               slot_time:
 *                 type: string
 *               purpose:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Booked, Completed, Cancelled]
 *     responses:
 *       200:
 *         description: Appointment updated successfully
 *       400:
 *         description: Bad request or slot conflict
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Appointment not found
 * 
 *   delete:
 *     summary: Delete an appointment
 *     description: Deletes an appointment and its associated slot.
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Appointment ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Appointment deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Appointment not found
 */
appointmentRouter.route("/:id").put(protect, updateAppointment).delete(protect, deleteAppointment)

export default appointmentRouter