const service = require("./categoryService");
const categoryModel = require("./categoryModel")
const cloud = require("../../utils/cloudinary"); // cloudinary config
const { v4: uuid } = require("uuid");

exports.createCategory = async (req, res) => {
  try {
    const cat = await service.create(req.body);
    res.status(201).json(cat);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const hasPaging = "page" in req.query || "limit" in req.query;

    const page  = Math.max(parseInt(req.query.page  || "1", 10), 1);
    const limit = Math.max(parseInt(req.query.limit || "15", 10), 1);

    const search = (req.query.name || "").trim();

    // 👇 Basic filter
    const filter = {};

    if (search) {
      filter.name = new RegExp(search, "i");
    }

    // 👇 Only add deletion filter for non-admins
    if (!req.user?.role || req.user.role !== "admin") {
      filter.isDeleted = false;
    }

    // 👉 Without pagination
    if (!hasPaging) {
      const categories = await service.find(filter);
      return res.json(categories);
    }

    // 👉 With pagination
    const [categories, totalCount] = await Promise.all([
      service.find(filter, page, limit),
      service.count(filter),
    ]);

    res.json({ categories, totalCount, page, limit });
  } catch (err) {
    next(err);
  }
};

exports.getCategory = async (req, res) => {
  const cat = await service.getById(req.params.id);
  if (!cat) return res.status(404).json({ message: "Not found" });
  res.json(cat);
};

exports.updateCategory = async (req, res) => {
  try {
    const cat = await service.update(req.params.id, req.body);
    if (!cat) return res.status(404).json({ message: "Not found" });
    res.json(cat);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.deleteCategory = async (req, res) => {
  const cat = await service.softDelete(req.params.id);
  if (!cat) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted" });
};


exports.uploadCategoryImage = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id);
    if (!category || category.isDeleted)
      return res.status(404).json({ message: "Category not found." });

    if (!req.file)
      return res.status(400).json({ message: "No file uploaded." });

    // Upload image to Cloudinary
    const uploadedUrl = await new Promise((resolve, reject) => {
      const stream = cloud.uploader.upload_stream(
        {
          folder: "myShop/categories",
          public_id: uuid(),
          resource_type: "image",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );
      stream.end(req.file.buffer);
    });

    // Save image to category
    category.image = uploadedUrl;
    category.updatedAt = new Date();
    await category.save();

    res.status(201).json({
      message: "Image uploaded successfully.",
      image: uploadedUrl,
    });

  } catch (err) {
    console.error("Upload category image error:", err);
    res.status(500).json({ error: "Server error uploading image." });
  }
};


// controllers/categoryController.js
exports.uploadCategoryBanner = async (req, res) => {
  try {
    const cat = await categoryModel.findById(req.params.id);
    if (!cat || cat.isDeleted)
      return res.status(404).json({ message: "Category not found." });

    if (!req.file)
      return res.status(400).json({ message: "No file uploaded." });

    /* ---------- upload to Cloudinary ---------- */
    const bannerUrl = await new Promise((resolve, reject) => {
      cloud.uploader.upload_stream(
        {
          folder: "myShop/category-banners",
          public_id: uuid(),
          resource_type: "image",
        },
        (err, result) => {
          if (err) return reject(err);
          resolve(result.secure_url);
        }
      ).end(req.file.buffer);
    });

    cat.bannerUrl = bannerUrl;
    await cat.save();

    res.status(201).json({ message: "Banner uploaded", bannerUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload banner" });
  }
};
