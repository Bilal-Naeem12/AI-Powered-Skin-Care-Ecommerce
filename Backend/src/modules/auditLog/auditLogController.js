const { sendError } = require("../../middleware/errorHandler");
const AuditLogService = require("./auditLogService");

// **🔹 Create an Audit Log**
exports.createAuditLog = async (req, res) => {
    try {
        const { adminId, actionType, targetModel, targetId, actionDescription, ipAddress, deviceInfo, role } = req.body;
        const log = await AuditLogService.createAuditLog(adminId, actionType, targetModel, targetId, actionDescription, ipAddress, deviceInfo, role);
        res.status(201).json({ message: "Audit log created successfully", log });
    } catch (error) {
        sendError(res, error);
    }
};

// **🔹 Get All Audit Logs**
exports.getAllAuditLogs = async (req, res) => {
    try {
        const logs = await AuditLogService.getAllAuditLogs();
        res.status(200).json(logs);
    } catch (error) {
        sendError(res, error);
    }
};

// **🔹 Get Audit Log by ID**
exports.getAuditLogById = async (req, res) => {
    try {
        const { logId } = req.params;
        const log = await AuditLogService.getAuditLogById(logId);
        if (!log) return res.status(404).json({ message: "Audit log not found" });
        res.status(200).json(log);
    } catch (error) {
        sendError(res, error);
    }
};
