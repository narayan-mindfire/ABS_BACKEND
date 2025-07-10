# Backend-ABS (Appointment Booking System)

This is the backend of an Appointment Booking System built with **Node.js**, **Express**, **MongoDB**, and **TypeScript**. It supports user registration and login, appointment creation and management, role-based access control (Doctor, Patient, Admin), and Swagger-based API documentation.

---

## Features

- RESTful API with Express
- Role-based authorization (Doctor / Patient / Admin)
- User management with secure password hashing (bcryptjs)
- JWT-based authentication
- Appointment creation and slot booking
- API documentation using Swagger (available at `/api-docs`)
- MongoDB database using Mongoose ODM
- Written in TypeScript

---

## Project Structure

```
controllers
models
routes
middleware
utils
index.ts
swagger.ts
```

---

## Configuration

### Environment Variables

Create a `.env` file in the root with the following:

```env
PORT=5001
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
```

---

## Installation & Running

### 1. Clone the repository

```bash
git clone https://github.com/your-username/backend-abs.git
cd backend-abs
```

### 2. Install dependencies

```bash
npm install
```

### 3. Development mode

```bash
npm run serve
```

This runs:

- TypeScript compiler in watch mode
- `nodemon` to auto-restart the server on changes

### 4. Production build and start

```bash
npm run build
npm start
```

---

## Available NPM Scripts

| Script     | Description                                       |
| ---------- | ------------------------------------------------- |
| `build`    | Compile TypeScript into `/dist` folder            |
| `start`    | Run the compiled app from `/dist`                 |
| `serve`    | Development mode with live reload (tsc + nodemon) |
| `prestart` | Auto run build before `start`                     |
| `preserve` | Auto run build before `serve`                     |

---

## API Documentation

Visit [`http://localhost:5001/api-docs`](http://localhost:5000/api-docs) after running the server to view Swagger UI.

---

## 🛠 Tech Stack

- **Node.js**
- **Express**
- **TypeScript**
- **MongoDB + Mongoose**
- **JWT Authentication**
- **Swagger (OpenAPI)**
- **bcryptjs**
- **dotenv**

---
