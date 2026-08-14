const router = require("express").Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");

// Place a new rental order with tenure, address, and payment
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { items, tenureMonths = 1, shippingAddress = {}, paymentMethod = "razorpay" } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const ids = items.map(item => item.product);
    const products = await Product.find({ _id: { $in: ids }, available: true });

    const normalizedItems = items.map(item => {
      const product = products.find(p => p._id.toString() === item.product);
      if (!product) throw new Error("One or more products are unavailable");

      return {
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: Math.max(1, Number(item.quantity) || 1)
      };
    });

    const monthlySubtotal = normalizedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Tenure discount calculation
    const tenure = Number(tenureMonths) || 1;
    let discountPercent = 0;
    if (tenure >= 24) discountPercent = 35;
    else if (tenure >= 12) discountPercent = 25;
    else if (tenure >= 6) discountPercent = 15;
    else if (tenure >= 3) discountPercent = 5;

    const discountAmount = Math.round((monthlySubtotal * discountPercent) / 100);
    const discountedMonthly = monthlySubtotal - discountAmount;
    const securityDeposit = Math.round(monthlySubtotal * 0.5); // 50% refundable deposit
    const totalPayable = discountedMonthly + securityDeposit;

    const transactionId = "TXN_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6).toUpperCase();

    const order = await Order.create({
      user: req.user.id,
      items: normalizedItems,
      tenureMonths: tenure,
      discountPercent,
      subtotal: monthlySubtotal,
      discountAmount,
      securityDeposit,
      total: totalPayable,
      shippingAddress: {
        fullName: shippingAddress.fullName || "Valued Customer",
        phone: shippingAddress.phone || "",
        street: shippingAddress.street || "",
        city: shippingAddress.city || "",
        state: shippingAddress.state || "",
        pincode: shippingAddress.pincode || ""
      },
      payment: {
        method: paymentMethod,
        transactionId,
        status: "paid",
        paidAt: new Date()
      },
      status: "pending"
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Customer's order history
router.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// Cancel a pending order
router.put("/:id/cancel", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== "pending" && order.status !== "kyc_verified") {
      return res.status(400).json({ message: "Cannot cancel order in status: " + order.status });
    }

    order.status = "cancelled";
    await order.save();
    res.json({ message: "Order cancelled successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
