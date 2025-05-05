const service = require("./categoryService");

exports.createCategory = async (req, res) => {
  try {
    const cat = await service.create(req.body);
    res.status(201).json(cat);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.getCategories = async (req, res) => {
  const cats = await service.getAll();
  res.json(cats);
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
