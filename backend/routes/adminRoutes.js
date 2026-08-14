const router = require("express").Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// Admin authorization middleware
async function requireAdmin(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: "Authorization check failed" });
  }
}

// 1. Dashboard Statistics
router.get("/stats", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const productCount = await Product.countDocuments();
    const userCount = await User.countDocuments();
    
    const activeRentals = await Order.countDocuments({
      status: { $in: ["pending", "kyc_verified", "out_for_delivery"] }
    });

    const orders = await Order.find({ status: { $ne: "cancelled" } });
    const totalRevenue = orders.reduce((sum, ord) => sum + (ord.total || 0), 0);

    res.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        activeRentals,
        productCount,
        userCount
      }
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({ message: error.message });
  }
});

// 2. Get all customer orders
router.get("/orders", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. Update order status (triggers live customer timeline update)
router.put("/orders/:id/status", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "kyc_verified", "out_for_delivery", "delivered", "cancelled"];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status: " + status });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("user", "name email");

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order status updated to " + status, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 4. Create new product
router.post("/products", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { name, category, price, roomSize, image, description, material, color, rating } = req.body;

    if (!name || !category || !price || !image || !description) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    const product = await Product.create({
      name,
      category: category.toLowerCase(),
      price: Number(price),
      roomSize: roomSize || "medium",
      image,
      description,
      material: material || "mixed",
      color: color || "natural",
      rating: Number(rating) || 4.5,
      available: true
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 5. Update existing product
router.put("/products/:id", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 6. Delete product
router.delete("/products/:id", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
