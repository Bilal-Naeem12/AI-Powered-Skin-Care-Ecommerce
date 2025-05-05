const { body, param } = require("express-validator");

exports.createRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("description").optional().isString().isLength({ max: 200 }),
];

exports.updateRules = [
  param("id").isMongoId(),
  body("name").optional().trim().notEmpty(),
  body("description").optional().isString().isLength({ max: 200 }),
];
