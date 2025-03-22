const express = require("express");
const {
    getSystemConfig,
    updateSystemConfig
} = require("./systemConfigController");

const router = express.Router();

// **🔹 Route to Get System Configuration**
router.get("/", getSystemConfig);

// **🔹 Route to Update System Configuration**
router.put("/", updateSystemConfig);

module.exports = router;
