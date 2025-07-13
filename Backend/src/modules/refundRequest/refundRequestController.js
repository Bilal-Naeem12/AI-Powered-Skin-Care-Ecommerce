const RefundRequest = require("./refundRequestModel");
const Order = require("../orders/orderModel");
const { notify } = require("../notification/notificationService");
const cloud = require("../../utils/cloudinary");
const uuid = require("crypto").randomUUID;



exports.uploadRefundProofImages = async (req, res) => {
  try {
    // 1️⃣ Basic checks
    const order = await Order.findById(req.params.id).lean();
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    if (!req.files?.length) {
      return res.status(400).json({ message: "No files uploaded." });
    }

    // 2️⃣ Cloudinary folder: e.g. myShop/refund-requests/order_abcde
    const folder = `myShop/refund-requests/order_${order._id.toString().slice(-5)}`;

    // 3️⃣ Upload every buffer to Cloudinary
    const uploadedUrls = await Promise.all(
      req.files.map(
        (file) =>
          new Promise((resolve, reject) => {
            cloud.uploader
              .upload_stream(
                {
                  folder,
                  public_id: uuid(),
                  resource_type: "image",
                },
                (err, result) => {
                  if (err) return reject(err);
                  resolve(result.secure_url);
                }
              )
              .end(file.buffer);
          })
      )
    );

    // 4️⃣ Return uploaded URLs
    res.status(201).json({
      message: `${uploadedUrls.length} refund proof image(s) uploaded.`,
      images: uploadedUrls,
    });
  } catch (err) {
    console.error("uploadRefundProofImages:", err);
    res.status(500).json({ error: "Server error uploading refund proof images." });
  }
};
// CUSTOMER: Create refund request
exports.createRefundRequest = async (req, res, next) => {
  try {
    const { id: orderId } = req.params;
    const { reason, details ,username} = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found." });

    if (order.refundRequest) {
      return res.status(400).json({ message: "Refund request already submitted for this order." });
    }

    // Get uploaded file URLs from Cloudinary via Multer
const uploadedImageUrls = req.body.images || [];
  const refund = await RefundRequest.create({
  orderId,
  userId: req.user._id,
  reason,
  details,
  images: uploadedImageUrls,
});

    // Flag Order
    order.refundRequest = true;
    await order.save();
console.log(username)
    // Notify Admin
    await notify({
      kind: "MANAGEMENT_REFUND_REQUEST",
      title: `Refund requested for Order #${order.orderNumber}`,
      body: `${(username)  || "A customer"} requested a refund.`,
      role: "admin",
      data: { orderId, refundRequestId: refund._id },
    });

    res.status(201).json({ message: "Refund request submitted.", refund });
  } catch (err) {
    next(err);
  }
};

// ADMIN: Approve/Reject request
exports.reviewRefundRequest = async (req, res, next) => {
  try {
    const { id } = req.params; // Refund request ID
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const refund = await RefundRequest.findById(id).populate("orderId");
    if (!refund) return res.status(404).json({ message: "Refund request not found." });

    refund.status = status;
    refund.reviewedBy = req.user._id;
    refund.reviewedAt = new Date();
    await refund.save();

    if (status === "Approved") {
      const order = await Order.findById(refund.orderId._id);
      order.statusHistory.unshift({
        what: "Refunded",
        updatedBy: req.user._id,
      });
      await order.save();
    }

    await notify({
      kind: "ORDER_STATUS",
      title: `Refund request ${status}`,
      body: `Your refund request for Order #${refund.orderId.orderNumber} has been ${status.toLowerCase()}.`,
      userId: refund.userId,
      data: { orderId: refund.orderId._id, refundRequestId: refund._id },
    });

    res.json({ message: `Refund request ${status.toLowerCase()}.` });
  } catch (err) {
    next(err);
  }
};

// ADMIN: Get all refund requests
exports.getAllRefundRequests = async (req, res, next) => {
  try {
    const refunds = await RefundRequest.find()
      .populate("orderId userId")
      .sort({ createdAt: -1 });
    res.json(refunds);
  } catch (err) {
    next(err);
  }
};


exports.getUserRefundRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const refundRequests = await RefundRequest.find({ userId })
      .populate("orderId", "orderNumber totalAmount placedAt statusHistory")
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(refundRequests);
  } catch (err) {
    console.error("❌ Error fetching user's refund requests:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


// controllers/refundRequestController.js
exports.getRefundRequestById = async (req, res) => {
  try {
    const request = await RefundRequest.findById(req.params.id)
      .populate("orderId") // ✅ Populates full order object
      .lean();

    if (!request || request.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Refund request not found" });
    }

    res.json(request);
  } catch (err) {
    console.error("Error fetching refund request:", err);
    res.status(500).json({ message: "Server error" });
  }
};
