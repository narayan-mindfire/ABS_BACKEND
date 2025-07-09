import express  from "express"
import { registerUser, deleteUser, getUsers, updateUser, loginUser, getUserById, getMe, updateMe } from "../controller/users.controller"
import { protect } from "../middleware/authMiddleware"

const userRouter = express.Router()

// user routes
userRouter.route('/me').get(protect, getMe).put(protect, updateMe)
userRouter.route("/").get(getUsers)
userRouter.route('/:id').delete(deleteUser).put(updateUser).get(getUserById)
userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)

export default userRouter