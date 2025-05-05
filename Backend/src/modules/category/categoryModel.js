const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    /* — basic data — */
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      maxlength: 40,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 200,
    },

    /* — NEW —  hero / thumbnail image  */
    imageUrl: {
      type: String,          // full https://… URL  (or relative path)
      default: null,
      trim: true,
    },

    /* — soft‑delete flag — */
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
