const express = require("express");
const {
  addRecommendations,
  getByHistory,
} = require("./recommendationProductController");
const { authMiddleware } = require("../../middleware/authMiddleware");

const router = express.Router();

// bulk add for one history
router.post("/:historyId", authMiddleware, addRecommendations);
// list for one history
router.get("/:historyId", authMiddleware, getByHistory);

module.exports = router;
