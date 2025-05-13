const reviewModel = require("../review/reviewModel");
const Product = require("./productModel");
const mongoose = require('mongoose');
const productModel = require("./productModel");
const uuid     = require("crypto").randomUUID;
const cloud    = require("../../utils/cloudinary");
function extractPublicIdFromUrl(url) {
  const parts = url.split("/upload/")[1].split("/");
  // parts[0] is "v1611111111", the version – drop it
  parts.shift();
  // re-join the rest and strip off the extension
  const fullPath = parts.join("/");
  return fullPath.replace(/\.[a-zA-Z0-9]+$/, "");
}
const User = require("../users/userModel")

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
    let {
      category,
      brand,
      minPrice,
      maxPrice,
      skinType,
      availability,
      sort,
      page,
      limit,
      name, // <-- search term
    } = req.query;

    let filter = { isDeleted: false };

    if (category) filter.category = category;
    if (brand) filter.brand = brand;

    if (minPrice || maxPrice) {
      filter.price = {
        ...(minPrice && { $gte: Number(minPrice) }),
        ...(maxPrice && { $lte: Number(maxPrice) }),
      };
    }

    if (availability === "in") filter.isAvailable = true;
    if (availability === "out") filter.isAvailable = false;

    if (skinType) {
      filter.aiSkinSuitability = { $in: skinType.split(",") };
    }

    // 🔍 Search by name (case-insensitive partial match)
    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    const sortOptions = sort
      ? { price: sort === "asc" ? 1 : sort === "desc" ? -1 : -1 }
      : { createdAt: -1 };

    const pageNum = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;

    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize);

    const totalCount = await Product.countDocuments(filter);

    res.status(200).json({
      products,
      page: pageNum,
      limit: pageSize,
      totalCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


// **🔹 Get Single Product by ID**
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product || product.isDeleted) return res.status(404).json({ message: "Product not found" });


    res.status(200).json( product );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// src/modules/products/productController.js

exports.getRelatedProductsById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();

    if (!product || product.isDeleted)
      return res.status(404).json({ message: "Product not found" });

    // Ensure category is in ObjectId format
    const categoryId = new mongoose.Types.ObjectId(product.category._id || product.category);

    const relatedProducts = await Product.aggregate([
      {
        $match: {
          _id: { $ne: product._id },
          category: categoryId,
          isDeleted: false
        }
      },
      { $sample: { size: 4 } }
    ]);

    res.status(200).json({ relatedProducts });
  } catch (error) {
    console.error("Error fetching related products:", error);
    res.status(500).json({ error: error.message });
  }
};
// **🔹 Update a Product**
exports.updateProduct = async (req, res) => {
  try {
    // ── 1) parse JSON payload ─────────────────────────────
    let updateData = {};
    if (typeof req.body.data === "string") {
      updateData = JSON.parse(req.body.data);
    } else {
      updateData = req.body.data || req.body;
    }

    // ── 2) parse removedUrls ───────────────────────────────
    let removed = [];
    if (req.body.removedUrls) {
      if (typeof req.body.removedUrls === "string") {
        removed = JSON.parse(req.body.removedUrls);
      } else if (Array.isArray(req.body.removedUrls)) {
        removed = req.body.removedUrls;
      }
    }
    console.log("Removing URLs:", removed);

    // ── 3) load product ────────────────────────────────────
    const product = await Product.findById(req.params.id);
    if (!product || product.isDeleted) {
      return res.status(404).json({ message: "Not found" });
    }

    // ── 4) remove flagged URLs from Cloudinary + from product.images ──
    for (let url of removed) {
      const publicId = extractPublicIdFromUrl(url);
      try {
        await cloud.uploader.destroy(publicId);
      } catch (e) {
        console.warn("Could not destroy", publicId, e);
      }
      product.images = product.images.filter(u => u !== url);
    }

    if (Array.isArray(updateData.images)) {
      product.images = updateData.images;
    }
    product.set(updateData);
    // ── 5) upload any new files ────────────────────────────
    if (req.files && req.files.length) {
      const uploaded = await Promise.all(
        req.files.map(file =>
          new Promise((resolve, reject) => {
            const stream = cloud.uploader.upload_stream(
              { folder: "myShop/products", public_id: uuid() },
              (err, result) => err ? reject(err) : resolve(result.secure_url)
            );
            stream.end(file.buffer);
          })
        )
      );
      console.log("Newly uploaded URLs:", uploaded);
      product.images.push(...uploaded);
    }

    // ── 6) respect the client-sent order in updateData.images ───
  

    // ── 8) recalc discount if needed ──────────────────────
    if (product.discount?.percentage != null) {
      const p = product.price;
      const pct = product.discount.percentage;
      product.discount.discountedPrice = +(p - (p*pct)/100).toFixed(2);
    }

    product.updatedAt = new Date();
    await product.save();

    res.json({ message: "Updated", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
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
   
        const featuredProducts = await productModel.find({ isFeatured: true, isDeleted: false }).limit(5);
        res.status(200).json(featuredProducts);
    } catch (error) {
      console.error(error)
        res.status(500).json({ error: error.message });
    }
};


exports.uploadImages =    async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product || product.isDeleted)
      return res.status(404).json({ message: "Product not found." });

    if (!req.files?.length)
      return res.status(400).json({ message: "No files uploaded." });

    // Correct async stream upload with Promise
    const uploadedUrls = await Promise.all(
      req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const stream = cloud.uploader.upload_stream(
            {
              folder: "myShop/products",
              public_id: uuid(),    // generate unique id
              resource_type: "image",
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result.secure_url); // ✅ resolve the URL
            }
          );
          stream.end(file.buffer); // push file buffer into upload stream
        });
      })
    );

    // Add URLs to images array
    product.images.push(...uploadedUrls);
    product.updatedAt = new Date();
    await product.save();

    res.status(201).json({
      message: `${uploadedUrls.length} image(s) uploaded.`,
      images: uploadedUrls,
    });

  } catch (e) {
    console.error("Image upload error:", e);
    res.status(500).json({ error: "Server error uploading images." });
  }
}

exports.recommendProducts = async (req, res) => {
  try {
    const { detections, classifications } = req.body;
  
    const userId = req.user.id; // requires authMiddleware
    const user = await User.findById(userId);

    const rawSkinType = classifications?.skin_type?.label || "";
const skinType = rawSkinType.charAt(0).toUpperCase() + rawSkinType.slice(1);
    const acneDetected = detections?.acne?.bbox?.length > 0;
    const puffyEyesDetected = detections?.puffy_eyes?.bbox?.length > 0;
    const skinProblemTags = [];

    if (acneDetected) skinProblemTags.push("Acne");
    if (puffyEyesDetected) skinProblemTags.push("Dark Circles");
    console.log(skinProblemTags)
    const excludedIngredients = user.allergenPreferences || [];
    console.log(excludedIngredients)
    const filters = {
      isDeleted: false,
      isAvailable: true,
  
      $or: [
        // 1. Products explicitly matching the skin problem
        { skinProblem: { $in: skinProblemTags } },
    
        // 2. Products matching skin type BUT with no specific skinProblem set
        {
          $and: [
            { aiSkinSuitability: { $in: [skinType] } },
            { $or: [{ skinProblem: null }, { skinProblem: "" }] }
          ]
        }
      ]
    };
    // Get all matching products
    const potentialProducts = await Product.find(filters);




   
const allergenRegexes = excludedIngredients.map((allergen) =>
  new RegExp(allergen, "i") // i = case-insensitive
);

const allProducts = potentialProducts.filter((product) =>
  !product.ingredients?.some((ing) =>
    allergenRegexes.some((regex) => regex.test(ing))
  )
);

    // Organize by routine step
    const routine = {
      step1: {
        title: "Cleanse Your Skin",
        category: "Cleanser",
        products: allProducts.filter(p => p.category.name.name === "Cleanser"),
      },
      step2: {
        title: "Apply Treatment Gel",
        category: "Gel",
        products: allProducts.filter(p => p.category.name === "Gel"),
      },
      step3: {
        title: "Use a Targeted Serum",
        category: "Serum",
        products: allProducts.filter(p => p.category.name === "Serum"),
      },
      step4: {
        title: "Seal with Cream",
        category: "Cream",
        products: allProducts.filter(p => p.category.name === "Cream"),
      },
    };
    

    res.json({
      success: true,
      skinType,
      problemsDetected: skinProblemTags,
      routine,
    });
  } catch (err) {
    console.error("🔴 Recommendation error:", err);
    res.status(500).json({ success: false, message: "Recommendation failed" });
  }
};