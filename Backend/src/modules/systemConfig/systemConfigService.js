const SystemConfig = require("./systemConfigModel");

// **🔹 Get System Configuration**
exports.getSystemConfig = async () => {
    const config = await SystemConfig.findOne();
    if (!config) {
        throw new Error("System configuration not found");
    }
    return config;
};

// **🔹 Update System Configuration**
exports.updateSystemConfig = async (updateData) => {
    const config = await SystemConfig.findOne();
    if (!config) {
        throw new Error("System configuration not found");
    }

    // Update the system configuration with the new data
    Object.assign(config, updateData);
    await config.save();
    return config;
};
