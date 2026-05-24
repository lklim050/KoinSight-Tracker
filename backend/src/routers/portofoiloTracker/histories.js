import express from "express";
import { postWatch24hHistories } from "../../controllers/portofoiloTracker/histories.js";

const router = express.Router();

router.post("/sync-history", postWatch24hHistories);

export default router;
