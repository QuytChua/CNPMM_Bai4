import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    category: String,
    description: String,
    image: String,
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
