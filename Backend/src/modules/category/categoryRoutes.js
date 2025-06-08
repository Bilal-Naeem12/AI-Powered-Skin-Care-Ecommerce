const express = require("express");
const ctrl = require("./categoryController");
const val  = require("./categoryValidator");
const { handleValidation } = require("./categoryUtils");
const { authMiddleware } = require("../../middleware/authMiddleware");
const { roleMiddleware } = require("../../middleware/roleMiddleware");

const router = express.Router();
const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1 * 1024 * 1024 }, // optional: 5MB limit
});
// ----- PUBLIC ROUTES -----
router.get("/", ctrl.getCategories);          // GET all categories - NO AUTH
router.get("/:id", ctrl.getCategory);         // GET category by ID - NO AUTH

// ----- ADMIN ROUTES -----
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  val.createRules,
  handleValidation,
  ctrl.createCategory
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  val.updateRules,
  handleValidation,
  ctrl.updateCategory
);
router.post(
  "/:id/image",             // single image route
  upload.single("image"),  
    authMiddleware,
  roleMiddleware("admin"), // "image" = form field name
  ctrl.uploadCategoryImage
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  ctrl.deleteCategory
);

module.exports = router;
