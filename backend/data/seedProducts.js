const seedProducts = [
  {
    name: "StyleLens Aviator Gold Luxe",
    category: "Premium Collection",
    price: 2499,
    oldPrice: 3999,
    rating: 4.9,
    reviewsCount: 128,
    image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583001809873-a128495da465?auto=format&fit=crop&w=800&q=80"
    ],
    stock: 28,
    description: "Crafted with 24K gold-plated titanium frames and precision-engineered polarized lenses. Provides ultimate glare reduction and 100% UV400 defense for the distinguished connoisseur.",
    badge: "BESTSELLER",
    features: ["24K Gold-Plated Frame", "Polarized Triacetate Lenses", "100% UV400 Protection", "Featherlight Aero-Titanium"],
    frameShape: "Aviator",
    frameMaterial: "Aero Titanium",
    lensColor: "24K Gold Mirror"
  },
  {
    name: "Noir Executive Polarized Wayfarer",
    category: "Men",
    price: 1499,
    oldPrice: 2499,
    rating: 4.8,
    reviewsCount: 94,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=800&q=80"
    ],
    stock: 45,
    description: "The quintessential modern staple. Deep piano black Italian handcrafted acetate with crystal-clear polarized smoky grey optics. Designed for boardroom presence and weekend escapes.",
    badge: "POPULAR",
    features: ["Handcrafted Italian Acetate", "Anti-Reflective Hydrophobic Coating", "Flexible Spring Hinges", "UVA/UVB Shield"],
    frameShape: "Wayfarer",
    frameMaterial: "Italian Acetate",
    lensColor: "Smoky Black"
  },
  {
    name: "Aura Amber Cat-Eye Elegance",
    category: "Women",
    price: 1899,
    oldPrice: 2999,
    rating: 4.9,
    reviewsCount: 86,
    image: "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80"
    ],
    stock: 22,
    description: "Sculpted with a gentle upward sweep to flatter high cheekbones. Infused with warm tortoiseshell tones and gradient champagne lenses for effortless Riviera sophistication.",
    badge: "TRENDING",
    features: ["Sculpted Acetate Temples", "Gradient Champagne Lenses", "Scratch-Resistant Coating", "100% UV400 Protection"],
    frameShape: "Cat Eye",
    frameMaterial: "Italian Acetate",
    lensColor: "Champagne Gradient"
  },
  {
    name: "Solstice Round Vintage Sun",
    category: "Unisex",
    price: 999,
    oldPrice: 1799,
    rating: 4.7,
    reviewsCount: 110,
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80"
    ],
    stock: 35,
    description: "An homage to 1960s bohemian poets. Lightweight circular wireframe in antique brass with deep emerald-tinted mineral lenses for relaxed yet artistic charm.",
    badge: "SALE",
    features: ["Ultralight Metal Alloys", "Adjustable Silicone Nose Pads", "High-Definition Contrast", "Anti-Glare Back Coating"],
    frameShape: "Round",
    frameMaterial: "Stainless Steel",
    lensColor: "Emerald Green"
  },
  {
    name: "Vanguard Matte Carbon Aviator",
    category: "Sunglasses",
    price: 1299,
    oldPrice: 1999,
    rating: 4.8,
    reviewsCount: 74,
    image: "https://images.unsplash.com/photo-1582142407894-ec85a1260a46?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1582142407894-ec85a1260a46?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80"
    ],
    stock: 40,
    description: "Engineered for high performance and driving clarity. Features stealth matte-black styling with polarized charcoal lenses that eliminate harsh highway reflections.",
    badge: "HOT",
    features: ["Driving Polarization", "Double-Bridge Architecture", "Matte Hydrophobic Finish", "Impact-Resistant Polycarbonate"],
    frameShape: "Aviator",
    frameMaterial: "Carbon Alloy",
    lensColor: "Charcoal Black"
  },
  {
    name: "Monarch 18K Heritage Edition",
    category: "Premium Collection",
    price: 4999,
    oldPrice: 7999,
    rating: 5.0,
    reviewsCount: 62,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80"
    ],
    stock: 12,
    description: "Our flagship silhouette. Hand-numbered limited release crafted with Japanese hand-polished Mazzucchelli acetate and custom 18K gold temple inlay logos.",
    badge: "EXCLUSIVE",
    features: ["Limited Production Run", "Japanese Hand-Polished Acetate", "18K Gold Inlay", "Custom Wooden Collector Case"],
    frameShape: "Square",
    frameMaterial: "Japanese Acetate",
    lensColor: "Midnight Polarized"
  },
  {
    name: "Lucent Clear Minimalist Square",
    category: "Unisex",
    price: 899,
    oldPrice: 1499,
    rating: 4.6,
    reviewsCount: 52,
    image: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80"
    ],
    stock: 50,
    description: "Contemporary crystal-clear silhouette that subtly highlights your facial features without overpowering your look. Perfect for screen time and sunlit strolls.",
    badge: "NEW",
    features: ["Ultra-Clear Bio Acetate", "Blue Light + UV Blocking", "Lightweight Ergonomic Bridge", "Durable 5-Barrel Hinges"],
    frameShape: "Square",
    frameMaterial: "Bio-Acetate",
    lensColor: "Crystal Gradient"
  },
  {
    name: "Savile Row Havana Spectacles",
    category: "Men",
    price: 1699,
    oldPrice: 2799,
    rating: 4.8,
    reviewsCount: 68,
    image: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=800&q=80"
    ],
    stock: 30,
    description: "British-inspired bespoke aesthetic with rich amber and espresso Havana marbled patterns. Pairs exceptionally well with tailored suits and smart casual wear.",
    badge: "POPULAR",
    features: ["Rich Havana Marbling", "Comfort-Curved Temples", "Anti-Reflective Lenses", "Corrosion Resistant"],
    frameShape: "Geometric",
    frameMaterial: "Italian Acetate",
    lensColor: "Sepia Brown"
  },
  {
    name: "Seraphina Rose Gold Butterfly",
    category: "Women",
    price: 2199,
    oldPrice: 3499,
    rating: 4.9,
    reviewsCount: 78,
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80"
    ],
    stock: 18,
    description: "An oversized statement piece adorned with sculpted rose gold titanium temples and soothing berry gradient lenses. Guaranteed to turn heads at sunset soirees.",
    badge: "NEW",
    features: ["Oversized Butterfly Silhouette", "Rose Gold Ion Plating", "UV400 Gradient Lenses", "Hypoallergenic Pads"],
    frameShape: "Cat Eye",
    frameMaterial: "Titanium & Acetate",
    lensColor: "Rose Berry"
  },
  {
    name: "Eclipse Sport Polarized Wrap",
    category: "Sunglasses",
    price: 1199,
    oldPrice: 1999,
    rating: 4.7,
    reviewsCount: 92,
    image: "https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=800&q=80"
    ],
    stock: 38,
    description: "Designed for cycling, running, and active marine sports. Curved wraparound frame prevents side glare and wind intrusion with grippy rubberized temple grips.",
    badge: "BESTSELLER",
    features: ["Hydrophobic Oleophobic Coating", "Non-Slip Rubber Inlays", "Panoramic Peripheral View", "Shatterproof Polycarbonate"],
    frameShape: "Wraparound",
    frameMaterial: "TR90 Polymer",
    lensColor: "Cobalt Blue Flash"
  },
  {
    name: "Apex Geometric Wireframe",
    category: "Unisex",
    price: 1399,
    oldPrice: 2199,
    rating: 4.7,
    reviewsCount: 44,
    image: "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?auto=format&fit=crop&w=800&q=80"
    ],
    stock: 25,
    description: "Sharp octagonal angles meet featherweight architectural steel. For individuals who prefer clean lines, architectural minimalism, and cutting-edge fashion.",
    badge: "TRENDING",
    features: ["Polygonal Architectural Shape", "Featherweight Steel Core", "Gradient Bronze Optics", "Diamond-Cut Bevels"],
    frameShape: "Geometric",
    frameMaterial: "Architectural Steel",
    lensColor: "Bronze Gradient"
  },
  {
    name: "Dynasty 24K Aviator Shield",
    category: "Premium Collection",
    price: 3799,
    oldPrice: 5999,
    rating: 4.9,
    reviewsCount: 51,
    image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=800&q=80"
    ],
    stock: 14,
    description: "The pinnacle of high-flying grandeur. Single seamless visor shield framed by gold precision casting with mirror reflection and laser-etched StyleLens crest.",
    badge: "EXCLUSIVE",
    features: ["Monolithic Shield Lens", "Laser-Etched Crest", "24K Gold Accent Rim", "Hardened Scratch Shield"],
    frameShape: "Aviator",
    frameMaterial: "Gold Titanium",
    lensColor: "Gold Mirror"
  }
];

module.exports = seedProducts;
