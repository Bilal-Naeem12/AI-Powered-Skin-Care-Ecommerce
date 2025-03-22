const BannerService = require("./bannerService");

// **🔹 Create a Banner**
exports.createBanner = async (req, res) => {
    try {
        const bannerData = req.body;
        const newBanner = await BannerService.createBanner(bannerData);
        res.status(201).json({ message: "Banner created successfully", banner: newBanner });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// **🔹 Get All Active Banners**
exports.getActiveBanners = async (req, res) => {
    try {
        const activeBanners = await BannerService.getActiveBanners();
        res.status(200).json(activeBanners);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// **🔹 Get Banner by ID**
exports.getBannerById = async (req, res) => {
    try {
        const { bannerId } = req.params;
        const banner = await BannerService.getBannerById(bannerId);
        if (!banner) return res.status(404).json({ message: "Banner not found" });

        res.status(200).json(banner);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// **🔹 Update Banner Status (Activate/Deactivate)**
exports.updateBannerStatus = async (req, res) => {
    try {
        const { bannerId, status } = req.body;
        const updatedBanner = await BannerService.updateBannerStatus(bannerId, status);
        res.status(200).json({ message: "Banner status updated", banner: updatedBanner });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
