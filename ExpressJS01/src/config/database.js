import mongoose from "mongoose";
import dotenv from "dotenv";
import {
  checkConnection,
  createProductsIndex,
} from "../services/elasticsearchService.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected!");
  } catch (error) {
    console.log("MongoDB Error:", error);
  }
};

const initializeElasticsearch = async () => {
  try {
    const isConnected = await checkConnection();
    if (isConnected) {
      await createProductsIndex();
      console.log("Elasticsearch initialized successfully!");
    } else {
      console.log(
        "Elasticsearch connection failed - search will fallback to MongoDB"
      );
    }
  } catch (error) {
    console.log("Elasticsearch initialization error:", error.message);
    console.log("Search will fallback to MongoDB");
  }
};

export { connectDB, initializeElasticsearch };
export default connectDB;
