import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import bookedSlotSchema from '../models/Slot';

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
