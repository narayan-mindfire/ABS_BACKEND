import express  from "express"
import { registerUser, deleteUser, getUsers, updateUser, loginUser, getUserById, getMe, updateMe, deleteMe } from "../controller/users.controller"
import { protect } from "../middleware/authMiddleware"
import { adminOnly } from "../middleware/allowAdmin"

const userRouter = express.Router()

// user routes
userRouter.route('/me').get(protect, getMe).put(protect, updateMe).delete(protect, deleteMe)
userRouter.route("/").get(protect, adminOnly, getUsers)
userRouter.route('/:id').delete(protect, adminOnly, deleteUser).put(protect, adminOnly, updateUser).get(protect, adminOnly, getUserById)
userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)

export default userRouter