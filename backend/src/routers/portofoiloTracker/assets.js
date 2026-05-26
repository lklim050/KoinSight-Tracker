import express from "express";
import {
  getAssets,
  getPortfolio,
  readAllAssets,
  seedAssets,
} from "../../controllers/portofoiloTracker/assets.js";
import { protect } from "../../middlewares/auth.js";

const router = express.Router();

router.get("/read", readAllAssets);
router.get("/seed", seedAssets);
router.get("/", protect, getAssets);
router.get("/all", protect, getPortfolio);

export default router;
