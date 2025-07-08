import express  from "express"
import { createUser, deleteUser, getUsers, updateUser } from "../controller/users.controller"

const userRouter = express.Router()

userRouter.route("/").post(createUser).get(getUsers)
userRouter.route('/:id').delete(deleteUser).put(updateUser)

export default userRouter