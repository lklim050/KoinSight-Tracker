import express from "express";
import {
  getTop250Coins,
  postCoin24hrHistory,
  postCoin30daysHistory,
  postTop250Coins,
} from "../../controllers/portofoiloTracker/getDB.js";

const router = express.Router();

router.post("/post24hr", postCoin24hrHistory);
router.post("/post30days", postCoin30daysHistory);
router.get("/getTop250", getTop250Coins);
router.post("/postTop250", postTop250Coins);

export default router;
