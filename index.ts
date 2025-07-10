import express, {Express} from "express"
import dotenv from "dotenv"
import connectDB from "./config/db"
import router from "./routes"
import errorHandler from "./middleware/errorHandler"
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";

dotenv.config()
const port = process.env.PORT

connectDB()
const app:Express = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/api/v1', router)

app.use(errorHandler)

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
    console.log(`listening at port ${port}`)
    console.log(`Swagger docs at http://localhost:${port}/api-docs`); 
})