const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: String,
        price: Number,
        quantity: { type: Number, default: 1 },
        image: String,
        category: String
      }
    ],
    tenureMonths: { type: Number, default: 1 },
    discountPercent: { type: Number, default: 0 },
    subtotal: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    securityDeposit: { type: Number, default: 0 },
    total: { type: Number, required: true },
    shippingAddress: {
      fullName: { type: String, default: "Customer" },
      phone: { type: String, default: "" },
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      pincode: { type: String, default: "" }
    },
    payment: {
      method: { type: String, enum: ["razorpay", "card", "upi", "netbanking", "cod"], default: "razorpay" },
      transactionId: { type: String, default: () => "TXN_" + Math.random().toString(36).substring(2, 10).toUpperCase() },
      status: { type: String, enum: ["paid", "pending", "failed"], default: "paid" },
      paidAt: { type: Date, default: Date.now }
    },
    status: {
      type: String,
      enum: ["pending", "kyc_verified", "out_for_delivery", "delivered", "cancelled"],
      default: "pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);

