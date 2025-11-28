import * as productService from "../services/productService.js";

export const handleGetProducts = async (req, res) => {
  try {
    const { page = 1, limit = 8, category } = req.query;

    const data = await productService.getProducts(
      Number(page),
      Number(limit),
      category
    );

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const handleCreateProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json({ message: "Tạo sản phẩm thành công", product });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// SEARCH endpoint
export const handleSearchProducts = async (req, res) => {
  try {
    const data = await productService.searchProducts(req.query);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
