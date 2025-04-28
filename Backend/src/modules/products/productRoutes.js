const express = require("express");
const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    softDeleteProduct,
    restoreProduct,
    addReview,
    getProductReviews,
    reduceStock,
    getFeaturedProducts,uploadImages,getRelatedProductsById
} = require("./productController");

const multer   = require("multer");
const { validateCreateProduct, validateUpdateProduct, validateResult } = require("./productValidator");
const { authMiddleware } = require("../../middleware/authMiddleware");
const validateReviewMiddleware = require("../../middleware/validateReviewMiddleware");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // in-RAM buffer

// **🔹 Featured Products**
router.get("/featured", getFeaturedProducts);  // Get all featured products

// **🔹 Product Routes**
router.post("/create", validateCreateProduct, validateResult, createProduct);  // Create product
router.get("/", getAllProducts);  // Get all products with filters

router.get("/:id", getProductById);  // Get a product by ID
router.put("/:id", validateUpdateProduct, validateResult, updateProduct);  // Update product
router.delete("/:id", softDeleteProduct);  // Soft delete product
router.put("/restore/:id", restoreProduct);  // Restore deleted product
router.get("/:id/related", getRelatedProductsById);  // Get a product by ID
// **🔹 Review Routes**
router.post("/:id/reviews",authMiddleware,validateReviewMiddleware ,addReview);  // Add a review to a product
router.get("/:id/reviews", getProductReviews);  // Get all reviews of a product

// **🔹 Stock Management**
router.post("/:id/reduce-stock", reduceStock);  // Reduce stock when product is purchased



/**
 * POST /api/products/:id/images
 * FormData field:  images  (array of files)
 */
router.post(
    "/:id/images",
    upload.array("images", 10),
    uploadImages
  );
module.exports = router;
