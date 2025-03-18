const slugify = require("slugify");

// **🔹 Generate Slug from Product Name**
exports.generateSlug = (name) => {
    return slugify(name, { lower: true, replacement: "-" });
};

// **🔹 Calculate Discounted Price**
exports.calculateDiscount = (price, discountPercentage) => {
    if (discountPercentage > 0) {
        return price - (price * discountPercentage) / 100;
    }
    return price; // Return original price if no discount
};

// **🔹 Format Product Data**
exports.formatProductData = (product) => {
    return {
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        discount: product.discount,
        stock: product.stock,
        isAvailable: product.isAvailable,
        variants: product.variants,
        images: product.images,
        averageRating: product.averageRating,
        reviewsCount: product.reviews.length,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
    };
};

// **🔹 Process Product Images (Basic Validation for URLs)**
exports.processProductImages = (images) => {
    if (!images || images.length === 0) {
        throw new Error("Product must have at least one image.");
    }

    // Example: Basic image validation, can be extended
    return images.map(image => image.startsWith("http") ? image : `https://example.com/${image}`);
};

// **🔹 Update Product Stock after Purchase**
exports.updateStockAfterPurchase = (stock, quantity) => {
    if (stock - quantity < 0) {
        throw new Error("Not enough stock.");
    }
    return stock - quantity;  // Returns the updated stock value after purchase
};
