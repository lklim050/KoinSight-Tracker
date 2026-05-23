import express from "express";
import { protect } from "../middlewares/auth.js";
import { signup, login } from "../controllers/auth.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",

    user: req.user,
  });
});

export default router;
