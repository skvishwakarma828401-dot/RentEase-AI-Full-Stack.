require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

const products = [
  // ================= SOFAS & SEATING (25 Products) =================
  {
    name: "Urban 2-Seater Fabric Sofa",
    category: "sofa",
    description: "Compact premium fabric sofa designed for apartments and cozy living rooms.",
    price: 15999,
    roomSize: "small",
    material: "fabric",
    color: "grey",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Premium Royal L-Shape Sectional",
    category: "sofa",
    description: "Spacious luxury sectional L-shaped sofa with ultra-soft linen cushions.",
    price: 28999,
    roomSize: "large",
    material: "linen",
    color: "beige",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1550254478-ead40cc54513?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Scandinavian 3-Seater Velvet Sofa",
    category: "sofa",
    description: "Elegant modern sofa with wooden legs and stain-resistant velvet fabric.",
    price: 21999,
    roomSize: "medium",
    material: "velvet",
    color: "forest green",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Chesterfield Tufted Leather Couch",
    category: "sofa",
    description: "Classic deep button-tufted leather couch with rolled arms and vintage charm.",
    price: 34999,
    roomSize: "large",
    material: "genuine leather",
    color: "cognac brown",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Modern Minimalist Studio Loveseat",
    category: "sofa",
    description: "Space-saving modern loveseat with sleek metal tapered legs.",
    price: 13499,
    roomSize: "small",
    material: "cotton blend",
    color: "charcoal",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Plush Reclining 3-Seater Home Theater Sofa",
    category: "sofa",
    description: "Dual manual recliners with integrated cup holders and lumbar support.",
    price: 31999,
    roomSize: "large",
    material: "faux leather",
    color: "matte black",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Boho Rattan Frame 2-Seater Settee",
    category: "sofa",
    description: "Natural handwoven cane rattan settee with off-white cotton twill cushions.",
    price: 18499,
    roomSize: "small",
    material: "natural rattan",
    color: "natural warm wood",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Bouclé Curved Accent Sofa",
    category: "sofa",
    description: "Contemporary organic curved shape upholstered in textured white bouclé fabric.",
    price: 26999,
    roomSize: "medium",
    material: "bouclé wool blend",
    color: "ivory white",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Convertible Sofa Bed & Futon",
    category: "sofa",
    description: "Multi-functional click-clack sofa that easily folds down into a queen bed.",
    price: 17999,
    roomSize: "small",
    material: "microfiber",
    color: "navy blue",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Mid-Century Amber Velvet Daybed",
    category: "sofa",
    description: "Versatile lounging daybed with bolster pillow and solid walnut wood base.",
    price: 23999,
    roomSize: "medium",
    material: "velvet & walnut",
    color: "mustard amber",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Modern Modular 4-Piece Cloud Sectional",
    category: "sofa",
    description: "Deep-seated down feather filled modular sectional sofa in clean pearl grey.",
    price: 36999,
    roomSize: "large",
    material: "down & performance linen",
    color: "pearl grey",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1550254478-ead40cc54513?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Classic English Roll Arm 3-Seater Sofa",
    category: "sofa",
    description: "Tailored sofa with turned wooden castors and duck feather reversible seat cushions.",
    price: 24999,
    roomSize: "medium",
    material: "cotton linen",
    color: "sage green",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Japanese Low-Profile Floor Tatami Sofa",
    category: "sofa",
    description: "Zen inspired minimalist floor sectional with washable linen covers and solid cedar frame.",
    price: 19999,
    roomSize: "small",
    material: "solid wood & linen",
    color: "sand",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Vintage Distressed Tan Leather Loveseat",
    category: "sofa",
    description: "Aged full-grain Italian leather 2-seater couch with brass nailhead trim.",
    price: 29999,
    roomSize: "small",
    material: "top grain leather",
    color: "tan",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Art Deco Emerald Velvet Curved Chaise",
    category: "sofa",
    description: "Glamorous curved chaise lounge with channel tufting and gold metal frame.",
    price: 22999,
    roomSize: "medium",
    material: "velvet & brass",
    color: "emerald green",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Outdoor Weatherproof Wicker Patio Sofa",
    category: "sofa",
    description: "All-weather UV resistant synthetic rattan sofa with quick-dry waterproof cushions.",
    price: 18999,
    roomSize: "medium",
    material: "synthetic rattan & aluminum",
    color: "espresso brown",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Nordic Minimalist Corner Sectional",
    category: "sofa",
    description: "Clean lines corner sofa with high-density foam cushions and solid birch frame.",
    price: 27499,
    roomSize: "large",
    material: "woven fabric & birch",
    color: "slate blue",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Mid-Century Modern Track Arm 3-Seater",
    category: "sofa",
    description: "Structured track arm sofa with buttonless tufting and walnut tapered legs.",
    price: 20999,
    roomSize: "medium",
    material: "poly-linen",
    color: "terracotta rust",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Compact Click-Clack Folding Studio Bed Sofa",
    category: "sofa",
    description: "Easy 3-position adjustable backrest converting effortlessly into a single sleeper bed.",
    price: 12499,
    roomSize: "small",
    material: "fabric & steel",
    color: "light grey",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Contemporary Tufted Suede U-Shape Sectional",
    category: "sofa",
    description: "Massive 7-seater U-shaped family conversation sofa with high-resilience foam.",
    price: 44999,
    roomSize: "large",
    material: "faux suede",
    color: "taupe",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1550254478-ead40cc54513?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Casual Organic Linen Slipcovered Couch",
    category: "sofa",
    description: "Relaxed coastal style sofa with 100% machine-washable natural Belgian linen slipcover.",
    price: 25499,
    roomSize: "medium",
    material: "100% linen",
    color: "crisp white",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Industrial Raw Iron & Distressed Leather Bench Sofa",
    category: "sofa",
    description: "Urban loft sofa with matte black steel pipe frame and aged saddle leather seats.",
    price: 21999,
    roomSize: "small",
    material: "iron & leather",
    color: "vintage cigar",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Luxury Channel-Stitched Velvet Sectional",
    category: "sofa",
    description: "Modern architectural sectional with vertical channeled backrest and brushed bronze feet.",
    price: 33499,
    roomSize: "large",
    material: "matte velvet",
    color: "midnight blue",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Scandinavian Oak Frame Armless Loveseat",
    category: "sofa",
    description: "Minimalist open-slat solid oak frame with high-density ergonomic grey wool cushions.",
    price: 16999,
    roomSize: "small",
    material: "solid oak & wool",
    color: "heather grey",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Reclining Single Armchair Lounge Sofa",
    category: "sofa",
    description: "Extra wide single seat recliner with power headrest and USB phone charging port.",
    price: 18999,
    roomSize: "small",
    material: "breathable fabric",
    color: "charcoal grey",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80"
  },

  // ================= BEDS & BEDROOM (25 Products) =================
  {
    name: "Solid Sheesham Wood Queen Bed with Storage",
    category: "bed",
    description: "Handcrafted natural Sheesham wood queen bed with four built-in pullout drawers.",
    price: 24999,
    roomSize: "medium",
    material: "sheesham wood",
    color: "walnut finish",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Modern Upholstered King Size Bed",
    category: "bed",
    description: "Luxury upholstered headboard king bed with cushioned diamond tufting.",
    price: 27999,
    roomSize: "large",
    material: "engineered wood & velvet",
    color: "slate grey",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Minimalist Japanese Platform Bed",
    category: "bed",
    description: "Low-profile solid pine wood platform bed frame with integrated floating side ledges.",
    price: 19499,
    roomSize: "small",
    material: "pine wood",
    color: "natural oak",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Hydraulic Lift-Up King Storage Bed",
    category: "bed",
    description: "Effortless gas-lift hydraulic storage mechanism with massive under-bed organizer.",
    price: 31999,
    roomSize: "large",
    material: "MDF & fabric",
    color: "sand beige",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Industrial Metal & Wood Single Cot",
    category: "bed",
    description: "Sturdy powder-coated matte black steel bed with rustic reclaimed headboard.",
    price: 9999,
    roomSize: "small",
    material: "iron & engineered wood",
    color: "black / rustic brown",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1540518614846-7ede433c4ef2?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Solid Teak Wood Heritage Queen Bed",
    category: "bed",
    description: "Traditional carved solid teak wood headboard and brass corner accents.",
    price: 36999,
    roomSize: "large",
    material: "solid teak wood",
    color: "rich teak",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Scandinavian Spindle Headboard Queen Bed",
    category: "bed",
    description: "Airy Nordic spindle dowel headboard crafted from solid birch wood.",
    price: 22499,
    roomSize: "medium",
    material: "birch wood",
    color: "blonde wood",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Luxury Emerald Green Velvet King Bed",
    category: "bed",
    description: "Statement wingback headboard with vertical channel stitching and brushed gold base.",
    price: 29999,
    roomSize: "large",
    material: "velvet & metal",
    color: "emerald green",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Floating Oak Bed Frame with LED Backlight",
    category: "bed",
    description: "Futuristic cantilever floating platform bed with built-in warm ambient LED underglow.",
    price: 33999,
    roomSize: "large",
    material: "oak veneer & steel",
    color: "natural oak",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Mid-Century Cane Webbing Rattan Queen Bed",
    category: "bed",
    description: "Solid ash wood frame with handwoven hexagonal cane webbing insert.",
    price: 26499,
    roomSize: "medium",
    material: "ash wood & natural cane",
    color: "warm honey",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Minimalist High-Gloss White King Bed",
    category: "bed",
    description: "Ultra-clean high gloss finish king size bed frame with recessed base.",
    price: 21999,
    roomSize: "large",
    material: "engineered wood",
    color: "gloss white",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Rustic Reclaimed Pine Queen Canopy Four-Poster Bed",
    category: "bed",
    description: "Grand architectural four-poster canopy bed built from distressed solid pine timbers.",
    price: 38999,
    roomSize: "large",
    material: "reclaimed pine",
    color: "weathered grey",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Adjustable Electric Ergonomic Smart Bed Base",
    category: "bed",
    description: "Dual motor motorized bed base with zero-gravity mode, wireless remote, and anti-snore tilt.",
    price: 42999,
    roomSize: "medium",
    material: "reinforced steel & fabric",
    color: "dark heather",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Contemporary Tufted Linen Queen Platform Bed",
    category: "bed",
    description: "Padded linen fabric frame with solid wooden slats that require no box spring.",
    price: 18999,
    roomSize: "small",
    material: "linen & pine",
    color: "oatmeal",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Modern Slat Back Walnut Queen Bed",
    category: "bed",
    description: "Horizontal slatted headboard crafted with rich American walnut veneers.",
    price: 25999,
    roomSize: "medium",
    material: "walnut & hardwood",
    color: "dark walnut",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Compact Studio Single Bed with 2 Bottom Drawers",
    category: "bed",
    description: "Ideal space-efficient single cot with roller storage drawers for compact bedrooms.",
    price: 11499,
    roomSize: "small",
    material: "engineered wood",
    color: "matte oak",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1540518614846-7ede433c4ef2?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Curved Bouclé Upholstered King Size Bed",
    category: "bed",
    description: "Soft cocooning curved headboard upholstered in premium tactile cream bouclé.",
    price: 34999,
    roomSize: "large",
    material: "bouclé fabric",
    color: "warm cream",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Solid Mango Wood Chevron Queen Bed",
    category: "bed",
    description: "Geometric handcrafted chevron pattern headboard in warm golden mango wood.",
    price: 27999,
    roomSize: "medium",
    material: "mango wood",
    color: "golden natural",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Luxury Leatherette Button-Tufted King Bed",
    category: "bed",
    description: "Regal high-back padded headboard in stain-resistant premium vegan leather.",
    price: 28499,
    roomSize: "large",
    material: "vegan leather & wood",
    color: "dark mocha",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Industrial Steel Tube Queen Bed Frame",
    category: "bed",
    description: "Heavy-gauge reinforced iron frame with vintage curved spindle accents.",
    price: 13999,
    roomSize: "small",
    material: "iron steel",
    color: "matte gunmetal",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1540518614846-7ede433c4ef2?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Japanese Tatami Mat Floor Bed Platform",
    category: "bed",
    description: "Natural rush grass tatami mats over solid cedar low frame for clean healthy sleep.",
    price: 23999,
    roomSize: "small",
    material: "cedar & natural rush",
    color: "natural straw",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Scandinavian Natural Pine Double Bed",
    category: "bed",
    description: "Sturdy sustainable Scandinavian solid pine bed with slatted base support.",
    price: 14999,
    roomSize: "small",
    material: "solid pine",
    color: "light pine",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Modern Black Oak Queen Bed with Floating Nightstands",
    category: "bed",
    description: "Integrated extended headboard featuring matching dual floating bedside shelves.",
    price: 32999,
    roomSize: "large",
    material: "black oak",
    color: "matte black oak",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Luxury Orthopedic Memory Foam Mattress (King)",
    category: "bed",
    description: "10-inch triple-layer high density memory foam mattress with breathable bamboo cover.",
    price: 16999,
    roomSize: "medium",
    material: "memory foam & bamboo",
    color: "white / grey",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Natural Organic Latex Pocket Spring Mattress (Queen)",
    category: "bed",
    description: "Zero motion transfer individually pocketed coil mattress with 100% natural latex top.",
    price: 19999,
    roomSize: "medium",
    material: "latex & pocket springs",
    color: "cream",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=80"
  },

  // ================= CHAIRS & RECLINERS (20 Products) =================
  {
    name: "Ergonomic Pro Mesh Office Chair",
    category: "chair",
    description: "High-back breathable mesh chair with adjustable lumbar support and 3D armrests.",
    price: 8499,
    roomSize: "small",
    material: "breathable mesh & nylon",
    color: "black",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1580481077197-2a6d4ee29415?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Executive Leather Swivel High-Back Chair",
    category: "chair",
    description: "Padded bonded leather managerial office chair with tilt-lock and heavy-duty steel base.",
    price: 12499,
    roomSize: "medium",
    material: "bonded leather",
    color: "dark brown",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Nordic Dining Chair Set (Pair of 2)",
    category: "chair",
    description: "Solid wood dining chairs with comfortable padded seat and curved backrest.",
    price: 9999,
    roomSize: "medium",
    material: "teak wood",
    color: "natural oak",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Mid-Century Velvet Accent Armchair",
    category: "chair",
    description: "Chic occasional lounge chair with gold-dipped metal hairpin legs.",
    price: 7999,
    roomSize: "small",
    material: "velvet & metal",
    color: "emerald green",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Minimalist Molded Eiffel Chair Set (Set of 4)",
    category: "chair",
    description: "Iconic molded shell dining chairs with wooden legs and wire bracing.",
    price: 8999,
    roomSize: "small",
    material: "polypropylene & beech wood",
    color: "matte white",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Rocking Lounge Chair with Ottoman Set",
    category: "chair",
    description: "Smooth nursery & reading rocker with padded armrests and matching footstool.",
    price: 13999,
    roomSize: "medium",
    material: "fabric & rubberwood",
    color: "cream",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1580481077197-2a6d4ee29415?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Ergonomic Gaming Chair with Footrest",
    category: "chair",
    description: "Racing style ergonomic chair with 180° recline, headrest pillow, and retractable footrest.",
    price: 14499,
    roomSize: "medium",
    material: "PU leather & steel",
    color: "carbon black & red",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Modern Counter Height Bar Stools (Pair of 2)",
    category: "chair",
    description: "Swivel bar stools with footrest ring and hydraulic height adjustment.",
    price: 6499,
    roomSize: "small",
    material: "chrome & faux leather",
    color: "matte grey",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Scandinavian Birchwood Curved Reading Chair",
    category: "chair",
    description: "Layer-glued bent birch frame with gentle flex for supreme back relaxation.",
    price: 6999,
    roomSize: "small",
    material: "bentwood & cotton",
    color: "off-white",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Luxury Full Reclining Power Leather Armchair",
    category: "chair",
    description: "Motorized power recliner with heated massage function and side storage pouch.",
    price: 24999,
    roomSize: "large",
    material: "top grain leather",
    color: "saddle brown",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1580481077197-2a6d4ee29415?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Rattan Papasan Bowl Lounge Chair",
    category: "chair",
    description: "Classic round bowl papasan chair with 45-inch ultra plush microplush cushion.",
    price: 8499,
    roomSize: "small",
    material: "natural rattan",
    color: "warm natural",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Minimalist Wire Diamond Accent Chair",
    category: "chair",
    description: "Sculptural chrome geometric wire chair with genuine leather seat pad.",
    price: 7499,
    roomSize: "small",
    material: "welded steel & leather",
    color: "chrome / black",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Solid Teak & Hand-Woven Cane Accent Chair",
    category: "chair",
    description: "Iconic Chandigarh Pierre Jeanneret inspired V-leg cane armchair.",
    price: 11999,
    roomSize: "small",
    material: "solid teak & natural cane",
    color: "dark teak",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Industrial Swivel Draughtsman High Stool",
    category: "chair",
    description: "Height adjustable screw stool with solid wood tractor seat and cast iron base.",
    price: 5499,
    roomSize: "small",
    material: "cast iron & pine",
    color: "rustic steel",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Bouclé Swivel Accent Barrel Chair",
    category: "chair",
    description: "Smooth 360-degree silent swivel tub chair in textured white teddy bouclé.",
    price: 12999,
    roomSize: "small",
    material: "bouclé & metal swivel",
    color: "ivory cream",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Ergonomic Saddle Knee Stool for Posture Correction",
    category: "chair",
    description: "Angled kneeling chair designed to relieve spine compression and improve posture.",
    price: 6999,
    roomSize: "small",
    material: "birch wood & foam",
    color: "black / birch",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1580481077197-2a6d4ee29415?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Modern Outdoor Folding Deck Sun Lounger",
    category: "chair",
    description: "Adjustable 5-position teak wood pool and balcony sun lounger with wheels.",
    price: 10499,
    roomSize: "medium",
    material: "solid teak wood",
    color: "honey oil finish",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Velvet Shell Vanity Stool with Gold Base",
    category: "chair",
    description: "Scalloped seashell backrest vanity chair ideal for dressing tables and bedrooms.",
    price: 5299,
    roomSize: "small",
    material: "velvet & brass",
    color: "blush pink",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Heavy Duty High Weight Capacity Mesh Executive Chair",
    category: "chair",
    description: "Reinforced aluminum alloy wheelbase with double tier lumbar back support.",
    price: 13499,
    roomSize: "medium",
    material: "nylon & aluminum",
    color: "slate grey",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1580481077197-2a6d4ee29415?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Mid-Century Modern Tan Leather Club Chair",
    category: "chair",
    description: "Deep lounge armchair with solid oak frame and top-grain saddle leather upholstery.",
    price: 17499,
    roomSize: "small",
    material: "genuine leather & oak",
    color: "cognac tan",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80"
  },

  // ================= DESKS & WORKSTATIONS (20 Products) =================
  {
    name: "Minimalist Solid Wood Study Desk",
    category: "desk",
    description: "Compact study desk with integrated cable management slot and single drawer.",
    price: 8999,
    roomSize: "small",
    material: "oak wood",
    color: "natural oak",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Dual-Motor Electric Height Adjustable Standing Desk",
    category: "desk",
    description: "Smooth sit-stand desk with 4 memory height presets and anti-collision sensor.",
    price: 18999,
    roomSize: "medium",
    material: "steel & engineered wood",
    color: "matte white",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "L-Shaped Corner Gaming & Office Desk",
    category: "desk",
    description: "Space-maximizing corner desk with monitor shelf, headphone hook and cup holder.",
    price: 14499,
    roomSize: "medium",
    material: "carbon fiber & iron",
    color: "carbon black",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Tempered Glass Top Writing Desk",
    category: "desk",
    description: "Modern architectural desk with heavy shatterproof glass and gold steel trestle legs.",
    price: 11999,
    roomSize: "small",
    material: "glass & steel",
    color: "gold / clear",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Solid Sheesham Executive Office Table with Drawers",
    category: "desk",
    description: "Stately executive work table with three locking storage drawers and bookshelf.",
    price: 16999,
    roomSize: "large",
    material: "sheesham wood",
    color: "teak finish",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Foldable Wall-Mounted Drop-Leaf Study Desk",
    category: "desk",
    description: "Floating fold-down wall desk perfect for ultra-compact micro-apartments.",
    price: 5499,
    roomSize: "small",
    material: "engineered wood",
    color: "white & pine",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Nordic Ladder Desk with Overhead Bookshelf",
    category: "desk",
    description: "Leaning ladder desk with two spacious open display shelves above work surface.",
    price: 10499,
    roomSize: "small",
    material: "solid pine & MDF",
    color: "white & oak",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Dual Motor Live Edge Walnut Executive Workstation",
    category: "desk",
    description: "Solid natural live-edge American walnut wood tabletop on heavy-duty electric standing frame.",
    price: 24999,
    roomSize: "large",
    material: "live edge walnut",
    color: "walnut",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Industrial Steel Pipe Frame Rustic Desk",
    category: "desk",
    description: "Heavy reclaimed timber desk with black industrial cast pipe legs and footrest rail.",
    price: 12999,
    roomSize: "medium",
    material: "reclaimed pine & iron",
    color: "rustic brown",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Scandinavian White Oak 2-Drawer Compact Workstation",
    category: "desk",
    description: "Clean rounded corner desk with felt-lined drawers and integrated cable trough.",
    price: 9499,
    roomSize: "small",
    material: "white oak",
    color: "light oak",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "High-Gloss Black Executive Manager Desk",
    category: "desk",
    description: "Contemporary luxury desk with lockable side pedestal drawers and leather desktop blotter.",
    price: 21999,
    roomSize: "large",
    material: "high-gloss MDF",
    color: "piano black",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Compact Portable Laptop Rolling Cart Desk",
    category: "desk",
    description: "Mobile height adjustable laptop cart with locking casters for bed or couch working.",
    price: 3999,
    roomSize: "small",
    material: "steel & MDF",
    color: "walnut / black",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Mid-Century Modern Acorn Finish Writing Desk",
    category: "desk",
    description: "Iconic angled tapered legs with two flush utility drawers and brass bar pulls.",
    price: 13999,
    roomSize: "small",
    material: "solid eucalyptus & walnut",
    color: "warm acorn",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Large Dual-Person Shared Office Workstation",
    category: "desk",
    description: "Extra long 78-inch double computer desk with central sharing bookshelf divider.",
    price: 17499,
    roomSize: "large",
    material: "engineered wood & steel",
    color: "vintage oak",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Modern Art Drafting & Drawing Table with Tilt Top",
    category: "desk",
    description: "Adjustable angle drafting tabletop (0-60°) with pencil ledge and storage trays.",
    price: 11499,
    roomSize: "medium",
    material: "tempered glass & steel",
    color: "silver / blue glass",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Minimalist Floating Wall Mounted Computer Desk",
    category: "desk",
    description: "Space saving wall hanging desk with wire pass-through and hidden internal shelves.",
    price: 6499,
    roomSize: "small",
    material: "engineered wood",
    color: "matte charcoal",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Solid Teak Wood Compact Study Table",
    category: "desk",
    description: "Heavy solid plantation teak wood desk with soft-close smooth roller drawer.",
    price: 15499,
    roomSize: "small",
    material: "solid teak wood",
    color: "natural teak",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Ergonomic Curved Front Gaming Desk with RGB Lighting",
    category: "desk",
    description: "Carbon fiber textured bevel front desk with ambient RGB LED lighting modes.",
    price: 13999,
    roomSize: "medium",
    material: "carbon fiber & steel",
    color: "stealth black",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Bamboo Top Dual-Motor Standing Desk",
    category: "desk",
    description: "Eco-friendly natural sustainable bamboo solid top on heavy motorized steel frame.",
    price: 19999,
    roomSize: "medium",
    material: "natural bamboo & steel",
    color: "caramelized bamboo",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Rustic Farmhouse Secretary Desk with Hutch",
    category: "desk",
    description: "Fold-down writing bureau with letter mail slots and lower 2-door cabinet storage.",
    price: 18499,
    roomSize: "medium",
    material: "distressed pine",
    color: "antique white & oak",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=900&q=80"
  },

  // ================= TABLES & DINING (20 Products) =================
  {
    name: "Modern 4-Seater Solid Wood Dining Table",
    category: "table",
    description: "Sturdy hardwood dining table perfect for modern family dining and hosting.",
    price: 16999,
    roomSize: "medium",
    material: "solid wood",
    color: "walnut",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Tempered Glass Minimal Coffee Table",
    category: "table",
    description: "Sleek round coffee table with shatterproof tempered glass and matte gold frame.",
    price: 7499,
    roomSize: "small",
    material: "glass & metal",
    color: "brass / clear",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Extendable 6-to-8 Seater Family Dining Table",
    category: "table",
    description: "Smart hidden butterfly leaf mechanism expands table for dinner parties and gatherings.",
    price: 26499,
    roomSize: "large",
    material: "oak veneer & solid pine",
    color: "light oak",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Marble Top Nesting Coffee Tables (Set of 2)",
    category: "table",
    description: "Set of 2 nesting accent tables with genuine Italian carrara marble tops and gold frames.",
    price: 12999,
    roomSize: "small",
    material: "marble & iron",
    color: "white marble / gold",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Solid Sheesham Bedside End Table",
    category: "table",
    description: "Compact nightstand with drawer and lower open shelf for books and lamps.",
    price: 4299,
    roomSize: "small",
    material: "sheesham wood",
    color: "natural honey",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1565183997392-2f6f122e5912?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Industrial Raw Steel & Pine Dining Table",
    category: "table",
    description: "Handcrafted rustic farmhouse dining table with heavy industrial trestle legs.",
    price: 21999,
    roomSize: "large",
    material: "distressed pine & steel",
    color: "rustic pine",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Mid-Century Fluted Wood Console Table",
    category: "table",
    description: "Narrow hallway and entryway console with fluted wood facade and 2 hidden push drawers.",
    price: 10999,
    roomSize: "small",
    material: "ash wood",
    color: "warm oak",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1574359411659-15573a27fd0c?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Scandinavian Oval Center Coffee Table",
    category: "table",
    description: "Smooth organic oval coffee table with solid turned wooden dowel legs.",
    price: 8499,
    roomSize: "medium",
    material: "birch wood",
    color: "blonde wood",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Round Pedestal Tulip Dining Table (4-Seater)",
    category: "table",
    description: "Iconic mid-century modern circular pedestal table with chip-resistant lacquer top.",
    price: 15999,
    roomSize: "small",
    material: "cast aluminum & MDF",
    color: "gloss white",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Live Edge Acacia Wood 6-Seater Dining Table",
    category: "table",
    description: "Natural organic live edge acacia timber slab with matte black industrial spider legs.",
    price: 28999,
    roomSize: "large",
    material: "solid acacia & iron",
    color: "natural acacia",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Lift-Top Multifunctional Storage Coffee Table",
    category: "table",
    description: "Pneumatic spring lift mechanism raises tabletop to working height with hidden storage.",
    price: 9999,
    roomSize: "small",
    material: "engineered wood",
    color: "rustic walnut",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Solid White Marble 6-Seater Luxury Dining Table",
    category: "table",
    description: "Heavy polished natural Italian Carrara marble tabletop on brushed bronze fluted pedestal base.",
    price: 46999,
    roomSize: "large",
    material: "genuine marble & bronze",
    color: "carrara white / bronze",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "C-Shaped Sliding Sofa Side End Table",
    category: "table",
    description: "Clever C-frame table slides under sofa or bed for laptop work and coffee mugs.",
    price: 3299,
    roomSize: "small",
    material: "steel & oak",
    color: "black / oak",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1565183997392-2f6f122e5912?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Outdoor Cast Aluminum Patio Dining Table",
    category: "table",
    description: "Rustproof weather-resistant outdoor dining table with central umbrella hole.",
    price: 17999,
    roomSize: "medium",
    material: "cast aluminum",
    color: "antique bronze",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Fluted Drum Round Accent Side Table",
    category: "table",
    description: "Sculptural round cylinder end table with vertical ribbed tambour wood detail.",
    price: 6799,
    roomSize: "small",
    material: "ash veneer",
    color: "natural beige",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1574359411659-15573a27fd0c?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Modern Glass Top 4-Seater Square Dining Table",
    category: "table",
    description: "Thick bevelled safety glass table with sculptural criss-cross solid beech legs.",
    price: 13499,
    roomSize: "small",
    material: "tempered glass & beech",
    color: "clear / natural beech",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Japanese Minimalist Floor Chabu-Dai Coffee Table",
    category: "table",
    description: "Low floor tea and dining table with foldable legs for easy storage.",
    price: 5499,
    roomSize: "small",
    material: "solid pine wood",
    color: "dark walnut",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Industrial Concrete Finish Center Coffee Table",
    category: "table",
    description: "Modern architectural minimalist concrete composite cocktail table on black metal frame.",
    price: 11499,
    roomSize: "medium",
    material: "engineered concrete & iron",
    color: "raw cement grey",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Terrazzo Stone Round Bistro Cafe Table",
    category: "table",
    description: "Multicolor chip natural terrazzo stone top with heavy cast iron pedestal base.",
    price: 9499,
    roomSize: "small",
    material: "terrazzo & cast iron",
    color: "white terrazzo",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1574359411659-15573a27fd0c?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Solid Oak 8-Seater Grand Banquet Dining Table",
    category: "table",
    description: "Massive 8-foot solid European white oak family table with chamfered edge profile.",
    price: 39999,
    roomSize: "large",
    material: "solid white oak",
    color: "natural white oak",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=900&q=80"
  },

  // ================= WARDROBES & STORAGE (20 Products) =================
  {
    name: "3-Door Modern Engineered Wardrobe",
    category: "wardrobe",
    description: "Spacious 3-door wardrobe with built-in full length mirror and hanging organizers.",
    price: 22499,
    roomSize: "medium",
    material: "engineered wood",
    color: "white & oak",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "2-Door Sliding Mirror Glass Wardrobe",
    category: "wardrobe",
    description: "Smooth top-roller sliding doors with tinted mirror panels, ideal for space saving.",
    price: 27999,
    roomSize: "medium",
    material: "engineered wood & glass",
    color: "matte grey / mirror",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Solid Teak Wood 4-Door Heritage Almirah",
    category: "wardrobe",
    description: "Traditional solid teak wood wardrobe featuring internal locker and brass hardware.",
    price: 38999,
    roomSize: "large",
    material: "solid teak wood",
    color: "rich teak",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Compact 2-Door Single Bedroom Cupboard",
    category: "wardrobe",
    description: "Space-saving wardrobe with hanging rod and bottom pullout storage drawers.",
    price: 11999,
    roomSize: "small",
    material: "engineered wood",
    color: "clean white",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Modular Open Concept Walk-in Closet Organizer",
    category: "wardrobe",
    description: "Customizable open metal & wood closet system with shoe racks and double hanging rails.",
    price: 16999,
    roomSize: "large",
    material: "industrial steel & oak",
    color: "black / oak",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Multipurpose Storage Cabinet with Shelves",
    category: "wardrobe",
    description: "Versatile 4-tier storage unit for clothes, linen, books, and home accessories.",
    price: 8999,
    roomSize: "small",
    material: "MDF & metal legs",
    color: "walnut finish",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Matte Black Modern 3-Door Armoire",
    category: "wardrobe",
    description: "Architectural wardrobe with soft-close European hinges and recessed gold pulls.",
    price: 25999,
    roomSize: "medium",
    material: "MDF & aluminium",
    color: "matte charcoal",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Scandinavian 2-Drawer Tallboy Dresser & Wardrobe",
    category: "wardrobe",
    description: "Tall multi-storage chest with clothing hanging section and 4 deep roller drawers.",
    price: 17499,
    roomSize: "small",
    material: "birch & pine",
    color: "natural birch",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "6-Door Master Bedroom Modular Wardrobe with Loft",
    category: "wardrobe",
    description: "Floor-to-ceiling comprehensive storage system with top seasonal lofts and glass display.",
    price: 49999,
    roomSize: "large",
    material: "marine grade MDF",
    color: "champagne / walnut",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Mid-Century Cane Webbing 2-Door Armoire",
    category: "wardrobe",
    description: "Boho chic wardrobe with woven rattan door panels and brass bar pulls.",
    price: 23999,
    roomSize: "medium",
    material: "solid oak & natural cane",
    color: "warm oak",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Modern Floating Wall Shoe & Entryway Cabinet",
    category: "wardrobe",
    description: "Slim 3-tier flip drawer shoe rack holding up to 18 pairs with top key tray.",
    price: 6499,
    roomSize: "small",
    material: "engineered wood",
    color: "matte white",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Minimalist Industrial Open Steel Garment Rack with Wood Shelves",
    category: "wardrobe",
    description: "Freestanding heavy garment clothes rail with 3 bottom wire shelves.",
    price: 5299,
    roomSize: "small",
    material: "carbon steel & oak",
    color: "matte black",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Solid Sheesham 3-Door Wooden Wardrobe",
    category: "wardrobe",
    description: "Premium Indian rosewood almirah with traditional mortise & tenon joinery.",
    price: 34999,
    roomSize: "large",
    material: "sheesham wood",
    color: "dark honey finish",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Modern 4-Drawer Bedroom Chest of Drawers",
    category: "wardrobe",
    description: "Spacious clothing dresser with soft-close undermount ball-bearing glides.",
    price: 13999,
    roomSize: "small",
    material: "engineered wood",
    color: "nordic grey",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Smoked Glass 2-Door Luxury Designer Wardrobe",
    category: "wardrobe",
    description: "Translucent smoked tempered glass doors with internal motion-activated sensor LED strips.",
    price: 36999,
    roomSize: "medium",
    material: "aluminum & smoked glass",
    color: "charcoal & bronze",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Foldable Portable Fabric Wardrobe with Steel Frame",
    category: "wardrobe",
    description: "Lightweight non-woven fabric dustproof zippered almirah for temporary rental stays.",
    price: 2999,
    roomSize: "small",
    material: "steel pipe & non-woven fabric",
    color: "navy blue",
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Scandinavian White Oak Sideboard Credenza",
    category: "wardrobe",
    description: "Multi-functional dining and living room storage buffet with 3 doors and adjustable shelves.",
    price: 19499,
    roomSize: "medium",
    material: "solid oak & veneer",
    color: "natural oak",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Corner Space-Saving 2-Door Wardrobe",
    category: "wardrobe",
    description: "L-corner specialized wardrobe unit designed to turn dead corners into functional storage.",
    price: 21499,
    roomSize: "small",
    material: "MDF",
    color: "white & walnut",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Industrial Steel 2-Door Office Locker Cabinet",
    category: "wardrobe",
    description: "Retro vintage metal locker storage cabinet with ventilation louvers and cam locks.",
    price: 9999,
    roomSize: "small",
    material: "cold-rolled steel",
    color: "matte army green",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Contemporary 5-Tier Bookshelf & Storage Display Unit",
    category: "wardrobe",
    description: "Geometric asymmetrical open bookshelf for books, plants, decor, and storage boxes.",
    price: 7999,
    roomSize: "small",
    material: "engineered wood & steel",
    color: "rustic oak / black",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=900&q=80"
  },

  // ================= KIDS & CHILD FURNITURE (20 Products - NEW) =================
  {
    name: "Safari Adventure Solid Pine Kids Bunk Bed with Safety Rails",
    category: "kids",
    description: "Sturdy non-toxic solid pine twin-over-twin bunk bed with rounded edges and ladder.",
    price: 19999,
    roomSize: "medium",
    material: "solid pine wood",
    color: "natural pine / white",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Ergonomic Height-Adjustable Kids Study Desk & Chair Set",
    category: "kids",
    description: "Grows with your child (ages 4-14) with tiltable reading surface, LED eye-care lamp and drawer.",
    price: 8999,
    roomSize: "small",
    material: "steel & non-toxic ABS",
    color: "pastel sky blue",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Montessori Low Bookshelf & Toy Organizer Cabinet",
    category: "kids",
    description: "Child-accessible 3-tier forward-facing book display with 6 removable pastel toy bins.",
    price: 6499,
    roomSize: "small",
    material: "birch plywood & plastic",
    color: "natural birch / pastel",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Cloud 9 Solid Wood Toddler Bed with Dual Guardrails",
    category: "kids",
    description: "Low-to-ground safe transition toddler bed with cloud cutout headboard and rounded safety corners.",
    price: 9499,
    roomSize: "small",
    material: "solid rubberwood",
    color: "clean white",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Nordic Pastel Kids Activity Play Table with 2 Chairs",
    category: "kids",
    description: "Durable craft and drawing table with double-sided whiteboard & chalkboard surface and paper roll.",
    price: 5999,
    roomSize: "small",
    material: "MDF & solid beech",
    color: "mint green & natural",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Junior Ergonomic Swivel Study Chair with Lumbar Support",
    category: "kids",
    description: "Breathable mesh backrest chair with gas-lift height adjustment for school children.",
    price: 4299,
    roomSize: "small",
    material: "breathable mesh & nylon",
    color: "soft lavender pink",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1580481077197-2a6d4ee29415?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Montessori House-Shaped Wooden Floor Bed Frame",
    category: "kids",
    description: "Fun Scandinavian playhouse bed frame that encourages toddler independence and cozy sleep.",
    price: 11999,
    roomSize: "medium",
    material: "solid pine wood",
    color: "natural pine",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Castle Princess Single Themed Bed with Storage Trundle",
    category: "kids",
    description: "Magical fairy-tale single bed with upholstered velvet headboard and pullout sleepover trundle.",
    price: 18499,
    roomSize: "medium",
    material: "engineered wood & velvet",
    color: "powder pink & gold",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Solid Birch 3-in-1 Convertible Baby Crib to Toddler Bed",
    category: "kids",
    description: "Eco-friendly non-toxic teething rail nursery crib with 3 mattress height levels.",
    price: 16499,
    roomSize: "small",
    material: "solid birch wood",
    color: "warm natural",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Space Explorer Kids Study Desk with Corkboard & Bookstand",
    category: "kids",
    description: "Ergonomic study desk with built-in pin board, magnetic book holder, and pencil organizers.",
    price: 9999,
    roomSize: "small",
    material: "engineered wood",
    color: "space navy & white",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "2-Door Pastel Blue Children's Clothes Wardrobe",
    category: "kids",
    description: "Lower height wardrobe with soft-close anti-pinch doors and low hanging rod for kids to self-dress.",
    price: 13999,
    roomSize: "small",
    material: "MDF with non-toxic finish",
    color: "pastel blue & oak",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Foldable Modular Kids Play Couch & Fort Builder (4-Piece)",
    category: "kids",
    description: "High-density polyurethane foam play sofa that transforms into forts, castles, slides, and guest beds.",
    price: 10999,
    roomSize: "medium",
    material: "washable microsuede & foam",
    color: "forest moss green",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Treehouse Loft Bed with Integrated Lower Study Workstation",
    category: "kids",
    description: "High loft bed maximizing vertical space with integrated desk, bookshelf, and ladder below.",
    price: 26999,
    roomSize: "medium",
    material: "solid wood & steel",
    color: "white & natural wood",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Children's Double-Sided Wooden Art Easel & Craft Station",
    category: "kids",
    description: "Magnetic whiteboard on one side and chalkboard on the other with paper roll dispenser and paint pots.",
    price: 4499,
    roomSize: "small",
    material: "natural pine",
    color: "natural pine",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Cozy Animals Upholstered Kids Bean Bag & Pouf",
    category: "kids",
    description: "Super soft teddy fleece bean bag chair with childproof double-locking safety zippers.",
    price: 3499,
    roomSize: "small",
    material: "teddy fleece & EPS beads",
    color: "warm caramel",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Nursery Glider Rocking Chair with Storage Pockets",
    category: "kids",
    description: "Ultra-quiet gliding nursing chair with padded armrests and lumbar pillow for parents and baby.",
    price: 15999,
    roomSize: "small",
    material: "water-repellent linen & steel",
    color: "heather grey",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1580481077197-2a6d4ee29415?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Double Decker Storage Bunk Bed with Pullout Trundle (Sleeps 3)",
    category: "kids",
    description: "Twin-over-full bunk bed featuring under-bed rollaway trundle bed and built-in staircase storage drawers.",
    price: 32999,
    roomSize: "large",
    material: "solid hardwood",
    color: "espresso walnut",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Kids Active Wobble Stool for Focus & Balance",
    category: "kids",
    description: "Curved non-slip rubber base allows gentle rocking and movement to improve active classroom focus.",
    price: 2999,
    roomSize: "small",
    material: "polypropylene & silicone",
    color: "vibrant teal",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Kids 6-Drawer Rolling Toy Storage Cart",
    category: "kids",
    description: "Multicolor rainbow storage organizer cart with lockable caster wheels for toys and art supplies.",
    price: 4999,
    roomSize: "small",
    material: "chrome frame & plastic",
    color: "rainbow pastel",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Montessori Front-Facing 4-Tier Kids Reading Nook Bookcase",
    category: "kids",
    description: "Deep canvas slings and bottom wooden bins displaying book covers facing forward to invite reading.",
    price: 4799,
    roomSize: "small",
    material: "solid pine & heavy canvas",
    color: "natural / cream",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=900&q=80"
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  
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

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
