import express, { Express } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import router from "./routes";
import errorHandler from "./middleware/errorHandler";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger/swagger";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import cors from "cors";

dotenv.config();
const port = process.env.PORT;

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

connectDB();
const app: Express = express();

app.use(
  cors({
    origin: [
      process.env.CLIENT_URL!,
      process.env.LOCAL_CLIENT_URL!,
      process.env.REACT_CLIENT_URL!,
    ],
    credentials: true,
  })
);

app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/v1", router);

app.use(errorHandler);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.listen(port, () => {
  console.log(`listening at port ${port}`);
  console.log(`Swagger docs at http://localhost:${port}/api-docs`);
});
