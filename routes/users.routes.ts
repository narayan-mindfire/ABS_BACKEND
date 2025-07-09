import express  from "express"
import { registerUser, deleteUser, getUsers, updateUser, loginUser } from "../controller/users.controller"

const userRouter = express.Router()

userRouter.route("/").get(getUsers)
userRouter.route('/:id').delete(deleteUser).put(updateUser)
userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)

export default userRouter