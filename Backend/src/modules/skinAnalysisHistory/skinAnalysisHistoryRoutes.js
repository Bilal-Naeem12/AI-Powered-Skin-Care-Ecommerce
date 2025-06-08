const express = require("express");
const {
  createHistory,
  getHistoryByUser,
  getHistoryById,
  deleteHistory,
} = require("./skinAnalysisHistoryController");
const { authMiddleware } = require("../../middleware/authMiddleware");
const { roleMiddleware } = require("../../middleware/roleMiddleware");

const router = express.Router();

// create & read history
router.post("/user/:userId", authMiddleware, createHistory);
router.get("/user/:userId", authMiddleware, getHistoryByUser);
router.get("/:id", authMiddleware, getHistoryById);
router.delete("/:id", authMiddleware,roleMiddleware("admin"), deleteHistory);

module.exports = router;
