import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import bookedSlotSchema from '../models/Slot';

/**
 * @desc Get all booked slots or a specific booked slot by ID
 * @route GET /api/v1/slots/:slot_id?
 * @access Private
 */
export const getBookedSlots = asyncHandler(async (req: Request, res: Response) => {
  const {slot_id} = req.params;
  console.log("returns slots", slot_id)
  if(slot_id){
    console.log("got slot id: ", slot_id)
    const slot = await bookedSlotSchema.findById(slot_id)
    if(slot) res.status(200).json(slot);
    else {
        res.status(404)
        throw new Error ("invalid slot")
    }
  }
  const slots = await bookedSlotSchema.find()
  res.status(200).json(slots);
});

/**
 * @desc Get all booked slots of a doctory - can be called by user with user_type : doctor
 * @route GET /api/v1/slots/me
 * @access Private
 */
export const getBookedSlotsByDoctor = asyncHandler(async (req: any, res: Response) => {
  const doctorId = req.user._id;
  const slots = await bookedSlotSchema.find({ doctor_id: doctorId });
  res.status(200).json(slots);
})