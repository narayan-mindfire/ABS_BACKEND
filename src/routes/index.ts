import { Router } from "express";
import appointmentRouter from "./appointments.routes";
import userRouter from "./users.routes";    
import slotRouter from "./slots.routes";

// root router
const router = Router();

router.use('/appointments', appointmentRouter)
router.use('/users', userRouter)
router.use('/slots', slotRouter)

export default router;