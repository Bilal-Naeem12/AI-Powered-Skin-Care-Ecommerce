const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");

const router = express.Router();
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const sessions = new Map(); // In production, use Redis or Mongo

// 1. Create a scan session (POST /api/scan-session)
router.post("/", (req, res) => {
  const sessionId = uuidv4();
  sessions.set(sessionId, { status: "pending", imagePath: null });
  res.json({ sessionId });
});

// 2. Poll session status (GET /api/scan-session/:sessionId/status)
router.get("/:sessionId/status", (req, res) => {
  const { sessionId } = req.params;
  const session = sessions.get(sessionId);
  if (!session) return res.status(404).json({ error: "Session not found" });
  if (session.status === "uploaded") {
    // Make sure /uploads is served statically!
    return res.json({
      status: "uploaded",
      imageUrl: `/uploads/${path.basename(session.imagePath)}`,
    });
  }
  res.json({ status: "pending" });
});

// 3. Upload file (POST /api/scan-session/:sessionId/upload)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, `${req.params.sessionId}${ext}`);
  },
});
const upload = multer({ storage });

router.post(
  "/:sessionId/upload",
  upload.single("file"),
  (req, res) => {
    const { sessionId } = req.params;
    const session = sessions.get(sessionId);
    if (!session) return res.status(404).json({ error: "Session not found" });
    if (!req.file) return res.status(400).json({ error: "No file" });
    session.status = "uploaded";
    session.imagePath = req.file.path;
    res.json({ status: "ok" });
  }
);

module.exports = router;
