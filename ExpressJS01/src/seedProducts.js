import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/product.js";

dotenv.config({ path: "../.env" });

async function seedProducts() {
  try {
    console.log("MONGO_URL:", process.env.MONGO_URL); // debug

    await mongoose.connect(process.env.MONGO_URL);
    console.log("Kết nối MongoDB thành công!");

    await Product.deleteMany({});
    console.log("Đã xóa toàn bộ sản phẩm cũ!");

    const items = [
      {
        name: "iPhone 15 Pro Max",
        price: 34990000,
        category: "phone",
        description: "Chip A17 Pro, Titanium siêu bền",
        image: "",
      },
      {
        name: "Samsung Galaxy S24 Ultra",
        price: 28990000,
        category: "phone",
        description: "Camera 200MP, Snapdragon 8 Gen 3",
        image: "",
      },
      {
        name: "MacBook Air M2",
        price: 25990000,
        category: "laptop",
        description: "Mỏng nhẹ, pin trâu, hiệu năng cao",
        image: "",
      },
      {
        name: "ASUS TUF Gaming F15",
        price: 18990000,
        category: "laptop",
        description: "RTX 3050, i7 11800H, màn 144Hz",
        image: "",
      },
      {
        name: "Clean Code",
        price: 299000,
        category: "book",
        description: "Robert C. Martin – sách lập trình kinh điển",
        image: "",
      },
      {
        name: "Design Patterns",
        price: 399000,
        category: "book",
        description: "Erich Gamma – mẫu thiết kế phần mềm",
        image: "",
      },
      {
        name: "PlayStation 5",
        price: 15990000,
        category: "device",
        description: "Console PS5 – bản tiêu chuẩn",
        image: "",
      },
      {
        name: "AirPods Pro 2",
        price: 4990000,
        category: "device",
        description: "Tai nghe chống ồn chủ động thế hệ 2",
        image: "",
      },
      {
        name: "Logitech G102",
        price: 299000,
        category: "accessory",
        description: "Chuột gaming siêu bền, RGB đẹp",
        image: "",
      },
      {
        name: "Apple Watch Series 9",
        price: 10990000,
        category: "device",
        description: "Đồng hồ thông minh Apple đời mới",
        image: "",
      },
    ];

    await Product.insertMany(items);
    console.log("✔ Thêm 10 sản phẩm thành công!");

    process.exit();
  } catch (err) {
    console.error("Lỗi khi seed:", err);
    process.exit(1);
  }
}

seedProducts();
