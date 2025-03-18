const express = require("express");
const {
    createAdmin,
    getAllAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin,
    manageUsers,
    manageProducts,
    manageOrders
} = require("./adminController");

const router = express.Router();

// **🔹 Route to Create Admin**
router.post("/create", createAdmin);  // Create an admin account

// **🔹 Route to Get All Admins**
router.get("/", getAllAdmins);  // Get a list of all admins

// **🔹 Route to Get Admin by ID**
router.get("/:id", getAdminById);  // Get admin details by ID

// **🔹 Route to Update Admin**
router.put("/:id", updateAdmin);  // Update an admin's information

// **🔹 Route to Delete Admin (Soft Delete)**
router.delete("/:id", deleteAdmin);  // Soft delete an admin account

// **🔹 Route to Manage Users (Delete, etc.)**
router.post("/manage-users", manageUsers);  // Manage (delete, update) users

// **🔹 Route to Manage Products (Add, Update, Delete)**
router.post("/manage-products", manageProducts);  // Manage products

// **🔹 Route to Manage Orders (Update, Cancel)**
router.post("/manage-orders", manageOrders);  // Manage orders

module.exports = router;
