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
    getFeaturedProducts
} = require("./productController");

const { validateCreateProduct, validateUpdateProduct, validateResult } = require("./productValidator");

const router = express.Router();

// **🔹 Product Routes**
router.post("/create", validateCreateProduct, validateResult, createProduct);  // Create product
router.get("/", getAllProducts);  // Get all products with filters
router.get("/:id", getProductById);  // Get a product by ID
router.put("/:id", validateUpdateProduct, validateResult, updateProduct);  // Update product
router.delete("/:id", softDeleteProduct);  // Soft delete product
router.put("/restore/:id", restoreProduct);  // Restore deleted product

// **🔹 Review Routes**
router.post("/:id/reviews", addReview);  // Add a review to a product
router.get("/:id/reviews", getProductReviews);  // Get all reviews of a product

// **🔹 Stock Management**
router.post("/:id/reduce-stock", reduceStock);  // Reduce stock when product is purchased

// **🔹 Featured Products**
router.get("/featured", getFeaturedProducts);  // Get all featured products

module.exports = router;
