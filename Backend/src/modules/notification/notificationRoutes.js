const router = require("express").Router();
const controller = require("./notificationController");
const { authMiddleware } = require("../../middleware/authMiddleware"); // ⬅️ adjust if yours differs

router.use(authMiddleware); // protect all routes

// 📥 Get all notifications (user or admin)
router.get("/", controller.getAll);

// 📄 View one notification by ID
router.get("/:id", controller.getOne);

// 🆕 Create a notification (admin panel or test route)
router.post("/", controller.create);

// ✅ Mark notification as read
router.patch("/:id/read", controller.markAsRead);

// ❌ Delete notification (admin only)
router.delete("/:id", controller.remove);

module.exports = router;
