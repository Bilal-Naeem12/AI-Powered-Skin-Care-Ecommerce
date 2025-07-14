const express = require("express");
const router = express.Router();
const { submitContactMessage,getAllMessages,getMessageById,deleteMessage } = require("./contactMessagesController");
const { authMiddleware } = require("../../middleware/authMiddleware"); // ⬅️ adjust if yours differs
const { roleMiddleware } = require("../../middleware/roleMiddleware"); // ⬅️ adjust if yours differs

// POST /api/contact
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  getMessageById
);

// Admin: delete a message
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteMessage
);
router.post("/", submitContactMessage);
// Admin: list all messages
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getAllMessages
);

// Admin: get a single message


module.exports = router;