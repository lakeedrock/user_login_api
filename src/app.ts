import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { routes } from "./routes/routes";

export const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: [process.env.FRONTEND_ORIGIN],
  })
);
routes(app);
