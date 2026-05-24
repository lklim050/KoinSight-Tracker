import express from "express";
import {
  postWatch24hHistories,
  postWatch30dHistories,
} from "../../controllers/portofoiloTracker/getAPI.js";

const router = express.Router();

router.post("/sync24hr", postWatch24hHistories);
router.post("/sync30days", postWatch30dHistories);

export default router;
