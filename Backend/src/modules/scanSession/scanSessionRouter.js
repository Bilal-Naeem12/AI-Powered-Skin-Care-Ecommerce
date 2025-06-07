const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const router = express.Router();

// ⬇️ Cloudinary config (from .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const sessions = new Map(); // Store session info in-memory

// 1. Create a scan session
router.post("/", (req, res) => {
  const sessionId = uuidv4();
  sessions.set(sessionId, { status: "pending", imageUrl: null });
  res.json({ sessionId });
});

// 2. Get scan session status
router.get("/:sessionId/status", (req, res) => {
  const { sessionId } = req.params;
  const session = sessions.get(sessionId);
  if (!session) return res.status(404).json({ error: "Session not found" });

  if (session.status === "uploaded") {
    return res.json({
      status: "uploaded",
      imageUrl: session.imageUrl,
    });
  }

  res.json({ status: "pending" });
});

// 3. Upload image to Cloudinary
const storage = multer.memoryStorage(); // Uploads in memory
const upload = multer({ storage });

router.post("/:sessionId/upload", upload.single("file"), async (req, res) => {
  const { sessionId } = req.params;
  const session = sessions.get(sessionId);
  const userId = req.body.userId || "anonymous"; // 🟡 Pass userId from frontend or fallback

  if (!session) return res.status(404).json({ error: "Session not found" });
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    // Upload to Cloudinary with structured folder path
    const folderPath = `ai-analyze/${userId}`;
    const publicId = `${sessionId}`;

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folderPath,
          public_id: publicId,
          resource_type: "image",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    });

    session.status = "uploaded";
    session.imageUrl = uploadResult.secure_url;

    res.json({ status: "ok", cloudinaryUrl: uploadResult.secure_url });
  } catch (err) {
    console.error("Cloudinary upload failed:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;
