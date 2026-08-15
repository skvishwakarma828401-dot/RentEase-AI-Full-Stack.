require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const products = require("./data/productsData");

async function seed() {
  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/rentease";
  await mongoose.connect(mongoUri);
  
  // Seed 150 Products
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`Successfully Seeded ${products.length} products (including Kids Furniture)!`);

  // Seed Admin Account
  const existingAdmin = await User.findOne({ email: "admin@rentease.com" });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await User.create({
      name: "RentEase Admin",
      email: "admin@rentease.com",
      password: hashedPassword,
      role: "admin"
    });
    console.log("Seeded Admin User: admin@rentease.com / admin123");
  } else {
    existingAdmin.role = "admin";
    await existingAdmin.save();
    console.log("Admin account confirmed: admin@rentease.com");
  }

  await mongoose.disconnect();
}

if (require.main === module) {
  seed().catch(err => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = seed;
