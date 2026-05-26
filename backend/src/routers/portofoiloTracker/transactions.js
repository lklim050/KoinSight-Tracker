import express from "express";
import {
  createTransaction,
  deleteTransaction,
  postTransaction,
  readAllTransactions,
  seedTranactions,
  updateTransaction,
  getUserAssets,
} from "../../controllers/portofoiloTracker/transactions.js";
import { protect } from "../../middlewares/auth.js";

const router = express.Router({ mergeParams: true });

router.get("/seed", protect, seedTranactions);
router.get("/", protect, readAllTransactions);
router.put("/", protect, createTransaction);
router.post("/:transId", protect, postTransaction);
router.patch("/:transId", protect, updateTransaction);
router.delete("/:transId", protect, deleteTransaction);
// router.get("/seed", seedTranactions);
// router.get("/myAssets", getUserAssets);
// router.get("/", readAllTransactions);
// router.put("/", createTransaction);
// router.post("/:transId", postTransaction);
// router.patch("/:transId", updateTransaction);
// router.delete("/:transId", deleteTransaction);

export default router;
