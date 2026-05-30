import { body, param } from "express-validator";

export const validateDeleteTransaction = [
  param("transId", "Transaction ID is required").trim().notEmpty(),
  param("transId", "Transaction ID must be a valid Mongo ID")
    .trim()
    .isMongoId(),
];

export const validatePostTransaction = [
  param("transId", "Transaction ID is required").trim().notEmpty(),
  param("transId", "Transaction ID must be a valid Mongo ID")
    .trim()
    .isMongoId(),
];

export const validateCreateTransData = [
  body("transType")
    .trim()
    .notEmpty()
    .withMessage("Transaction type is required")
    .toLowerCase()
    .isIn(["buy", "sell", "transfer_in", "transfer_out"])
    .withMessage(
      "Transaction type must be 'buy', 'sell', 'transfer_in', or 'transfer_out'",
    ),
  body("coinType").trim().notEmpty().withMessage("Coin type is required"),
  body("quantity")
    .trim()
    .notEmpty()
    .withMessage("Quantity is required")
    .isFloat({ gt: 0 })
    .withMessage("Quantity must be a number greater than 0"),
  body("pricePerCoin")
    .trim()
    .notEmpty()
    .withMessage("Price per coin is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be 0 or greater"),
  body("date")
    .trim()
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Invalid date format (Use YYYY-MM-DD)"),
  body("time")
    .trim()
    .notEmpty()
    .withMessage("Time is required")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Invalid time format (Use HH:MM)"),
];

export const validateUpdateTransData = [
  param("transId")
    .trim()
    .notEmpty()
    .withMessage("Transaction ID is required")
    .isMongoId()
    .withMessage("Invalid Transaction ID format"),
  body("quantity")
    .optional()
    .trim()
    .isFloat({ gt: 0 })
    .withMessage("Quantity must be a number greater than 0"),
  body("pricePerCoin")
    .optional()
    .trim()
    .isFloat({ min: 0 })
    .withMessage("Price must be 0 or greater"),
  body("date")
    .optional()
    .trim()
    .isISO8601()
    .withMessage("Invalid date format (Use YYYY-MM-DD)"),
  body("time")
    .optional()
    .trim()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Invalid time format (Use HH:MM)"),
];
