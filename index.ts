import express, {Express, Request, Response} from "express"
import dotenv from "dotenv"

dotenv.config()
const port = process.env.PORT

const app:Express = express()

app.get("/", (req:Request, res:Response) => {
    res.send("hello from express, this is written in ts")
})

app.get("/hi", (req: Request, res: Response) => {
    res.send("hi, you're in the hi route")
})

app.listen(port, () => {
    console.log(`listening at port ${port}`)
})