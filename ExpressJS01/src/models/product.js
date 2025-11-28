import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },

    // chuẩn hoá để filter đúng
    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    description: { type: String, default: "", trim: true },
    image: { type: String, default: "", trim: true },

    // filter nâng cao
    isPromotion: { type: Boolean, default: false, index: true }, // khuyến mãi
    discountPercent: { type: Number, default: 0, min: 0, max: 100 }, // %
    views: { type: Number, default: 0, min: 0, index: true }, // lượt xem
  },
  { timestamps: true }
);

// indexes hỗ trợ lọc/sort
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

export default mongoose.model("Product", productSchema);
