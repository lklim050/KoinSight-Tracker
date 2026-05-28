import express from "express";
import {
  createTransaction,
  deleteTransaction,
  postTransaction,
  readAllTransactions,
  seedTranactions,
  updateTransaction,
  // getUserAssets,
} from "../../controllers/portofoiloTracker/transactions.js";
import { protect } from "../../middlewares/auth.js";

const router = express.Router({ mergeParams: true });

router.get("/seed", protect, seedTranactions);
router.get("/", protect, readAllTransactions);
router.put("/", protect, createTransaction);
router.post("/:transId", protect, postTransaction);
router.patch("/:transId", protect, updateTransaction);
router.delete("/:transId", protect, deleteTransaction);

export default router;
