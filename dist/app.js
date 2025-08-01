"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = require("./app/routes");
const notFound_1 = require("./app/middlewares/notFound");
const globalErrorHandler_1 = require("./app/middlewares/globalErrorHandler");
dotenv_1.default.config();
app.use(express_1.default.json());
app.use("/api/v1", routes_1.router);
app.get("/", (req, res) => {
    res.send("Welcome to ride booking system");
});
app.use(globalErrorHandler_1.globalErrorHandler);
app.use(notFound_1.notFound);
exports.default = app;
