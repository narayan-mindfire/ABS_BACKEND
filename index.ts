import express, {Express, Request, Response} from "express"
import dotenv from "dotenv"
import connectDB from "./config/db"
import router from "./routes"
import errorHandler from "./middleware/errorHandler"
dotenv.config()
const port = process.env.PORT

connectDB()
const app:Express = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/api/v1', router)

app.get("/", (req:Request, res:Response) => {
    res.send("hello from express, this is written in ts")
})

app.get("/hi", (req: Request, res: Response) => {
    res.send("hi, you're in the hi route")
})

app.use(errorHandler)

app.listen(port, () => {
    console.log(`listening at port ${port}`)
})