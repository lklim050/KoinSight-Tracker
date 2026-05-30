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
import {
  validateCreateTransData,
  validateDeleteTransaction,
  validatePostTransaction,
  validateUpdateTransData,
} from "../../validators/validTrans.js";
import checkTransError from "../../validators/checkTrans.js";

const router = express.Router({ mergeParams: true });

router.get("/seed", protect, seedTranactions);
router.get("/", protect, readAllTransactions);
router.put(
  "/",
  protect,
  validateCreateTransData,
  checkTransError,
  createTransaction,
);
router.post(
  "/:transId",
  protect,
  validatePostTransaction,
  checkTransError,
  postTransaction,
);
router.patch(
  "/:transId",
  protect,
  validateUpdateTransData,
  checkTransError,
  updateTransaction,
);
router.delete(
  "/:transId",
  protect,
  validateDeleteTransaction,
  checkTransError,
  deleteTransaction,
);

export default router;
