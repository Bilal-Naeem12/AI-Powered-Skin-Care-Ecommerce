// **🔹 Generate Action Description**
exports.generateActionDescription = (actionType, targetModel, targetId) => {
    return `${actionType} on ${targetModel} with ID ${targetId ? targetId : "N/A"}`;
};

// **🔹 Get Device Information**
exports.getDeviceInfo = (userAgent) => {
    // A simple function to parse user-agent string (you can extend it for better device info)
    const deviceInfo = userAgent || "Unknown Device";
    return deviceInfo;
};

// **🔹 Log Action to AuditLog**
exports.logAction = async (adminId, actionType, targetModel, targetId, actionDescription, ipAddress, deviceInfo, role) => {
    const log = new AuditLog({
        adminId,
        actionType,
        targetModel,
        targetId,
        actionDescription,
        ipAddress,
        deviceInfo,
        role
    });

    await log.save();
    return log;
};
