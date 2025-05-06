const service = require("./categoryService");

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
    /* ---------- query parsing -------------------------------------- */
    const hasPaging = "page" in req.query || "limit" in req.query;

    const page  = Math.max(parseInt(req.query.page  || "1", 10), 1);
    const limit = Math.max(parseInt(req.query.limit || "15", 10), 1);

    const search = (req.query.name || "").trim();

    /* ---------- filter --------------------------------------------- */
    const filter = {};
    if (search) filter.name = new RegExp(search, "i");

    /* ---------- fetch ---------------------------------------------- */
    if (!hasPaging) {
      // 👉  NO pagination → return plain array
      const categories = await service.find(filter);   // full list
      return res.json(categories);
    }

    // 👉  WITH pagination
    const [categories, totalCount] = await Promise.all([
      service.find(filter, page, limit),               // paginated
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
