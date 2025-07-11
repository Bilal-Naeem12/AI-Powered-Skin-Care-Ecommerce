const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const { authMiddleware } = require("../../middleware/authMiddleware");
const crypto = require('crypto');
const User = require("../users/userModel")
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
  const _id = req.body._id ?req.body._id: "anonymous"; // 🟡 Pass _id from frontend or fallback

  if (!session) return res.status(404).json({ error: "Session not found" });
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    // Upload to Cloudinary with structured folder path
    const folderPath = `ai-analyze/${_id}`;
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






router.post("/upload-to-folder", upload.single("file"),authMiddleware, async (req, res) => {
  const { _id, first_name } = req.user;

  if (!_id || !first_name)
    return res.status(400).json({ error: "_id and first_name are required" });

  if (!req.file)
    return res.status(400).json({ error: "No file uploaded" });

  try {
    const folderPath = `scannedImages/${first_name}-${_id}/`;
    const publicId = uuidv4(); // Give a unique name to each uploaded file

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

    res.json({
      status: "ok",
      message: "Image uploaded successfully",
      cloudinaryUrl: uploadResult.secure_url,
      folder: folderPath,
      publicId,
    });
  } catch (err) {
    console.error("Upload to structured folder failed:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});



router.post(
  "/upload-face-verification",
  upload.single("file"),
  authMiddleware,
  async (req, res) => {
    const userId = req.user._id;
    const { first_name } = req.user;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      // Folder structure: faceVerification/user-id
      const folderPath = `faceVerification/${first_name}-${userId}/`;
      const publicId = uuidv4();

      // Upload image to Cloudinary
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

      const secureUrl = uploadResult.secure_url;

      // Generate HMAC hash for later verification
      const hash = crypto
        .createHmac("sha256", process.env.PROGRESS_HASH_SECRET)
        .update(secureUrl)
        .digest("hex");

      // Create entry for faceVerificationData
      const verificationEntry = {
        uploadedImage: secureUrl,
        uploadedAt: new Date(),
        hash,
        // These can be filled later if you want:
        analysisResult: "",
        comparedToPrevious: "",
      };

      // Save to user document
      await User.findByIdAndUpdate(userId, {
        $push: { faceVerificationData: verificationEntry },
      });

      res.json({
        status: "ok",
        message: "Face verification image uploaded & saved",
        hash,
      });
    } catch (err) {
      console.error("Face verification upload failed:", err);
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

module.exports = router;
