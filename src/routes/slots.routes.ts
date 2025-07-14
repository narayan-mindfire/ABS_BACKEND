import { getBookedSlots, getBookedSlotsByDoctor, getBookedSlotsForDoctorAndDate } from "../controller/slots.controller"
import express from "express"
import { doctorOnly } from "../middleware/allowDoctor"
import { protect } from "../middleware/authMiddleware"
import { patientOnly } from "../middleware/allowPatient"
// routers for listing all slots and single slot based on slot id
const slotRouter = express.Router()

/**
 * @swagger
 * /slots:
 *   get:
 *     summary: Get all booked slots or a specific slot by ID
 *     description: Returns a list of all booked slots. If a slot_id is provided as a URL parameter, returns details for that specific slot.
 *     tags:
 *       - Slots
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slot_id
 *         schema:
 *           type: string
 *         required: false
 *         description: Optional slot ID to fetch a specific slot
 *     responses:
 *       200:
 *         description: A list of booked slots or a single slot
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       404:
 *         description: Slot not found
 */
slotRouter.route("/").get(protect, getBookedSlots)

/**
 * @swagger
 * /slots/me:
 *   get:
 *     summary: Get all booked slots for the logged-in doctor
 *     description: Returns a list of all slots booked for the currently authenticated doctor. This route is accessible only to users with the `doctor` role.
 *     tags:
 *       - Slots
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of booked slots for the doctor
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       403:
 *         description: Forbidden - User is not a doctor
 */
slotRouter.route("/me").get(protect, doctorOnly, getBookedSlotsByDoctor)

// /**
//  * @swagger
//  * /slots/{slot_id}:
//  *   get:
//  *     summary: Get a booked slot by ID
//  *     description: Retrieve a specific booked slot using its slot ID.
//  *     tags:
//  *       - Slots
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: slot_id
//  *         required: true
//  *         description: The ID of the slot to retrieve
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Booked slot found
//  *       401:
//  *         description: Unauthorized - Token missing or invalid
//  *       404:
//  *         description: Slot not found
//  */
// slotRouter.route("/:slot_id").get(getBookedSlots)

/**
 * @swagger
 * /slots/doctor:
 *   get:
 *     summary: Get booked slots for a doctor on a specific date
 *     description: Returns a list of slots booked for a specific doctor on a particular date. This route is accessible only to authenticated users.
 *     tags:
 *       - Slots
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: doctor_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the doctor
 *       - in: query
 *         name: slot_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: The date for which slots are to be fetched (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of booked slots for the doctor on the given date
 *       400:
 *         description: Missing or invalid query parameters
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       403:
 *         description: Forbidden - Access denied
 */
slotRouter.route("/doctor").get(protect, patientOnly, getBookedSlotsForDoctorAndDate)
export default slotRouter