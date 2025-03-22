const Banner = require("./bannerModel");
const { isActiveBanner, generateRedirectUrl } = require("./bannerUtils");

// **🔹 Create Banner**
exports.createBanner = async (bannerData) => {
    const newBanner = new Banner(bannerData);
    await newBanner.save();
    return newBanner;
};

// **🔹 Get Active Banners**
exports.getActiveBanners = async () => {
    return await Banner.find({ isActive: true }).sort({ priority: 1, startDate: 1 });
};

// **🔹 Get Banner by ID**
exports.getBannerById = async (bannerId) => {
    return await Banner.findById(bannerId);
};

// **🔹 Update Banner Status (Activate/Deactivate)**
exports.updateBannerStatus = async (bannerId, status) => {
    const banner = await Banner.findById(bannerId);
    if (!banner) throw new Error("Banner not found");

    banner.isActive = status;
    await banner.save();
    return banner;
};

// **🔹 Check if Banner is Active**
exports.checkBannerStatus = (banner) => {
    return isActiveBanner(banner.startDate, banner.endDate);
};

// **🔹 Get Redirect URL for Banner**
exports.getRedirectUrl = (banner) => {
    return generateRedirectUrl(banner.bannerType, banner.productId, banner.categoryId);
};
