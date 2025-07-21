import { Router } from "express";
import appointmentRouter from "./appointments.routes";
import userRouter from "./users.routes";    
import slotRouter from "./slots.routes";
import authRouter from "./auth.routes"
// root router
const router = Router();

router.use('/appointments', appointmentRouter)
router.use('/users', userRouter)
router.use('/slots', slotRouter)
router.use('/auth', authRouter)

export default router;