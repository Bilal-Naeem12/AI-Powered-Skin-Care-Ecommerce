const Admin = require("./adminModel");
const UserService = require("../users/userService");
const ProductService = require("../products/productService");
const OrderService = require("../orders/orderService");

// **🔹 Create a New Admin**
exports.createAdmin = async (adminData) => {
    const { email } = adminData;
    // Check if the admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) throw new Error("Admin with this email already exists");

    const newAdmin = new Admin(adminData);
    await newAdmin.save();
    return newAdmin;
};

// **🔹 Get All Admins**
exports.getAllAdmins = async () => {
    return await Admin.find({ isDeleted: false }).select("-password");  // Exclude password from the response
};

// **🔹 Get Admin by ID**
exports.getAdminById = async (adminId) => {
    return await Admin.findById(adminId);
};

// **🔹 Update Admin Data**
exports.updateAdmin = async (adminId, updateData) => {
    const updatedAdmin = await Admin.findByIdAndUpdate(adminId, updateData, { new: true });
    if (!updatedAdmin) throw new Error("Admin not found");
    return updatedAdmin;
};

// **🔹 Delete (Soft) Admin Account**
exports.deleteAdmin = async (adminId) => {
    const admin = await Admin.findById(adminId);
    if (!admin) throw new Error("Admin not found");
    
    admin.isDeleted = true;
    await admin.save();
    return admin;
};

// **🔹 Manage Users**
exports.manageUsers = async (action, userId) => {
    const user = await UserService.getUserById(userId);
    if (!user) throw new Error("User not found");

    switch (action) {
        case "delete":
            await UserService.deleteUser(userId);  // Delete user via userService
            break;
        // Add other actions like update, ban, etc.
        default:
            throw new Error("Invalid action for user management");
    }
};

// **🔹 Manage Products**
exports.manageProducts = async (action, productId, productData) => {
    switch (action) {
        case "create":
            return await ProductService.createProduct(productData);
        case "update":
            return await ProductService.updateProduct(productId, productData);
        case "delete":
            return await ProductService.deleteProduct(productId);  // Soft delete
        default:
            throw new Error("Invalid action for product management");
    }
};

// **🔹 Manage Orders**
exports.manageOrders = async (action, orderId, orderData) => {
    const order = await OrderService.getOrderById(orderId);
    if (!order) throw new Error("Order not found");

    switch (action) {
        case "update":
            return await OrderService.updateOrderStatus(orderId, orderData.status);
        case "cancel":
            return await OrderService.cancelOrder(orderId, orderData.reason);
        default:
            throw new Error("Invalid action for order management");
    }
};

// **🔹 Admin Activity Logging**
exports.logAdminActivity = async (adminId, action, details) => {
    const admin = await Admin.findById(adminId);
    if (!admin) throw new Error("Admin not found");

    await admin.logActivity(action, details);
};
