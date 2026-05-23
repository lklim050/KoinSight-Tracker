import express from "express";
import {
  createTransaction,
  deleteTransaction,
  postTransaction,
  readAllTransactions,
  seedTranactions,
  updateTransaction,
} from "../../controllers/portofoiloTracker/transactions.js";

const router = express.Router({ mergeParams: true });

router.get("/seed", seedTranactions);
router.get("/", readAllTransactions);
router.put("/", createTransaction);
router.post("/:transId", postTransaction);
router.patch("/:transId", updateTransaction);
router.delete("/:transId", deleteTransaction);

export default router;
