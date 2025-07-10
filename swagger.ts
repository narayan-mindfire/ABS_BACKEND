// swagger.ts
import swaggerJSDoc from "swagger-jsdoc"
import dotenv from "dotenv"
dotenv.config()

export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Appointment Booking System API",
      version: "1.0.0",
      description: "API documentation for the appointment booking system",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}/api/v1`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
