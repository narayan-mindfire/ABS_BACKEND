import { getBookedSlots } from "../controller/slots.controller"
import express from "express"

const slotRouter = express.Router()

slotRouter.route("/").get(getBookedSlots)
slotRouter.route("/:slot_id").get(getBookedSlots)

export default slotRouter