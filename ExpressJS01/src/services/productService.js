import Product from "../models/product.js";
import {
  searchProducts as elasticSearchProducts,
  indexProduct,
  deleteProduct as deleteFromIndex,
  checkConnection,
} from "./elasticsearchService.js";

/** Escape ký tự đặc biệt trong regex */
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Fuzzy
 */
const buildFuzzyRegex = (q) => {
  const keyword = (q || "").trim();
  if (!keyword) return null;

  const parts = keyword.split(/\s+/).map(escapeRegex).filter(Boolean);

  if (parts.length === 0) return null;

  return new RegExp(parts.join(".*"), "i");
};

export const getProducts = async (page = 1, limit = 8, category) => {
  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(100, Math.max(1, Number(limit) || 8));
  const skip = (pageNum - 1) * limitNum;

  const normalizedCategory = (category || "").trim().toLowerCase();
  const filter = normalizedCategory ? { category: normalizedCategory } : {};

  const [items, total] = await Promise.all([
    Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Product.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  };
};

export const createProduct = async (productData) => {
  // Whitelist field để tránh nhét field lạ
  const data = {
    name: productData?.name,
    price: productData?.price,
    category: productData?.category,
    description: productData?.description,
    image: productData?.image,

    // optional advanced fields
    isPromotion: productData?.isPromotion,
    discountPercent: productData?.discountPercent,
    views: productData?.views,
  };

  const product = await Product.create(data);

  // Tự động index sản phẩm mới vào Elasticsearch
  try {
    const isElasticConnected = await checkConnection();
    if (isElasticConnected) {
      await indexProduct(product);
    }
  } catch (error) {
    console.error(
      "Error indexing new product to Elasticsearch:",
      error.message
    );
  }

  return product;
};

export const searchProducts = async (query = {}) => {
  const {
    q = "",
    category = "",
    minPrice,
    maxPrice,
    promo, // boolean
    minViews,
    sortBy = "createdAt",
    sortOrder = "desc",
    page = 1,
    limit = 12,
  } = query;

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(100, Math.max(1, Number(limit) || 12));

  // Thử sử dụng Elasticsearch trước
  try {
    const isElasticConnected = await checkConnection();
    if (isElasticConnected) {
      console.log("Using Elasticsearch for search");
      return await elasticSearchProducts({
        q,
        category,
        minPrice,
        maxPrice,
        promo,
        minViews,
        sortBy,
        sortOrder,
        page: pageNum,
        limit: limitNum,
      });
    }
  } catch (error) {
    console.error(
      "Elasticsearch search failed, falling back to MongoDB:",
      error.message
    );
  }

  // Fallback về MongoDB nếu Elasticsearch không khả dụng
  console.log("Using MongoDB for search (fallback)");

  const skip = (pageNum - 1) * limitNum;

  // Build $and conditions để dễ kết hợp nhiều điều kiện
  const andConditions = [];

  // category
  const normalizedCategory = (category || "").trim().toLowerCase();
  if (normalizedCategory) andConditions.push({ category: normalizedCategory });

  // price range
  if (minPrice !== undefined || maxPrice !== undefined) {
    const priceRange = {};
    if (minPrice !== undefined) priceRange.$gte = Number(minPrice);
    if (maxPrice !== undefined) priceRange.$lte = Number(maxPrice);
    andConditions.push({ price: priceRange });
  }

  // promo filter
  if (typeof promo === "boolean") {
    if (promo) {
      andConditions.push({
        $or: [{ isPromotion: true }, { discountPercent: { $gt: 0 } }],
      });
    } else {
      andConditions.push({
        $and: [{ isPromotion: false }, { discountPercent: { $lte: 0 } }],
      });
    }
  }

  // views
  if (minViews !== undefined) {
    andConditions.push({ views: { $gte: Number(minViews) } });
  }

  // fuzzy keyword
  const rx = buildFuzzyRegex(q);
  const keyword = (q || "").trim();
  if (rx) {
    andConditions.push({
      $or: [{ name: rx }, { description: rx }],
    });
  }

  const filter = andConditions.length ? { $and: andConditions } : {};

  // Sort
  const sortFieldAllow = new Set([
    "createdAt",
    "price",
    "views",
    "discountPercent",
  ]);
  const sf = sortFieldAllow.has(sortBy) ? sortBy : "createdAt";
  const so = String(sortOrder).toLowerCase() === "asc" ? 1 : -1;
  const sort = { [sf]: so };

  const [items, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(limitNum).lean(),
    Product.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
    applied: {
      q: keyword,
      category: normalizedCategory,
      minPrice,
      maxPrice,
      promo,
      minViews,
      sortBy: sf,
      sortOrder: so === 1 ? "asc" : "desc",
    },
  };
};

// Cập nhật sản phẩm
export const updateProduct = async (productId, updateData) => {
  try {
    const product = await Product.findByIdAndUpdate(
      productId,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!product) {
      throw new Error("Product not found");
    }

    // Cập nhật trong Elasticsearch
    try {
      const isElasticConnected = await checkConnection();
      if (isElasticConnected) {
        await indexProduct(product);
      }
    } catch (error) {
      console.error("Error updating product in Elasticsearch:", error.message);
    }

    return product;
  } catch (error) {
    throw error;
  }
};

// Xóa sản phẩm
export const deleteProduct = async (productId) => {
  try {
    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      throw new Error("Product not found");
    }

    // Xóa khỏi Elasticsearch
    try {
      const isElasticConnected = await checkConnection();
      if (isElasticConnected) {
        await deleteFromIndex(productId);
      }
    } catch (error) {
      console.error(
        "Error deleting product from Elasticsearch:",
        error.message
      );
    }

    return product;
  } catch (error) {
    throw error;
  }
};
