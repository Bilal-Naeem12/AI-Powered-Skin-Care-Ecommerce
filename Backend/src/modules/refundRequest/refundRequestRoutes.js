const express = require("express");
const {
  createRefundRequest,
  reviewRefundRequest,
  getAllRefundRequests,
  uploadRefundProofImages,
} = require("./refundRequestController");
const { authMiddleware } = require("../../middleware/authMiddleware");
const { roleMiddleware } = require("../../middleware/roleMiddleware");

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

/* Customer: Upload refund proof images */
router.post("/:id/images", authMiddleware, upload.array("images", 5), uploadRefundProofImages);

/* Customer: Submit refund request (takes array of URLs returned by upload) */
router.post("/:id", authMiddleware, createRefundRequest);

/* Admin: Approve/Reject */
router.put("/:id/review", authMiddleware, roleMiddleware("admin"), reviewRefundRequest);

/* Admin: Get all refund requests */
router.get("/", authMiddleware, roleMiddleware("admin"), getAllRefundRequests);

module.exports = router;
