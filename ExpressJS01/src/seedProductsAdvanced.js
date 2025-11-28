import Product from "./models/product.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const sampleProducts = [
  {
    name: "iPhone 15 Pro Max",
    price: 25990000,
    category: "phone",
    description:
      "iPhone mới nhất với chip A17 Pro, camera 48MP và màn hình Super Retina XDR",
    image: "",
    brand: "Apple",
    tags: ["iphone", "smartphone", "apple", "5g", "premium"],
    discount: 10,
    // views: 1250,
    // rating: 4.8,
    isActive: true,
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    price: 23990000,
    category: "phone",
    description:
      "Flagship Samsung với S Pen, camera 200MP và màn hình Dynamic AMOLED",
    image: "",
    brand: "Samsung",
    tags: ["samsung", "galaxy", "android", "s-pen", "camera"],
    discount: 15,
    // views: 980,
    // rating: 4.7,
    isActive: true,
  },
  {
    name: "MacBook Air M3",
    price: 32990000,
    category: "laptop",
    description: "Laptop Apple với chip M3, màn hình Liquid Retina 13.6 inch",
    image: "",
    brand: "Apple",
    tags: ["macbook", "laptop", "apple", "m3", "ultrabook"],
    discount: 5,
    // views: 2100,
    // rating: 4.9,
    isActive: true,
  },
  {
    name: "Dell XPS 13",
    price: 24990000,
    category: "laptop",
    description:
      "Laptop Windows cao cấp với màn hình InfinityEdge và hiệu suất mạnh mẽ",
    image: "",
    brand: "Dell",
    tags: ["dell", "xps", "windows", "ultrabook", "business"],
    discount: 0,
    // views: 750,
    // rating: 4.5,
    isActive: true,
  },
  {
    name: "Lập trình JavaScript từ cơ bản đến nâng cao",
    price: 199000,
    category: "book",
    description:
      "Sách học JavaScript cho người mới bắt đầu, từ cú pháp cơ bản đến các framework hiện đại",
    image: "",
    brand: "Kim Đồng",
    tags: ["javascript", "programming", "book", "tutorial", "coding"],
    discount: 20,
    // views: 450,
    // rating: 4.6,
    isActive: true,
  },
  {
    name: "React: Thực chiến với hooks và context",
    price: 299000,
    category: "book",
    description:
      "Sách chuyên sâu về React, hooks, context và các pattern trong React",
    image: "",
    brand: "NXB Trẻ",
    tags: ["react", "javascript", "frontend", "hooks", "context"],
    discount: 25,
    // views: 320,
    // rating: 4.4,
    isActive: true,
  },
  {
    name: "Gaming Headset RGB",
    price: 1590000,
    category: "accessory",
    description:
      "Tai nghe gaming với âm thanh 7.1, micro chống ồn và đèn LED RGB",
    image: "",
    brand: "Logitech",
    tags: ["headset", "gaming", "rgb", "audio", "microphone"],
    discount: 30,
    // views: 680,
    // rating: 4.3,
    isActive: true,
  },
  {
    name: "Chuột gaming không dây",
    price: 990000,
    category: "accessory",
    description:
      "Chuột gaming không dây với DPI cao, pin 70h và cảm biến chính xác",
    image: "",
    brand: "Razer",
    tags: ["mouse", "gaming", "wireless", "dpi", "ergonomic"],
    discount: 0,
    // views: 890,
    // rating: 4.5,
    isActive: true,
  },
  {
    name: "Máy ảnh Canon EOS R6",
    price: 45990000,
    category: "device",
    description: "Máy ảnh mirrorless full-frame với IBIS, quay video 4K60p",
    image: "",
    brand: "Canon",
    tags: ["camera", "mirrorless", "fullframe", "4k", "photography"],
    discount: 8,
    // views: 340,
    // rating: 4.8,
    isActive: true,
  },
  {
    name: "iPad Pro 12.9 M2",
    price: 28990000,
    category: "device",
    description:
      "iPad Pro với chip M2, màn hình Liquid Retina XDR và hỗ trợ Apple Pencil",
    image: "",
    brand: "Apple",
    tags: ["ipad", "tablet", "apple", "m2", "pencil"],
    discount: 12,
    // views: 1100,
    // rating: 4.7,
    isActive: true,
  },
  {
    name: "Xiaomi 13 Pro",
    price: 16990000,
    category: "phone",
    description:
      "Smartphone Xiaomi cao cấp với camera Leica, chip Snapdragon 8 Gen 2",
    image: "",
    brand: "Xiaomi",
    tags: ["xiaomi", "android", "leica", "snapdragon", "flagship"],
    discount: 18,
    // views: 560,
    // rating: 4.4,
    isActive: true,
  },
  {
    name: "Lenovo ThinkPad X1 Carbon",
    price: 38990000,
    category: "laptop",
    description:
      "Laptop doanh nhân cao cấp với độ bền quân đội, bàn phím tuyệt vời",
    image: "",
    brand: "Lenovo",
    tags: ["thinkpad", "business", "durable", "keyboard", "carbon"],
    discount: 0,
    // views: 290,
    // rating: 4.6,
    isActive: true,
  },
];

const seedProductsAdvanced = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");

    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products");

    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(
      `Inserted ${products.length} sample products with advanced fields`
    );

    // Create text index for search
    try {
      await Product.collection.createIndex({
        name: "text",
        description: "text",
        brand: "text",
        tags: "text",
      });
      console.log("Created text index for search");
    } catch (error) {
      console.log("Text index might already exist:", error.message);
    }

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding products:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

seedProductsAdvanced();
