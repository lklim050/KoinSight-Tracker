import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/db/db.js";
import {
  jsonErrorHandler,
  globalErrorHandler,
} from "./src/middlewares/errorhandlers.js";
import rateLimit from "express-rate-limit";
import cors from "cors";
import helmet from "helmet";
import auth from "./src/routers/auth.js";

dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);
app.use(helmet());
app.use(cors());
app.use("/auth", auth);

app.use(jsonErrorHandler);

// Define all your routes and controllers here:

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(globalErrorHandler);
