"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
dotenv_1.default.config();
const port = process.env.PORT;
(0, db_1.default)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use('/api/v1', routes_1.default);
app.get("/", (req, res) => {
    res.send("hello from express, this is written in ts");
});
app.get("/hi", (req, res) => {
    res.send("hi, you're in the hi route");
});
app.use(errorHandler_1.default);
app.listen(port, () => {
    console.log(`listening at port ${port}`);
});
