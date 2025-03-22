const express = require("express");
const {
    createAuditLog,
    getAllAuditLogs,
    getAuditLogById
} = require("./auditLogController");

const router = express.Router();

// **🔹 Route to Create an Audit Log**
router.post("/create", createAuditLog);

// **🔹 Route to Get All Audit Logs**
router.get("/", getAllAuditLogs);

// **🔹 Route to Get Audit Log by ID**
router.get("/:logId", getAuditLogById);

module.exports = router;
