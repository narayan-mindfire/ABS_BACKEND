import { getBookedSlots, getBookedSlotsByDoctor } from "../controller/slots.controller"
import express from "express"
import { doctorOnly } from "../middleware/allowDoctor"
import { protect } from "../middleware/authMiddleware"
// routers for listing all slots and single slot based on slot id
const slotRouter = express.Router()

slotRouter.route("/").get(protect, getBookedSlots)
slotRouter.route("/me").get(protect, doctorOnly, getBookedSlotsByDoctor)
slotRouter.route("/:slot_id").get(getBookedSlots)
export default slotRouter