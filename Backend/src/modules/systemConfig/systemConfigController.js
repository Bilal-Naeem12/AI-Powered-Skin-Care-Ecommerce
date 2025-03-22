const SystemConfigService = require("./systemConfigService");

// **🔹 Get System Configuration**
exports.getSystemConfig = async (req, res) => {
    try {
        const config = await SystemConfigService.getSystemConfig();
        res.status(200).json(config);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// **🔹 Update System Configuration**
exports.updateSystemConfig = async (req, res) => {
    try {
        const updateData = req.body;
        const updatedConfig = await SystemConfigService.updateSystemConfig(updateData);
        res.status(200).json({ message: "System configuration updated successfully", config: updatedConfig });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
