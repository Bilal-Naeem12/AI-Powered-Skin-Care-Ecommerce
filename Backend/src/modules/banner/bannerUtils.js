// **🔹 Check if the banner is active based on start and end dates**
exports.isActiveBanner = (startDate, endDate) => {
    const currentDate = new Date();
    return currentDate >= startDate && currentDate <= endDate;
};

// **🔹 Generate a redirect URL for the banner**
exports.generateRedirectUrl = (bannerType, productId, categoryId) => {
    switch (bannerType) {
        case "Homepage":
            return `/homepage`;
        case "Category":
            return `/category/${categoryId}`;
        case "Flash Sale":
            return `/flash-sale`;
        case "Seasonal Offer":
            return `/seasonal-offer`;
        default:
            return `/`;
    }
};
