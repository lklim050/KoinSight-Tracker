import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./src/db/db.js";
import {
  jsonErrorHandler,
  globalErrorHandler,
} from "./src/middlewares/errorhandlers.js";
import rateLimit from "express-rate-limit";
import cors from "cors";
import helmet from "helmet";
import auth from "./src/routers/auth.js";
import transactions from "./src/routers/portofoiloTracker/transactions.js";
import assets from "./src/routers/portofoiloTracker/assets.js";
import getAPI from "./src/routers/portofoiloTracker/getAPI.js";
import getDB from "./src/routers/portofoiloTracker/getDB.js";
import { initCronJobs } from "./src/config/cron.js";
import dns from "dns";
import mongoose from "mongoose";

// for deployment at altas
dns.setServers(["8.8.8.8", "8.8.4.4"]);
mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

connectDB();
const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // for deploy FRONTEND URL is the Render env
  }),
);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Define all your routes and controllers here:
app.use("/auth", auth);
app.use("/api", getAPI);
app.use("/db", getDB);
app.use("/assets", assets);
app.use("/transactions", transactions);

app.use(jsonErrorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(globalErrorHandler);

initCronJobs();
