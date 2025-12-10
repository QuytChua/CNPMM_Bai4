import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "./models/product.js";
import {
  checkConnection,
  createProductsIndex,
  bulkIndexProducts,
  deleteIndex,
} from "./services/elasticsearchService.js";

dotenv.config();

// Đồng bộ tất cả sản phẩm từ MongoDB sang Elasticsearch
const syncAllProducts = async () => {
  try {
    console.log("🔄 Starting product synchronization...");

    // Kết nối MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB connected");

    // Kiểm tra Elasticsearch connection
    const isElasticConnected = await checkConnection();
    if (!isElasticConnected) {
      throw new Error("Cannot connect to Elasticsearch");
    }
    console.log("✅ Elasticsearch connected");

    // Tạo index mới
    await createProductsIndex();

    // Lấy tất cả sản phẩm từ MongoDB
    const products = await Product.find({}).lean();
    console.log(`📦 Found ${products.length} products in MongoDB`);

    if (products.length === 0) {
      console.log("❌ No products to sync");
      return;
    }

    // Đồng bộ theo batch để tránh quá tải
    const BATCH_SIZE = 100;
    let synced = 0;

    for (let i = 0; i < products.length; i += BATCH_SIZE) {
      const batch = products.slice(i, i + BATCH_SIZE);

      try {
        await bulkIndexProducts(batch);
        synced += batch.length;
        console.log(`✅ Synced ${synced}/${products.length} products`);
      } catch (error) {
        console.error(
          `❌ Error syncing batch ${Math.floor(i / BATCH_SIZE) + 1}:`,
          error.message
        );
      }
    }

    console.log("🎉 Synchronization completed!");
    console.log(`📊 Total products synced: ${synced}/${products.length}`);
  } catch (error) {
    console.error("❌ Sync error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected");
  }
};

// Reset và đồng bộ lại toàn bộ
const resetAndSync = async () => {
  try {
    console.log("🗑️  Resetting Elasticsearch index...");

    const isElasticConnected = await checkConnection();
    if (!isElasticConnected) {
      throw new Error("Cannot connect to Elasticsearch");
    }

    // Xóa index cũ
    try {
      await deleteIndex();
      console.log("✅ Old index deleted");
    } catch (error) {
      console.log("ℹ️  No existing index to delete");
    }

    // Đồng bộ lại
    await syncAllProducts();
  } catch (error) {
    console.error("❌ Reset error:", error.message);
  }
};

// Kiểm tra trạng thái đồng bộ
const checkSyncStatus = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    const mongoCount = await Product.countDocuments();
    console.log(`📊 MongoDB products: ${mongoCount}`);

    const isElasticConnected = await checkConnection();
    if (isElasticConnected) {
      // Có thể thêm code để đếm documents trong Elasticsearch
      console.log("✅ Elasticsearch is connected");
    } else {
      console.log("❌ Elasticsearch is not connected");
    }
  } catch (error) {
    console.error("❌ Status check error:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

// CLI interface
const command = process.argv[2];

switch (command) {
  case "sync":
    console.log("🚀 Starting synchronization...");
    syncAllProducts();
    break;

  case "reset":
    console.log("🚀 Starting reset and sync...");
    resetAndSync();
    break;

  case "status":
    console.log("🚀 Checking sync status...");
    checkSyncStatus();
    break;

  default:
    console.log(`
📖 Elasticsearch Sync Tool

Usage:
  node syncElasticsearch.js [command]

Commands:
  sync    - Đồng bộ tất cả sản phẩm từ MongoDB sang Elasticsearch
  reset   - Xóa index Elasticsearch và đồng bộ lại từ đầu
  status  - Kiểm tra trạng thái đồng bộ

Examples:
  node syncElasticsearch.js sync
  node syncElasticsearch.js reset
  node syncElasticsearch.js status
    `);
}

export { syncAllProducts, resetAndSync, checkSyncStatus };
