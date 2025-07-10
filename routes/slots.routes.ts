import { getBookedSlots, getBookedSlotsByDoctor } from "../controller/slots.controller"
import express from "express"
import { doctorOnly } from "../middleware/allowDoctor"
import { protect } from "../middleware/authMiddleware"
// routers for listing all slots and single slot based on slot id
const slotRouter = express.Router()

/**
 * @swagger
 * /api/v1/slots:
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   doctor_id:
 *                     type: string
 *                   slot_date:
 *                     type: string
 *                     format: date
 *                   slot_time:
 *                     type: string
 *                   expire_at:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       404:
 *         description: Slot not found
 */
slotRouter.route("/").get(protect, getBookedSlots)

/**
 * @swagger
 * /api/v1/slots/me:
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

/**
 * @swagger
 * /api/v1/slots/{slot_id}:
 *   get:
 *     summary: Get a booked slot by ID
 *     description: Retrieve a specific booked slot using its slot ID.
 *     tags:
 *       - Slots
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slot_id
 *         required: true
 *         description: The ID of the slot to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booked slot found
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       404:
 *         description: Slot not found
 */
slotRouter.route("/:slot_id").get(getBookedSlots)

export default slotRouter