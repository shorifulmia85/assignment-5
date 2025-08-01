import express, { Application, Request, Response } from "express";
const app: Application = express();
import dotenv from "dotenv";
import { router } from "./app/routes";
import { notFound } from "./app/middlewares/notFound";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
dotenv.config();

app.use(express.json());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to ride booking system");
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
