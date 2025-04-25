const reviewModel = require("../review/reviewModel");
const Product = require("./productModel");
const mongoose = require('mongoose');

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
    const session = await mongoose.startSession();
    try {
      const { id: productId } = req.params;
      const { rating, reviewText = "", reviewImages = [], pros = [], cons = [] } = req.body;
      const userId = req.user._id;              // set by auth middleware
  
      /* 1️⃣  verify product exists / not deleted */
      console.log(productId)
      const product = await Product.findOne({ _id: productId, isDeleted: false })
        .session(session);
      if (!product) return res.status(404).json({ message: "Product not found." });
  
      /* 2️⃣  prevent duplicate review */
      const already = await reviewModel.exists({ productId, userId }).session(session);
      if (already)
        return res
          .status(409)
          .json({ message: "You have already reviewed this product." });
  
      /* 3️⃣  transaction */
      await session.withTransaction(async () => {
        /* 3a. create review */
        await reviewModel.create(
          [
            {
              productId,
              userId,
              rating,
              reviewText,
              reviewImages,
              pros,
              cons,
              isVerifiedPurchase: true,       // if you checked an order
            },
          ],
          { session }
        );
  
        /* 3b. update aggregate fields */
        const incObj = {
          reviewCount: 1,
          [`ratingBuckets.${rating}`]: 1,
        };
        await Product.updateOne({ _id: productId }, { $inc: incObj }, { session });
  
        /* 3c. recalc averageRating in O(1) */
        const p = await Product.findById(productId).session(session);
        const total =
          p.ratingBuckets[1] * 1 +
          p.ratingBuckets[2] * 2 +
          p.ratingBuckets[3] * 3 +
          p.ratingBuckets[4] * 4 +
          p.ratingBuckets[5] * 5;
        p.averageRating = total / p.reviewCount;
        await p.save({ session });
      });
  
      res.status(201).json({ message: "Review submitted (pending approval)." });
    } catch (err) {
      console.error("addReview:", err);
      res.status(500).json({ error: "Server error." });
    } finally {
      session.endSession();
    }
  };

// **🔹 Get All Reviews of a Product**
// 🔹 GET /api/products/:id/reviews
exports.getProductReviews = async (req, res) => {
    try {
      const { id } = req.params;
  
      /* 1️⃣  make sure the product exists (and isn’t soft-deleted) */
      const productExists = await Product.exists({ _id: id, isDeleted: false });
      if (!productExists) {
        return res.status(404).json({ message: "Product not found." });
      }
  
      /* 2️⃣  fetch reviews from the Review collection */
      const reviews = await reviewModel
      .find({
        productId: id,
        status: "Approved",
        isDeleted: false,
      })
      .sort({ createdAt: -1 })
      .populate({
        path: "userId",
        select: "first_name last_name profileImage", // Only get what you need
      })
      .lean();
      /* 3️⃣  send them back */
      res.status(200).json(reviews);
    } catch (err) {
      console.error("getProductReviews:", err);
      res.status(500).json({ error: "Server error." });
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
