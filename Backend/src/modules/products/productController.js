const Product = require("./productModel");

// **🔹 Create a New Product**
exports.createProduct = async (req, res) => {
    try {
        const productData = req.body;

        // Ensure discount is applied correctly
        if (productData.discount && productData.discount.percentage) {
            productData.discount.discountedPrice = productData.price - (productData.price * productData.discount.percentage) / 100;
        }

        const newProduct = await Product.create(productData);
        res.status(201).json({ message: "Product created successfully", product: newProduct });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// **🔹 Get All Products with Filtering & Pagination**
exports.getAllProducts = async (req, res) => {
    try {
        let { category, brand, minPrice, maxPrice, sort, page, limit } = req.query;
        let filter = { isDeleted: false };

        if (category) filter.category = category;
        if (brand) filter.brand = brand;
        if (minPrice || maxPrice) filter.price = { ...(minPrice && { $gte: minPrice }), ...(maxPrice && { $lte: maxPrice }) };

        const sortOptions = sort ? { price: sort === "asc" ? 1 : -1 } : { createdAt: -1 };
        const pageNum = parseInt(page) || 1;
        const pageSize = parseInt(limit) || 10;

        const products = await Product.find(filter)
            .sort(sortOptions)
            .skip((pageNum - 1) * pageSize)
            .limit(pageSize);

        res.status(200).json({ products, page: pageNum, limit: pageSize });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// **🔹 Get Single Product by ID**
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product || product.isDeleted) return res.status(404).json({ message: "Product not found" });

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// **🔹 Update a Product**
exports.updateProduct = async (req, res) => {
    try {
        const updateData = req.body;
        if (updateData.discount?.percentage) {
            updateData.discount.discountedPrice = updateData.price - (updateData.price * updateData.discount.percentage) / 100;
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

        res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// **🔹 Soft Delete a Product**
exports.softDeleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product || product.isDeleted) return res.status(404).json({ message: "Product not found" });

        product.isDeleted = true;
        await product.save();

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// **🔹 Restore a Soft-Deleted Product**
exports.restoreProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product || !product.isDeleted) return res.status(404).json({ message: "Product not found or not deleted" });

        product.isDeleted = false;
        await product.save();

        res.status(200).json({ message: "Product restored successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// **🔹 Add Review to Product**
exports.addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product || product.isDeleted) return res.status(404).json({ message: "Product not found" });

        product.reviews.push({ userId: req.user.userId, rating, comment });
        product.averageRating =
            product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length;

        await product.save();
        res.status(200).json({ message: "Review added successfully", product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// **🔹 Get All Reviews of a Product**
exports.getProductReviews = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product || product.isDeleted) return res.status(404).json({ message: "Product not found" });

        res.status(200).json(product.reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// **🔹 Reduce Stock on Order Placement**
exports.reduceStock = async (productId, quantity) => {
    const product = await Product.findById(productId);
    if (!product || product.isDeleted) throw new Error("Product not found");

    if (product.stock < quantity) throw new Error("Insufficient stock");

    product.stock -= quantity;
    await product.save();
};

// **🔹 Get Featured Products**
exports.getFeaturedProducts = async (req, res) => {
    try {
        const featuredProducts = await Product.find({ isFeatured: true, isDeleted: false }).limit(10);
        res.status(200).json(featuredProducts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
