const express = require("express");
const {
    createBanner,
    getActiveBanners,
    getBannerById,
    updateBannerStatus
} = require("./bannerController");

const router = express.Router();

// **🔹 Route to Create a New Banner**
router.post("/create", createBanner);

// **🔹 Route to Get All Active Banners**
router.get("/", getActiveBanners);

// **🔹 Route to Get Banner by ID**
router.get("/:bannerId", getBannerById);

// **🔹 Route to Update Banner Status**
router.put("/status", updateBannerStatus);

module.exports = router;
