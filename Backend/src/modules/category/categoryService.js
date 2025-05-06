const Category = require("./categoryModel");

/**
 * Generic “list” with pagination
 * @param {Object} filter  mongoose filter object
 * @param {Number} page
 * @param {Number} limit
 */
exports.find = (filter = {}, page = 1, limit = 15) => {
  const skip = (page - 1) * limit;
  return Category.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();                 // → plain JS objects
};

exports.count = (filter = {}) => Category.countDocuments(filter);

/* optional helpers used elsewhere ---------------------------------- */
exports.getById = (id) => Category.findById(id);
exports.create  = (payload) => Category.create(payload);
exports.update  = (id, payload) =>
  Category.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
exports.softDelete = (id) =>
  Category.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
