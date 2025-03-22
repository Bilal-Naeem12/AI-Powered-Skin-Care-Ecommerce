const AuditLog = require("./auditLogModel");
const { generateActionDescription, logAction } = require("./auditLogUtils");

// **🔹 Create Audit Log**
exports.createAuditLog = async (adminId, actionType, targetModel, targetId, actionDescription, ipAddress, deviceInfo, role) => {
    const description = generateActionDescription(actionType, targetModel, targetId);
    return await logAction(adminId, actionType, targetModel, targetId, description, ipAddress, deviceInfo, role);
};

// **🔹 Get All Audit Logs**
exports.getAllAuditLogs = async () => {
    return await AuditLog.find().populate("adminId");
};

// **🔹 Get Audit Log by ID**
exports.getAuditLogById = async (logId) => {
    return await AuditLog.findById(logId).populate("adminId");
};
