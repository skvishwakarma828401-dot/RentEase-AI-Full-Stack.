require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const products = [
  // ================= SOFAS & SEATING (10 Products) =================
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
    name: "Minimalist Cream Bouclé Sofa",
    category: "sofa",
    description: "Curved plush bouclé textured sofa for high-aesthetic living spaces.",
    price: 24999,
    roomSize: "medium",
    material: "bouclé fabric",
    color: "cream white",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Cozy Loveseat Recliner",
    category: "sofa",
    description: "Dual manual reclining loveseat with pillow-top arms and lumbar support.",
    price: 19499,
    roomSize: "small",
    material: "microfiber",
    color: "charcoal",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Contemporary 3-Seater Charcoal Sofa",
    category: "sofa",
    description: "Sleek low-profile track arm sofa with pocket coil high density foam seating.",
    price: 17999,
    roomSize: "medium",
    material: "polyester blend",
    color: "dark grey",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1512212621149-107ffe572d2f?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Compact Convertible Studio Sofa Bed",
    category: "sofa",
    description: "Multi-functional click-clack sofa that easily folds out into a comfy guest bed.",
    price: 13999,
    roomSize: "small",
    material: "fabric",
    color: "navy blue",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Nordic Modular 4-Piece Sectional",
    category: "sofa",
    description: "Configurable modular sofa pieces with washable slipcovers and feather-blend fill.",
    price: 32999,
    roomSize: "large",
    material: "cotton linen",
    color: "sand beige",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Retro Mustard Yellow Accent Loveseat",
    category: "sofa",
    description: "Mid-century modern 2-seater with tapered wooden legs and bold statement fabric.",
    price: 16499,
    roomSize: "small",
    material: "velvet",
    color: "mustard yellow",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=900&q=80"
  },

  // ================= CHAIRS & SEATING (8 Products) =================
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
    name: "Executive Leather Swivel Chair",
    category: "chair",
    description: "Plush bonded leather desk chair with pneumatic height adjustment and smooth caster wheels.",
    price: 11999,
    roomSize: "medium",
    material: "bonded leather",
    color: "espresso brown",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=900&q=80"
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
    name: "Vintage Industrial Leather Club Chair",
    category: "chair",
    description: "Hand-stitched leather armchair with deep seat for reading nooks and study rooms.",
    price: 14999,
    roomSize: "medium",
    material: "top-grain leather",
    color: "tan",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Modern Kitchen Counter Bar Stools (Pair)",
    category: "chair",
    description: "Adjustable height swivel bar stools with footrest and faux leather upholstery.",
    price: 6499,
    roomSize: "small",
    material: "steel & faux leather",
    color: "matte black",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Cozy Rocking Armchair with Cushion",
    category: "chair",
    description: "Gentle glide rocking chair with soft boucle cushion and solid walnut runners.",
    price: 10499,
    roomSize: "medium",
    material: "fabric & walnut",
    color: "oatmeal",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=900&q=80"
  },

  // ================= BEDS & BEDROOM (8 Products) =================
  {
    name: "Queen Comfort Bed with Storage",
    category: "bed",
    description: "Solid hardwood queen bed frame with hydraulic under-bed storage space.",
    price: 18999,
    roomSize: "medium",
    material: "sheesham wood",
    color: "oak",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "King Luxury Upholstered Bed",
    category: "bed",
    description: "Grand king-size bed with tufted headboard and reinforced wooden slat foundation.",
    price: 26999,
    roomSize: "large",
    material: "fabric & pine",
    color: "charcoal",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Minimalist Japanese Low Platform Bed",
    category: "bed",
    description: "Zen inspired low-height platform bed frame crafted from solid treated acacia wood.",
    price: 16499,
    roomSize: "small",
    material: "acacia wood",
    color: "natural walnut",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Solid Teak Wood Queen Bed with Headboard",
    category: "bed",
    description: "Durable handcrafted solid wood bed frame with slat headboard for master bedrooms.",
    price: 22999,
    roomSize: "medium",
    material: "teak wood",
    color: "honey brown",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Contemporary Low-Profile Queen Bed",
    category: "bed",
    description: "Modern bedroom center piece with seamless upholstered side rails and padded headboard.",
    price: 19999,
    roomSize: "medium",
    material: "linen & engineered wood",
    color: "warm grey",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Scandinavian Single Bed for Guest Room",
    category: "bed",
    description: "Space-saving clean single bed with rounded corners and sturdy birch wood slats.",
    price: 9999,
    roomSize: "small",
    material: "birch wood",
    color: "natural",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "4-Drawer King Storage Bed Frame",
    category: "bed",
    description: "Heavy-duty king bed featuring four smooth glide built-in roller drawers.",
    price: 28499,
    roomSize: "large",
    material: "solid wood & steel",
    color: "dark walnut",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Royal Velvet Tufted King Bed Frame",
    category: "bed",
    description: "Opulent tall wingback bed frame lined in plush stain-resistant velvet fabric.",
    price: 31999,
    roomSize: "large",
    material: "velvet & solid pine",
    color: "midnight blue",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=900&q=80"
  },

  // ================= DESKS & WORKSPACES (8 Products) =================
  {
    name: "Minimalist Study Desk with Drawer",
    category: "desk",
    description: "Clean work-from-home desk with wire management grommet and storage drawer.",
    price: 6999,
    roomSize: "small",
    material: "engineered wood",
    color: "walnut",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Executive Height-Adjustable Standing Desk",
    category: "desk",
    description: "Motorized sit-stand ergonomic desk with memory height presets and dual motors.",
    price: 18499,
    roomSize: "medium",
    material: "solid oak & steel",
    color: "natural oak",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Compact WFH Home Office Table",
    category: "desk",
    description: "Slim computer desk designed specifically for tight bedroom nooks and studios.",
    price: 4999,
    roomSize: "small",
    material: "MDF & metal legs",
    color: "matte black / wood",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Corner L-Shaped Gaming & Work Desk",
    category: "desk",
    description: "Spacious corner workstation with monitor shelf, headset hook, and cable tray.",
    price: 13499,
    roomSize: "large",
    material: "carbon fiber texture & steel",
    color: "black",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Modern Tempered Glass Study Table",
    category: "desk",
    description: "Airy translucent desk with heavy gauge shatterproof glass and brushed brass frame.",
    price: 11499,
    roomSize: "small",
    material: "glass & steel",
    color: "gold / clear",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Solid Sheesham Wood Office Desk with Cabinets",
    category: "desk",
    description: "Heirloom grade solid wood office table with three locking utility drawers.",
    price: 17999,
    roomSize: "medium",
    material: "solid sheesham",
    color: "teak finish",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Wall-Mounted Drop Leaf Folding Desk",
    category: "desk",
    description: "Space-saving folding desk that mounts to wall with internal shelving organizers.",
    price: 5499,
    roomSize: "small",
    material: "engineered wood",
    color: "white",
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Dual Motor Solid Walnut Executive Workstation",
    category: "desk",
    description: "Hand-poured epoxy live-edge walnut desktop atop an ultra-quiet electric lifting base.",
    price: 24999,
    roomSize: "large",
    material: "live edge walnut",
    color: "walnut",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80"
  },

  // ================= TABLES & DINING (8 Products) =================
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

  // ================= WARDROBES & STORAGE (8 Products) =================
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
  }
];

const User = require("./models/User");
const bcrypt = require("bcryptjs");

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  // Seed Products
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`Seeded ${products.length} products`);

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
