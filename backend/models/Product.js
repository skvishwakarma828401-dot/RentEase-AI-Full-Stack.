const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, lowercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    roomSize: { type: String, enum: ["small", "medium", "large"], default: "medium" },
    material: { type: String, default: "mixed" },
    color: { type: String, default: "natural" },
    rating: { type: Number, default: 4.2, min: 0, max: 5 },
    image: { type: String, required: true },
    available: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
