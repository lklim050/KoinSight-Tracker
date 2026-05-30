import express from "express";
import {
  getAssets,
  getPortfolio,
  getOrSyncPortfolioHistory,
} from "../../controllers/portofoiloTracker/assets.js";
import { protect } from "../../middlewares/auth.js";

const router = express.Router();

router.get("/", protect, getAssets);
router.get("/all", protect, getPortfolio);
router.get("/chart", protect, getOrSyncPortfolioHistory);

export default router;
