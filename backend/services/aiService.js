const OpenAI = require("openai");

// RentEase comprehensive knowledge base
const KNOWLEDGE_BASE = {
  renting_process: {
    title: "How Furniture Rental Works",
    summary: "Renting with RentEase is simple, flexible, and affordable in 4 easy steps:\n1. **Browse & Select**: Choose furniture from our catalog.\n2. **Choose Tenure**: Select 3, 6, 12, or 24 months (longer tenures get up to 35% discount!).\n3. **Quick KYC**: Complete a 2-minute online verification.\n4. **Free Delivery & Assembly**: Delivered & installed at your doorstep within 48-72 hours.",
    suggestions: ["🛋️ Browse Sofas", "💰 Check Rental Plans", "🛡️ Security Deposit Info"]
  },
  buying_vs_renting: {
    title: "Renting vs. Buying on RentEase",
    summary: "• **Renting**: Zero long-term commitment, free doorstep relocation, free maintenance & cleaning, upgrade whenever you want, and option to buyout anytime.\n• **Buying**: One-time payment for permanent ownership, 5-year warranty, and free doorstep delivery.",
    suggestions: ["📦 How Renting Works", "🛏️ Explore Bedroom Furniture", "📞 Contact Support"]
  },
  deposit_policy: {
    title: "Security Deposit & Refund Policy",
    summary: "• **Low Deposit**: We charge a minimal refundable security deposit (equivalent to 1-2 months rent).\n• **100% Refundable**: The deposit is automatically refunded to your bank account within 3 to 5 business days after product pickup and quality check.\n• **No Hidden Deductions**: Normal wear and tear is completely forgiven.",
    suggestions: ["🚚 Delivery & Return Policy", "🛡️ Damage & Maintenance", "🛋️ Show Featured Furniture"]
  },
  delivery_assembly: {
    title: "Delivery & Installation",
    summary: "• **Delivery Timeline**: Delivered within **48 to 72 hours** of order approval and KYC completion.\n• **Free Shipping**: 100% Free delivery and doorstep assembly by our trained technicians.\n• **Slot Booking**: You can choose your preferred delivery time slot during checkout.",
    suggestions: ["📋 KYC Requirements", "🛒 View My Cart", "💬 Ask another question"]
  },
  kyc_verification: {
    title: "KYC & Documentation",
    summary: "Fast and 100% paperless verification:\n1. **Government ID**: Aadhaar Card, PAN Card, Passport, or Driving License.\n2. **Current Address Proof**: Utility bill, rental agreement, or company letter.\n3. **Income Proof**: Recent salary slip or bank statement (for high-value rentals).\nVerification takes less than 30 minutes!",
    suggestions: ["📦 How Renting Works", "💰 Security Deposit Info", "🛋️ Browse Furniture"]
  },
  returns_maintenance: {
    title: "Returns, Swaps & Maintenance",
    summary: "• **7-Day Trial**: If you don't love your furniture, return or replace it within 7 days for free.\n• **Free Maintenance**: Annual deep-cleaning and maintenance checkups are provided at zero cost.\n• **Normal Wear & Tear**: Minor scratches and regular usage marks are 100% covered—you won't be charged!",
    suggestions: ["🛡️ Security Deposit Info", "🚚 Delivery Timeline", "✨ Explore Catalog"]
  },
  tenure_pricing: {
    title: "Rental Tenures & Discounts",
    summary: "We offer flexible rental tenures tailored to your stay:\n• **3 Months**: Great for temporary stays.\n• **6 Months**: Save 15% on monthly rent.\n• **12 Months**: Save 25% on monthly rent (Most Popular).\n• **24 Months+**: Save up to 35% on monthly rent + Free annual swap option.",
    suggestions: ["🛋️ Living Room Furniture", "🛏️ Beds & Mattresses", "🖥️ Study & Home Office"]
  },
  contact_support: {
    title: "RentEase Customer Support",
    summary: "Our dedicated support team is here for you:\n• 📧 **Email**: skvishwakarma828401@gmail.com\n• 📞 **Phone**: +91 8210828893 (9 AM - 9 PM IST)\n• 📍 **Live Chat**: Available 24/7 right here in this assistant!",
    suggestions: ["📦 How Renting Works", "🚚 Track Delivery", "🛋️ Show Top Furniture"]
  }
};

function demoParse(message) {
  const text = message.toLowerCase();

  const categoryMap = [
    { cat: "sofa", regex: /\b(sofas?|couches?|couch|seating|recliners?|loveseats?)\b/i },
    { cat: "bed", regex: /\b(beds?|cots?|mattresses?|headboards?)\b/i },
    { cat: "desk", regex: /\b(desks?|workstations?|study\s*(table|desk)|office\s*desk)\b/i },
    { cat: "chair", regex: /\b(chairs?|stools?|armchairs?|office\s*chair)\b/i },
    { cat: "table", regex: /\b(tables?|dining(\s*table)?|coffee\s*table|side\s*table|nightstands?)\b/i },
    { cat: "wardrobe", regex: /\b(wardrobes?|closets?|cupboards?|almirahs?|armoires?)\b/i }
  ];

  let category = null;
  for (const item of categoryMap) {
    if (item.regex.test(text)) {
      category = item.cat;
      break;
    }
  }

  const priceMatches = text.replace(/,/g, "").match(/(?:₹|rs\.?|inr)?\s*(\d{3,7})/i);
  let maxPrice = null;

  if (priceMatches) {
    const number = Number(priceMatches[1]);
    if (number >= 500) maxPrice = number;
  }

  let roomSize = null;
  if (text.includes("small") || text.includes("compact") || text.includes("studio") || text.includes("1bhk")) roomSize = "small";
  if (text.includes("medium") || text.includes("2bhk")) roomSize = "medium";
  if (text.includes("large") || text.includes("big") || text.includes("spacious") || text.includes("3bhk") || text.includes("hall")) roomSize = "large";

  return { category, maxPrice, roomSize };
}

async function parseWithAI(message) {
  if (!process.env.OPENAI_API_KEY) return demoParse(message);

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Extract furniture shopping filters from user message. Return JSON ONLY with keys: category (sofa, bed, table, chair, wardrobe, desk or null), maxPrice (number or null), roomSize (small, medium, large or null)."
        },
        { role: "user", content: message }
      ],
      response_format: { type: "json_object" }
    });

    const parsed = JSON.parse(response.choices[0].message.content);
    return {
      category: parsed.category || null,
      maxPrice: parsed.maxPrice ? Number(parsed.maxPrice) : null,
      roomSize: parsed.roomSize || null
    };
  } catch (err) {
    console.error("OpenAI parse error, falling back:", err.message);
    return demoParse(message);
  }
}

/**
 * Full conversational handler that answers customer questions, resolves issues,
 * and dynamically recommends furniture items.
 */
async function processChatMessage({ message, history = [], ProductModel }) {
  const text = (message || "").trim();
  const lower = text.toLowerCase();

  // 1. Check for quick intent matches in Knowledge Base
  let replyText = "";
  let suggestions = ["🛋️ Browse Sofas", "🛏️ Bedroom Furniture", "📦 How Renting Works", "💰 Security Deposit", "🚚 Delivery Info"];
  let matchedFilters = demoParse(text);
  let products = [];
  let intent = "general";

  // Greetings
  if (/^(hi|hello|hey|greetings|good\s*(morning|afternoon|evening)|namaste|yo|hola)/i.test(lower)) {
    replyText = "Hello! 👋 Welcome to **RentEase** — your smart platform to rent or buy premium furniture.\n\nI can help you:\n• 🛋️ Find the perfect furniture for your budget & room size\n• 📦 Explain rental tenures, plans, and buyout options\n• 🚚 Guide you on free delivery, assembly & 100% refundable deposits\n• 🛡️ Assist with orders, KYC, cart & return policies\n\nHow can I help you today?";
    suggestions = ["🛋️ Find a Sofa for small room", "🛏️ Explore Beds under ₹20,000", "📦 How does renting work?", "💰 Security Deposit & Refund", "🚚 Delivery Timeline"];
    return { reply: replyText, suggestions, products: [], intent: "greeting" };
  }

  // Renting vs Buying / How it works
  if (lower.includes("how does renting work") || lower.includes("how to rent") || lower.includes("rental process") || lower.includes("how it works") || lower.includes("how do i rent")) {
    const info = KNOWLEDGE_BASE.renting_process;
    replyText = `### ${info.title}\n\n${info.summary}`;
    suggestions = info.suggestions;
    intent = "faq_renting";
  } else if (lower.includes("buy") && (lower.includes("rent") || lower.includes("vs") || lower.includes("difference") || lower.includes("instead"))) {
    const info = KNOWLEDGE_BASE.buying_vs_renting;
    replyText = `### ${info.title}\n\n${info.summary}`;
    suggestions = info.suggestions;
    intent = "faq_buy_vs_rent";
  } else if (lower.includes("deposit") || lower.includes("security money") || lower.includes("refundable") || lower.includes("caution money")) {
    const info = KNOWLEDGE_BASE.deposit_policy;
    replyText = `### ${info.title}\n\n${info.summary}`;
    suggestions = info.suggestions;
    intent = "faq_deposit";
  } else if (lower.includes("delivery") || lower.includes("shipping") || lower.includes("assembly") || lower.includes("installation") || lower.includes("when will") || lower.includes("how long")) {
    const info = KNOWLEDGE_BASE.delivery_assembly;
    replyText = `### ${info.title}\n\n${info.summary}`;
    suggestions = info.suggestions;
    intent = "faq_delivery";
  } else if (lower.includes("kyc") || lower.includes("document") || lower.includes("verification") || lower.includes("id proof") || lower.includes("aadhaar")) {
    const info = KNOWLEDGE_BASE.kyc_verification;
    replyText = `### ${info.title}\n\n${info.summary}`;
    suggestions = info.suggestions;
    intent = "faq_kyc";
  } else if (lower.includes("return") || lower.includes("cancel") || lower.includes("damage") || lower.includes("repair") || lower.includes("swap") || lower.includes("cleaning") || lower.includes("wear and tear")) {
    const info = KNOWLEDGE_BASE.returns_maintenance;
    replyText = `### ${info.title}\n\n${info.summary}`;
    suggestions = info.suggestions;
    intent = "faq_returns";
  } else if (lower.includes("tenure") || lower.includes("discount") || lower.includes("plan") || lower.includes("duration") || lower.includes("month") && (lower.includes("cost") || lower.includes("price") || lower.includes("rate"))) {
    const info = KNOWLEDGE_BASE.tenure_pricing;
    replyText = `### ${info.title}\n\n${info.summary}`;
    suggestions = info.suggestions;
    intent = "faq_pricing";
  } else if (lower.includes("contact") || lower.includes("support") || lower.includes("helpline") || lower.includes("phone") || lower.includes("email") || lower.includes("call") || lower.includes("human")) {
    const info = KNOWLEDGE_BASE.contact_support;
    replyText = `### ${info.title}\n\n${info.summary}`;
    suggestions = info.suggestions;
    intent = "faq_contact";
  } else if (lower.includes("cart") || lower.includes("checkout") || lower.includes("order status") || lower.includes("place order")) {
    replyText = "### 🛒 Cart & Ordering Guide\n\n1. You can add any furniture directly to your cart with one click.\n2. Open **[Your Cart](/cart.html)** to adjust quantities or review monthly totals.\n3. Make sure to **Login / Register** using the button in the top navbar.\n4. Click **'Place Rental Order'** to complete your booking. Our team will contact you for free delivery scheduling!";
    suggestions = ["🛒 Open My Cart", "🛋️ Browse Featured Items", "🚚 Delivery Timeline"];
    intent = "cart_help";
  }

  // 2. If user mentions furniture categories or product search intent
  const hasFurnitureIntent = matchedFilters.category || matchedFilters.maxPrice || matchedFilters.roomSize ||
    lower.includes("find") || lower.includes("show") || lower.includes("recommend") || lower.includes("suggest") ||
    lower.includes("looking for") || lower.includes("furniture") || lower.includes("cheap") || lower.includes("budget") ||
    lower.includes("options") || lower.includes("item") || lower.includes("available");

  if (hasFurnitureIntent && ProductModel) {
    const query = { available: true };
    if (matchedFilters.category) query.category = matchedFilters.category;
    if (matchedFilters.maxPrice) query.price = { $lte: matchedFilters.maxPrice };
    if (matchedFilters.roomSize) query.roomSize = matchedFilters.roomSize;

    try {
      products = await ProductModel.find(query).sort({ rating: -1, price: 1 }).limit(4);

      // If strict filter yielded 0 results, relax the query slightly
      if (products.length === 0 && matchedFilters.category) {
        products = await ProductModel.find({ category: matchedFilters.category, available: true }).limit(3);
      }
    } catch (dbErr) {
      console.error("DB Query error:", dbErr.message);
    }

    if (products.length > 0) {
      const catLabel = matchedFilters.category ? `${matchedFilters.category}` : "furniture";
      const sizeLabel = matchedFilters.roomSize ? ` for a **${matchedFilters.roomSize} room**` : "";
      const priceLabel = matchedFilters.maxPrice ? ` within **₹${matchedFilters.maxPrice.toLocaleString('en-IN')}**` : "";
      
      const recIntro = `Here are the top rated **${catLabel}** options${sizeLabel}${priceLabel} currently available in our catalog:`;
      
      if (replyText) {
        replyText += `\n\n---\n\n${recIntro}`;
      } else {
        replyText = `✦ **Furniture Recommendations**\n\n${recIntro}\n\n*Click **Add to Cart** on any card to add it to your order immediately.*`;
      }

      suggestions = [
        `🛋️ Explore more ${matchedFilters.category || 'furniture'}`,
        "💰 What is the security deposit?",
        "🚚 How fast is delivery?",
        "🛒 Go to Cart"
      ];
      intent = "product_recommendation";
    } else if (!replyText) {
      replyText = `I couldn't find an exact match for **${text}**. Try expanding your budget or asking for categories like **sofa, bed, study desk, ergonomic chair, wardrobe, or dining table**!`;
      suggestions = ["🛋️ Show All Sofas", "🛏️ Show All Beds", "🖥️ Show Office Chairs", "📦 How Renting Works"];
    }
  }

  // 3. If OpenAI is configured and no specific template answered, use OpenAI
  if (!replyText && process.env.OPENAI_API_KEY) {
    try {
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const promptMessages = [
        {
          role: "system",
          content: `You are RentEase AI, an expert furniture rental and buying advisor for the RentEase full-stack platform.
          Provide friendly, concise, and helpful advice to customers.
          Key RentEase details:
          - Free delivery & assembly within 48-72 hours.
          - 100% refundable security deposit returned in 3-5 days.
          - Free deep cleaning & wear-and-tear coverage.
          - Flexible tenures: 3, 6, 12, 24 months with up to 35% discounts.
          - Simple online KYC.
          - Support Email: skvishwakarma828401@gmail.com, Phone: +91 8210828893.
          - Categories: Sofa, Bed, Desk, Chair, Table, Wardrobe.
          Format response with clean markdown and bullet points when appropriate.`
        },
        ...history.slice(-4),
        { role: "user", content: text }
      ];

      const aiResponse = await client.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: promptMessages,
        max_tokens: 300
      });

      replyText = aiResponse.choices[0].message.content;
      suggestions = ["🛋️ View Sofas", "🛏️ View Beds", "📦 Rental Plans", "📞 Customer Care"];
    } catch (apiErr) {
      console.error("OpenAI chat error:", apiErr.message);
    }
  }

  // Default fallback if still empty
  if (!replyText) {
    replyText = `I am here to guide you with everything on **RentEase**! You can ask me to find furniture (e.g. *"Show me sofas under ₹20,000 for a small room"*), or ask about our rental plans, delivery timelines, security deposits, and return policies.`;
    suggestions = ["🛋️ Find a Sofa", "🛏️ Comfort Beds", "📦 How Renting Works", "💰 Security Deposit Policy", "🚚 Delivery & Assembly"];
  }

  return {
    reply: replyText,
    suggestions,
    products,
    filters: matchedFilters,
    intent
  };
}

module.exports = {
  parseWithAI,
  processChatMessage,
  KNOWLEDGE_BASE
};

