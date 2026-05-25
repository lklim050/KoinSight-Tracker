import express from "express";
import {
  postTop250Coins,
  postWatch24hHistories,
  postWatch30dHistories,
} from "../../controllers/portofoiloTracker/getAPI.js";

const router = express.Router();

router.post("/sync24hr", postWatch24hHistories);
router.post("/sync30days", postWatch30dHistories);
router.post("/syncTop250", postTop250Coins);

export default router;
