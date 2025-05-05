const express = require("express");
const ctrl = require("./categoryController");
const val  = require("./categoryValidator");
const { handleValidation } = require("./categoryUtils");
const { authMiddleware } = require("../../middleware/authMiddleware");
const { roleMiddleware } = require("../../middleware/roleMiddleware");

const router = express.Router();

// admin‑only
router.use(authMiddleware, roleMiddleware("admin"));

router
  .route("/")
  .post(val.createRules, handleValidation, ctrl.createCategory)
  .get(ctrl.getCategories);

router
  .route("/:id")
  .get(ctrl.getCategory)
  .put(val.updateRules, handleValidation, ctrl.updateCategory)
  .delete(ctrl.deleteCategory);

module.exports = router;
