import express from "express"
import { loginUser, refreshToken, registerUser } from "../controller/auth.controller";

const authRouter = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user (doctor or patient)
 *     tags: [Auth]
 *     description: |
 *       Creates a user and conditionally creates a doctor or patient profile based on `user_type`.  
 *       - For `doctor`, `specialization` is required.  
 *       - For `patient`, `gender` and `date_of_birth` are required.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - password
 *               - user_type
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: John
 *               last_name:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *               phone_number:
 *                 type: string
 *                 example: "9876543210"
 *               user_type:
 *                 type: string
 *                 enum: [doctor, patient]
 *                 example: doctor
 *               specialization:
 *                 type: string
 *                 example: cardiologist
 *               bio:
 *                 type: string
 *                 example: Expert in heart surgeries
 *               gender:
 *                 type: string
 *                 example: male
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *                 example: 1990-01-01
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 user_id:
 *                   type: string
 *                   example: 60c72b2f9b1e8c001f0e4b8a
 *                 user_type:
 *                   type: string
 *                   example: doctor
 *                 token:
 *                   type: string
 *       400:
 *         description: Missing required fields or email already in use
 */
authRouter.post('/register', registerUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Logs in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid credentials
 */
authRouter.post('/login', loginUser)

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh the access token using a valid refresh token cookie
 *     tags: [Auth]
 *     description: |
 *       This endpoint generates a new access token by validating the refresh token stored in the user's cookie.
 *       The refresh token must be present in the HTTP-only cookie named `refreshToken`.
 *     responses:
 *       200:
 *         description: New access token generated
 *       401:
 *         description: No refresh token provided
 *       403:
 *         description: Invalid or expired refresh token
 */
authRouter.post('/refresh-token', refreshToken);

export default authRouter