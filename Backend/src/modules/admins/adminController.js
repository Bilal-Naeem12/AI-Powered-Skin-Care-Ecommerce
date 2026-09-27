const { sendError } = require("../../middleware/errorHandler");
const AdminService = require("./adminService");

// **🔹 Create Admin**
exports.createAdmin = async (req, res) => {
    try {
        const adminData = req.body;
        const newAdmin = await AdminService.createAdmin(adminData);
        res.status(201).json({ message: "Admin created successfully", admin: newAdmin });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// **🔹 Get All Admins**
exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await AdminService.getAllAdmins();
        res.status(200).json({ admins });
    } catch (error) {
        sendError(res, error);
    }
};

// **🔹 Get Admin by ID**
exports.getAdminById = async (req, res) => {
    try {
        const adminId = req.params.id;
        const admin = await AdminService.getAdminById(adminId);
        if (!admin) return res.status(404).json({ message: "Admin not found" });
        res.status(200).json(admin);
    } catch (error) {
        sendError(res, error);
    }
};

// **🔹 Update Admin**
exports.updateAdmin = async (req, res) => {
    try {
        const adminId = req.params.id;
        const updateData = req.body;
        const updatedAdmin = await AdminService.updateAdmin(adminId, updateData);
        res.status(200).json({ message: "Admin updated successfully", admin: updatedAdmin });
    } catch (error) {
        sendError(res, error);
    }
};

// **🔹 Delete Admin (Soft Delete)**
exports.deleteAdmin = async (req, res) => {
    try {
        const adminId = req.params.id;
        const deletedAdmin = await AdminService.deleteAdmin(adminId);
        res.status(200).json({ message: "Admin deleted successfully", admin: deletedAdmin });
    } catch (error) {
        sendError(res, error);
    }
};

// **🔹 Manage Users**
exports.manageUsers = async (req, res) => {
    try {
        const { action, userId } = req.body;
        await AdminService.manageUsers(action, userId);
        res.status(200).json({ message: `User ${action}d successfully` });
    } catch (error) {
        sendError(res, error);
    }
};

// **🔹 Manage Products**
exports.manageProducts = async (req, res) => {
    try {
        const { action, productId, productData } = req.body;
        const product = await AdminService.manageProducts(action, productId, productData);
        res.status(200).json({ message: `Product ${action}d successfully`, product });
    } catch (error) {
        sendError(res, error);
    }
};

// **🔹 Manage Orders**
exports.manageOrders = async (req, res) => {
    try {
        const { action, orderId, orderData } = req.body;
        const updatedOrder = await AdminService.manageOrders(action, orderId, orderData);
        res.status(200).json({ message: `Order ${action}d successfully`, order: updatedOrder });
    } catch (error) {
        sendError(res, error);
    }
};
