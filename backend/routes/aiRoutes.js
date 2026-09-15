const router = require("express").Router();
const mongoose = require("mongoose");
const Product = require("../models/Product");
const fallbackProducts = require("../data/productsData");
const { parseWithAI, processChatMessage, analyzeRoomScan } = require("../services/aiService");

// Conversational Chatbot endpoint for interactive floating widget
router.post("/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ message: "Please enter a valid message." });
    }

    const result = await processChatMessage({
      message,
      history: Array.isArray(history) ? history : [],
      ProductModel: Product
    });

    res.json({
      success: true,
      reply: result.reply,
      suggestions: result.suggestions,
      products: result.products,
      filters: result.filters,
      intent: result.intent
    });
  } catch (error) {
    console.error("AI Chat error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong processing your message. Please try again.",
      reply: "Sorry, I ran into an error while processing your request. Please try again or ask another question!",
      suggestions: ["🛋️ Browse Furniture", "📦 How Renting Works", "📞 Contact Support"],
      products: []
    });
  }
});

// Backward-compatible single recommendation endpoint (for on-page AI section)
router.post("/recommend", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length < 3) {
      return res.status(400).json({ message: "Please describe what furniture you need." });
    }

    const filters = await parseWithAI(message);

    const query = { available: true };
    if (filters.category) query.category = filters.category.toLowerCase();
    if (filters.maxPrice) query.price = { $lte: Number(filters.maxPrice) };
    if (filters.roomSize) query.roomSize = filters.roomSize;

    let products = [];
    const isDbConnected = req.app.locals.isDbConnected && mongoose.connection.readyState === 1;

    if (isDbConnected) {
      try {
        products = await Product.find(query).sort({ rating: -1, price: 1 }).limit(6);

        if (products.length === 0 && filters.category && filters.maxPrice) {
          products = await Product.find({
            category: filters.category.toLowerCase(),
            price: { $lte: Number(filters.maxPrice) },
            available: true
          }).sort({ rating: -1, price: 1 }).limit(6);
        }

        if (products.length === 0 && filters.category) {
          products = await Product.find({
            category: filters.category.toLowerCase(),
            available: true
          }).sort({ price: 1 }).limit(6);
        }
      } catch (dbErr) {
        console.warn("DB Query error in /recommend:", dbErr.message);
      }
    }

    if (!products || products.length === 0) {
      products = fallbackProducts.filter(p => {
        if (filters.category && p.category && p.category.toLowerCase() !== filters.category.toLowerCase()) return false;
        if (filters.maxPrice && Number(p.price) > Number(filters.maxPrice)) return false;
        if (filters.roomSize && p.roomSize && p.roomSize.toLowerCase() !== filters.roomSize.toLowerCase()) return false;
        return true;
      }).slice(0, 6);

      if (products.length === 0 && filters.category && filters.maxPrice) {
        products = fallbackProducts.filter(p =>
          p.category && p.category.toLowerCase() === filters.category.toLowerCase() && Number(p.price) <= Number(filters.maxPrice)
        ).slice(0, 6);
      }

      if (products.length === 0 && filters.category) {
        products = fallbackProducts.filter(p =>
          p.category && p.category.toLowerCase() === filters.category.toLowerCase()
        ).slice(0, 6);
      }
    }

    // Normalize all products with string IDs and link
    const normalizedProducts = products.map((p, idx) => {
      const prodObj = p.toObject ? p.toObject() : { ...p };
      const validId = String(prodObj._id || prodObj.id || `66b8c9d0e1f2a3b4c5d6${String(idx + 1).padStart(4, "0")}`);
      return {
        ...prodObj,
        _id: validId,
        id: validId,
        name: prodObj.name || "Furniture Item",
        category: prodObj.category || "furniture",
        price: Number(prodObj.price) || 999,
        rating: Number(prodObj.rating) || 4.8,
        image: prodObj.image || "",
        material: prodObj.material || "Premium",
        color: prodObj.color || "Natural Finish",
        roomSize: prodObj.roomSize || "medium",
        description: prodObj.description || "",
        url: `/?product=${encodeURIComponent(validId)}`
      };
    });

    const explanation = normalizedProducts.length
      ? `I found ${normalizedProducts.length} option${normalizedProducts.length > 1 ? "s" : ""} matching your request. Click any item to view full specifications, dimensions, and rental tenures.`
      : "I couldn't find an exact match. Try expanding your budget or asking for sofa, bed, chair, desk, table, or wardrobe!";

    res.json({ message: explanation, filters, products: normalizedProducts });
  } catch (error) {
    console.error("AI recommendation error:", error.message);
    res.status(500).json({
      message: "AI recommendation failed. Check your AI configuration and try again."
    });
  }
});

// Real-Time Camera Room Scanner & Spatial AI Vision Analyzer
router.post("/scan-room", async (req, res) => {
  try {
    const { imageData, roomTypeHint, spaceSizeHint } = req.body;

    const result = await analyzeRoomScan({
      imageData,
      roomTypeHint,
      spaceSizeHint,
      ProductModel: Product
    });

    res.json(result);
  } catch (error) {
    console.error("Room scan API error:", error);
    res.status(500).json({
      success: false,
      message: "Room analysis failed. Please try again."
    });
  }
});

module.exports = router;

