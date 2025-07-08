import { Router } from "express";
import appointmentRouter from "./appointments.routes";

const router = Router();

router.use('/appointments', appointmentRouter)

export default router;