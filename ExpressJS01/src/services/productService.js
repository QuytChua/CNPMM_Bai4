import Product from "../models/product.js";

export const getProducts = async (page = 1, limit = 8, category) => {
  const skip = (page - 1) * limit;

  // Chỉ filter theo category nếu category có giá trị thực sự
  const filter = category && category.trim() !== "" ? { category } : {};

  console.log("Filter applied:", filter);

  const items = await Product.find(filter).skip(skip).limit(limit);

  const total = await Product.countDocuments(filter);

  console.log(`Found ${items.length} items, total: ${total}`);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const createProduct = async (productData) => {
  const product = new Product(productData);
  return await product.save();
};
