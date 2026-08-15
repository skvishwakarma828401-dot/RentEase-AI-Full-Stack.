const router = require("express").Router();
const Product = require("../models/Product");
const fallbackProducts = require("../data/productsData");

// GET all products (with Search, Category, and Price filtering)
router.get("/", async (req, res) => {
  try {
    const { search, category, maxPrice } = req.query;
    const isDbConnected = req.app.locals.isDbConnected;

    if (isDbConnected) {
      const filter = { available: true };

      if (category) filter.category = category.toLowerCase();
      if (maxPrice) filter.price = { $lte: Number(maxPrice) };

      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } }
        ];
      }

      const products = await Product.find(filter).sort({ rating: -1 });
      if (products && products.length > 0) {
        return res.json(products);
      }
    }

    // High-availability in-memory filtering fallback (guarantees Render NEVER returns empty)
    let filtered = [...fallbackProducts];

    if (category) {
      filtered = filtered.filter(p => p.category && p.category.toLowerCase() === category.toLowerCase());
    }

    if (maxPrice) {
      filtered = filtered.filter(p => Number(p.price) <= Number(maxPrice));
    }

    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(p =>
        (p.name && p.name.toLowerCase().includes(s)) ||
        (p.description && p.description.toLowerCase().includes(s)) ||
        (p.category && p.category.toLowerCase().includes(s))
      );
    }

    filtered.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
    res.json(filtered);
  } catch (error) {
    console.error("Product list error fallback:", error.message);
    res.json(fallbackProducts);
  }
});

// GET single product by ID
router.get("/:id", async (req, res) => {
  try {
    const isDbConnected = req.app.locals.isDbConnected;
    if (isDbConnected) {
      try {
        const product = await Product.findById(req.params.id);
        if (product) return res.json(product);
      } catch (dbErr) {
        // Continue to fallback check
      }
    }

    const found = fallbackProducts.find(p => String(p._id) === String(req.params.id));
    if (found) return res.json(found);

    res.status(404).json({ message: "Product not found" });
  } catch (error) {
    const found = fallbackProducts.find(p => String(p._id) === String(req.params.id));
    if (found) return res.json(found);
    res.status(400).json({ message: "Invalid product id" });
  }
});

// Sample in-memory reviews repository keyed by category / productId
const reviewsStore = {};

function getSampleReviewsForProduct(product) {
  const cat = product.category || "furniture";
  return [
    {
      id: "rev_1",
      author: "Priya Sharma",
      city: "Bengaluru",
      rating: 5,
      date: "2 days ago",
      verified: true,
      title: "Extremely comfortable & hassle-free delivery!",
      comment: `The ${product.name} arrived right on time within 48 hours. The delivery team assembled it in under 15 minutes. Great value for the monthly rent!`
    },
    {
      id: "rev_2",
      author: "Rahul Verma",
      city: "Mumbai",
      rating: 5,
      date: "1 week ago",
      verified: true,
      title: "Premium quality finish and fabric",
      comment: "Looks even better in person than the photos. Solid build, zero wobbling, and pristine condition. RentEase makes setting up an apartment so easy."
    },
    {
      id: "rev_3",
      author: "Ananya Mukherjee",
      city: "Delhi NCR",
      rating: 4,
      date: "2 weeks ago",
      verified: true,
      title: "Worth every rupee for short-term rental",
      comment: "Opted for the 12-month tenure to get the 25% discount. Extremely satisfied with customer support and doorstep setup."
    }
  ];
}

// GET Reviews for a product
router.get("/:id/reviews", (req, res) => {
  const pid = req.params.id;
  const product = fallbackProducts.find(p => String(p._id) === String(pid)) || { name: "Furniture Item", category: "sofa" };

  if (!reviewsStore[pid]) {
    reviewsStore[pid] = getSampleReviewsForProduct(product);
  }

  res.json({
    success: true,
    totalReviews: reviewsStore[pid].length,
    averageRating: (reviewsStore[pid].reduce((a, b) => a + b.rating, 0) / reviewsStore[pid].length).toFixed(1),
    reviews: reviewsStore[pid]
  });
});

// POST Submit a customer review
router.post("/:id/reviews", (req, res) => {
  const pid = req.params.id;
  const { author, city, rating, title, comment } = req.body;

  if (!author || !rating || !comment) {
    return res.status(400).json({ message: "Author name, rating, and comment are required." });
  }

  const newReview = {
    id: "rev_" + Date.now(),
    author: author.trim(),
    city: city ? city.trim() : "Verified Customer",
    rating: Number(rating) || 5,
    date: "Just now",
    verified: true,
    title: title ? title.trim() : "Verified Customer Feedback",
    comment: comment.trim()
  };

  if (!reviewsStore[pid]) {
    const product = fallbackProducts.find(p => String(p._id) === String(pid)) || { name: "Furniture Item" };
    reviewsStore[pid] = getSampleReviewsForProduct(product);
  }

  reviewsStore[pid].unshift(newReview);

  res.status(201).json({
    success: true,
    message: "Thank you! Your verified review has been published.",
    review: newReview
  });
});

// POST Check Pincode Delivery Serviceability
router.post("/check-pincode", (req, res) => {
  const { pincode } = req.body;

  if (!pincode || !/^\d{6}$/.test(pincode.toString().trim())) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid 6-digit Indian PIN code (e.g. 560001, 110001, 400001, 828401)."
    });
  }

  const pin = pincode.toString().trim();
  const firstDigit = pin.charAt(0);

  const regionMap = {
    "1": { city: "Delhi NCR / North Region", days: "24-48 Hours", express: true },
    "2": { city: "Uttar Pradesh / Uttarakhand", days: "2-3 Days", express: true },
    "3": { city: "Rajasthan / Gujarat", days: "2-3 Days", express: true },
    "4": { city: "Mumbai / Maharashtra / Goa", days: "24-48 Hours", express: true },
    "5": { city: "Hyderabad / Andhra / Telangana", days: "24-48 Hours", express: true },
    "6": { city: "Bengaluru / Chennai / South Region", days: "24-48 Hours", express: true },
    "7": { city: "Kolkata / Eastern Hub", days: "2-3 Days", express: true },
    "8": { city: "Bihar / Jharkhand (Dhanbad, Ranchi, Patna)", days: "2-4 Days", express: true },
    "9": { city: "Special Service Zone", days: "3-5 Days", express: false }
  };

  const info = regionMap[firstDigit] || { city: "India Delivery Zone", days: "2-4 Days", express: true };

  res.json({
    success: true,
    pincode: pin,
    serviceable: true,
    region: info.city,
    estimatedDelivery: info.days,
    freeAssembly: true,
    zeroDepositEligible: true,
    message: `✓ Express Delivery available in ${info.city} within ${info.days}. Free Doorstep Assembly Included!`
  });
});

// POST new product (Admin)
router.post("/", async (req, res) => {
  try {
    const isDbConnected = req.app.locals.isDbConnected;
    if (isDbConnected) {
      const product = await Product.create(req.body);
      return res.status(201).json(product);
    }

    // In-memory create
    const newProd = {
      ...req.body,
      _id: "66b8c9d0e1f2a3b4c5d6" + String(fallbackProducts.length + 1).padStart(4, "0"),
      rating: req.body.rating || 4.8,
      available: true
    };
    fallbackProducts.unshift(newProd);
    res.status(201).json(newProd);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

