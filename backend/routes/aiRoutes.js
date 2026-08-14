const router = require("express").Router();
const Product = require("../models/Product");
const { parseWithAI, processChatMessage } = require("../services/aiService");

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

// Backward-compatible single recommendation endpoint
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

    const products = await Product.find(query).sort({ rating: -1, price: 1 }).limit(6);

    const explanation = products.length
      ? `I found ${products.length} option${products.length > 1 ? "s" : ""} matching your request.`
      : "I couldn't find an exact match. Try increasing your budget or changing the room size/category.";

    res.json({ message: explanation, filters, products });
  } catch (error) {
    console.error("AI recommendation error:", error.message);
    res.status(500).json({
      message: "AI recommendation failed. Check your AI configuration and try again."
    });
  }
});

module.exports = router;
