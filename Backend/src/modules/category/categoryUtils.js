// categoryUtils.js   (or reuse a global helper)
exports.handleValidation = (req, res, next) => {
    const { validationResult } = require("express-validator");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  };
  