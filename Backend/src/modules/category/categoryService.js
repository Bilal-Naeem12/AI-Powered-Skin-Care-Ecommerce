const Category = require("./categoryModel");

exports.create = (payload) => Category.create(payload);

exports.getAll = (filter = {}) =>
  Category.find({ isDeleted: false, ...filter }).sort({ name: 1 });

exports.getById = (id) => Category.findOne({ _id: id, isDeleted: false });

exports.update = (id, data) =>
  Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });

exports.softDelete = (id) =>
  Category.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
