const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).render("index", {
    title: "AI POWERED SKIN CARE ECOMMERCE STORE BACKEND"
  });
});

module.exports = router;
