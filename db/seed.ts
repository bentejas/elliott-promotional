// db/seed.ts
import { db, products } from "./index";

const sampleProducts = [
  {
    title: "Classic Cotton T-Shirt",
    description:
      "Comfortable 100% cotton t-shirt perfect for everyday wear and custom printing. Pre-shrunk and durable.",
    productCode: "CT001",
    colours: ["white", "black", "navy", "red", "gray"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    gender: "unisex",
    priceLow: 12.99,
    priceHigh: 18.99,
    imgSrc: "/images/product-categories/apparel-stacked-tshirts.png",
    secondaryImages: [],
    category: "apparel",
    brand: "Gildan",
  },
  {
    title: "Performance Polo Shirt",
    description:
      "Moisture-wicking performance polo with UV protection. Perfect for corporate events and sports teams.",
    productCode: "PP002",
    colours: ["white", "black", "navy", "royal blue", "red"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    gender: "unisex",
    priceLow: 24.99,
    priceHigh: 32.99,
    imgSrc: "/images/product-categories/athletic-polo.png",
    secondaryImages: [],
    category: "athletic",
    brand: "Nike",
  },
  {
    title: "Classic Baseball Cap",
    description:
      "6-panel structured baseball cap with adjustable strap. Great for embroidery and heat transfer.",
    productCode: "BC003",
    colours: ["black", "navy", "white", "red", "khaki"],
    sizes: ["One Size"],
    gender: "unisex",
    priceLow: 8.99,
    priceHigh: 14.99,
    imgSrc: "/images/product-categories/hats-baseball-cap.png",
    secondaryImages: [],
    category: "hats",
    brand: "Flexfit",
  },
  {
    title: "High-Visibility Safety Vest",
    description:
      "ANSI Class 2 compliant safety vest with reflective strips. Essential for construction and road work.",
    productCode: "HV004",
    colours: ["lime", "orange"],
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    gender: "unisex",
    priceLow: 15.99,
    priceHigh: 22.99,
    imgSrc: "/images/product-categories/hi-vis-safety-vest.png",
    secondaryImages: [],
    category: "hi-vis",
    brand: "3M",
  },
  {
    title: "Ceramic Coffee Mug",
    description:
      "11oz ceramic mug with C-handle. Dishwasher and microwave safe. Perfect for office gifts.",
    productCode: "CM005",
    colours: ["white", "black", "blue", "red"],
    sizes: ["11oz"],
    gender: "unisex",
    priceLow: 6.99,
    priceHigh: 9.99,
    imgSrc: "/images/product-categories/drinkware-mug.png",
    secondaryImages: [],
    category: "drinkware",
    brand: "Ceramic Plus",
  },
  {
    title: "Promotional Golf Ball Set",
    description:
      "Professional quality golf balls perfect for tournaments and corporate gifts. Set of 3.",
    productCode: "GB006",
    colours: ["white"],
    sizes: ["Standard"],
    gender: "unisex",
    priceLow: 18.99,
    priceHigh: 24.99,
    imgSrc: "/images/product-categories/leisure-golf-ball.png",
    secondaryImages: [],
    category: "leisure",
    brand: "Titleist",
  },
  {
    title: "Business Card Holder",
    description:
      "Professional metal business card holder with sleek design. Holds up to 20 cards.",
    productCode: "BCH007",
    colours: ["silver", "black", "gold"],
    sizes: ["Standard"],
    gender: "unisex",
    priceLow: 12.99,
    priceHigh: 18.99,
    imgSrc: "/images/product-categories/office-supplies.png",
    secondaryImages: [],
    category: "office",
    brand: "Executive",
  },
  {
    title: "Canvas Tote Bag",
    description:
      "Durable 12oz canvas tote bag with reinforced handles. Great for shopping and promotional events.",
    productCode: "TB008",
    colours: ["natural", "black", "navy", "red"],
    sizes: ["Standard"],
    gender: "unisex",
    priceLow: 8.99,
    priceHigh: 12.99,
    imgSrc: "/images/product-categories/bags-backpack.png",
    secondaryImages: [],
    category: "bags",
    brand: "Canvas Co",
  },
  {
    title: "Women's Fitted T-Shirt",
    description:
      "Stylish fitted t-shirt designed specifically for women. Soft cotton blend with flattering cut.",
    productCode: "WFT009",
    colours: ["pink", "white", "black", "purple", "teal"],
    sizes: ["XS", "S", "M", "L", "XL"],
    gender: "women",
    priceLow: 14.99,
    priceHigh: 19.99,
    imgSrc: "/images/product-categories/apparel-stacked-tshirts.png",
    secondaryImages: [],
    category: "apparel",
    brand: "Bella + Canvas",
  },
  {
    title: "Insulated Water Bottle",
    description:
      "Double-wall vacuum insulated stainless steel water bottle. Keeps drinks cold for 24 hours.",
    productCode: "WB010",
    colours: ["silver", "black", "blue", "pink", "green"],
    sizes: ["20oz", "32oz"],
    gender: "unisex",
    priceLow: 19.99,
    priceHigh: 29.99,
    imgSrc: "/images/product-categories/drinkware-mug.png",
    secondaryImages: [],
    category: "drinkware",
    brand: "Hydro Flask",
  },
];

export async function seedDatabase() {
  try {
    console.log("🌱 Seeding database...");

    // Insert sample products
    await db.insert(products).values(sampleProducts);

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run seed if this file is executed directly (import.meta.main isn't in the
// TS ImportMeta type, so compare module URL to the executed script path)
if (import.meta.url === `file://${process.argv[1]}`) {
  await seedDatabase();
  process.exit(0);
}
