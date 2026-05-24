import express from "express";
import {
  readAllAssets,
  seedAssets,
} from "../../controllers/portofoiloTracker/assets.js";

const router = express.Router();

router.get("/", readAllAssets);
router.get("/seed", seedAssets);

export default router;
