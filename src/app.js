import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import job from "./config/cron.js";

const app = express();

// middleware
job.start();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes

app.use("/api/v1/auth", authRoutes);
export default app;
