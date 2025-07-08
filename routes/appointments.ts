import express from "express"

const appointmentsRouter = express.Router()

appointmentsRouter.get("/", (req, res) => {
    console.log("get request received")
    res.status(200).json({message: "this will provide all the appointments"})
})
appointmentsRouter.post("/", (req, res) => {
    res.status(201).json({message: `appointment is created!`})
})
appointmentsRouter.put("/:id", (req, res) => {
    res.status(202).json({message: `appointment with id: ${req.params.id} is updated`})
})
appointmentsRouter.delete("/:id", (req, res) => {
    res.status(200).json({message: `the appointment with id: ${req.params.id} is deleted`})
})

export default appointmentsRouter