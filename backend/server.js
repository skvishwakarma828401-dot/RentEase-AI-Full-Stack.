require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const aiRoutes = require("./routes/aiRoutes");
const adminRoutes = require("./routes/adminRoutes");

const Product = require("./models/Product");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const fallbackProducts = require("./data/productsData");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

// Set default DB state
app.locals.isDbConnected = false;

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "RentEase API is running",
    mode: app.locals.isDbConnected ? "MongoDB Connected" : "High-Availability In-Memory Mode",
    productsCount: fallbackProducts.length
  });
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../frontend")));

// SPA fallback for HTML5 history navigation
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

async function autoSeedIfEmpty() {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log("Database is empty. Auto-seeding 150 furniture products...");
      await Product.insertMany(fallbackProducts);
      console.log(`Auto-seeded ${fallbackProducts.length} furniture products into MongoDB!`);
    }

    const admin = await User.findOne({ email: "admin@rentease.com" });
    if (!admin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        name: "RentEase Admin",
        email: "admin@rentease.com",
        password: hashedPassword,
        role: "admin"
      });
      console.log("Admin user auto-initialized: admin@rentease.com");
    }
  } catch (seedErr) {
    console.warn("Auto-seed notice:", seedErr.message);
  }
}

async function startServer() {
  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/rentease";

  try {
    // Attempt MongoDB connection with 5s timeout
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    app.locals.isDbConnected = true;
    console.log("MongoDB connected successfully");
    await autoSeedIfEmpty();
  } catch (error) {
    app.locals.isDbConnected = false;
    console.warn("Notice: MongoDB not available. Starting RentEase in High-Availability In-Memory Mode with 150 items.");
  }

  app.listen(PORT, () => {
    console.log(`RentEase running at http://localhost:${PORT}`);
    console.log(`Live Mode: ${app.locals.isDbConnected ? "MongoDB Connected" : "In-Memory Preloaded (150 Products)"}`);
  });
}

startServer();
