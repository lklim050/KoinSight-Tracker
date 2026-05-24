import express from "express";
import {
  postCoin24hrHistory,
  postCoin30daysHistory,
} from "../../controllers/portofoiloTracker/getDB.js";

const router = express.Router();

router.post("/post24hr", postCoin24hrHistory);
router.post("/post30days", postCoin30daysHistory);

export default router;
