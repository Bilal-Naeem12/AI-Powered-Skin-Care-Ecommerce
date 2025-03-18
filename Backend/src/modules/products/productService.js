const Product = require("./productModel");

// **🔹 Create a New Product**
exports.createProduct = async (productData) => {
    // Ensure discount is applied correctly
    if (productData.discount && productData.discount.percentage) {
        productData.discount.discountedPrice = productData.price - (productData.price * productData.discount.percentage) / 100;
    }

    return await Product.create(productData);
};

// **🔹 Get All Products with Filtering & Pagination**
exports.getAllProducts = async ({ category, brand, minPrice, maxPrice, sort, page, limit }) => {
    let filter = { isDeleted: false };

    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (minPrice || maxPrice) filter.price = { ...(minPrice && { $gte: minPrice }), ...(maxPrice && { $lte: maxPrice }) };

    const sortOptions = sort ? { price: sort === "asc" ? 1 : -1 } : { createdAt: -1 };
    const pageNum = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;

    return await Product.find(filter)
        .sort(sortOptions)
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize);
};

// **🔹 Get Single Product by ID**
exports.getProductById = async (productId) => {
    return await Product.findById(productId).where("isDeleted").equals(false);
};

// **🔹 Update a Product**
exports.updateProduct = async (productId, updateData) => {
    if (updateData.discount?.percentage) {
        updateData.discount.discountedPrice = updateData.price - (updateData.price * updateData.discount.percentage) / 100;
    }

    return await Product.findByIdAndUpdate(productId, updateData, { new: true });
};

// **🔹 Soft Delete a Product**
exports.softDeleteProduct = async (productId) => {
    return await Product.findByIdAndUpdate(productId, { isDeleted: true }, { new: true });
};

// **🔹 Restore a Soft-Deleted Product**
exports.restoreProduct = async (productId) => {
    return await Product.findByIdAndUpdate(productId, { isDeleted: false }, { new: true });
};

// **🔹 Add Review to Product**
exports.addReview = async (productId, userId, rating, comment) => {
    const product = await Product.findById(productId);
    if (!product || product.isDeleted) throw new Error("Product not found");

    product.reviews.push({ userId, rating, comment });
    product.averageRating =
        product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length;

    return await product.save();
};

// **🔹 Get All Reviews of a Product**
exports.getProductReviews = async (productId) => {
    const product = await Product.findById(productId);
    if (!product || product.isDeleted) throw new Error("Product not found");

    return product.reviews;
};

// **🔹 Reduce Stock on Order Placement**
exports.reduceStock = async (productId, quantity) => {
    const product = await Product.findById(productId);
    if (!product || product.isDeleted) throw new Error("Product not found");

    if (product.stock < quantity) throw new Error("Insufficient stock");

    product.stock -= quantity;
    return await product.save();
};

// **🔹 Get Featured Products**
exports.getFeaturedProducts = async () => {
    return await Product.find({ isFeatured: true, isDeleted: false }).limit(10);
};
