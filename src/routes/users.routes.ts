import express  from "express"
import { registerUser, deleteUser, getUsers, updateUser, loginUser, getUserById, getMe, updateMe, deleteMe } from "../controller/users.controller"
import { protect } from "../middleware/authMiddleware"
import { adminOnly } from "../middleware/allowAdmin"

const userRouter = express.Router()

// user routes
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get list of all users or users filtered by user type (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: user_type
 *         schema:
 *           type: string
 *           enum: [doctor, patient]
 *         description: Optional filter to return only doctors or patients
 *     responses:
 *       200:
 *         description: List of users (with doctor/patient info if applicable)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   first_name:
 *                     type: string
 *                   last_name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   user_type:
 *                     type: string
 *                   specialization:
 *                     type: string
 *                   bio:
 *                     type: string
 *                   gender:
 *                     type: string
 *                   date_of_birth:
 *                     type: string
 *                     format: date
 *       400:
 *         description: Invalid user_type
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       403:
 *         description: Forbidden - user is not an admin
 */
userRouter.route("/").get(protect, adminOnly, getUsers);

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user (doctor or patient)
 *     tags: [Users]
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
userRouter.post('/register', registerUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Logs in a user
 *     tags: [Users]
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
userRouter.post('/login', loginUser)

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current logged-in user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the user profile including doctor or patient data
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       404:
 *         description: User not found
 *
 *   put:
 *     summary: Update current logged-in user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone_number:
 *                 type: string
 *                 example: "9876543210"
 *               password:
 *                 type: string
 *               specialization:
 *                 type: string
 *               bio:
 *                 type: string
 *               gender:
 *                 type: string
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       404:
 *         description: User not found
 *
 *   delete:
 *     summary: Delete current logged-in user's account (doctor or patient)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       404:
 *         description: User not found
 */
userRouter
  .route('/me')
  .get(protect, getMe)
  .put(protect, updateMe)
  .delete(protect, deleteMe);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB user ID
 *     responses:
 *       200:
 *         description: Returns the user with associated profile data (doctor or patient)
 *       401:
 *         description: Unauthorized or missing token
 *       403:
 *         description: Forbidden (not admin)
 *       404:
 *         description: User not found
 * 
 *   put:
 *     summary: Update user by ID (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone_number:
 *                 type: string
 *                 example: "9876543210"
 *               password:
 *                 type: string
 *               specialization:
 *                 type: string
 *               bio:
 *                 type: string
 *               gender:
 *                 type: string
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: Unauthorized or missing token
 *       403:
 *         description: Forbidden (not admin)
 *       404:
 *         description: User not found
 * 
 *   delete:
 *     summary: Delete user by ID (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Invalid user type
 *       401:
 *         description: Unauthorized or missing token
 *       403:
 *         description: Forbidden (not admin)
 *       404:
 *         description: User not found
 */
userRouter
  .route('/:id')
  .get(protect, adminOnly, getUserById)
  .put(protect, adminOnly, updateUser)
  .delete(protect, adminOnly, deleteUser);

export default userRouter