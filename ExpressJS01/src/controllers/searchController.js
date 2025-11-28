import { searchProducts, getProducts } from "../services/productService.js";
import Product from "../models/product.js";

/**
 * API tìm kiếm sản phẩm nâng cao
 */
export const searchProductsController = async (req, res) => {
  try {
    const searchParams = {
      q: req.query.q || "",
      category: req.query.category || "",
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      promo:
        req.query.promo === "true"
          ? true
          : req.query.promo === "false"
          ? false
          : undefined,
      minViews: req.query.minViews ? Number(req.query.minViews) : undefined,
      sortBy: req.query.sortBy || "createdAt",
      sortOrder: req.query.sortOrder || "desc",
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 12,
    };

    console.log("Search params:", searchParams);

    const result = await searchProducts(searchParams);

    res.json({
      success: true,
      data: result,
      message: `Tìm thấy ${result.pagination.total} sản phẩm`,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tìm kiếm sản phẩm",
      error: error.message,
    });
  }
};

/**
 * API lấy các tùy chọn filter
 */
export const getFilterOptionsController = async (req, res) => {
  try {
    // Lấy các category và price range từ database
    const categories = await Product.distinct("category");
    const priceStats = await Product.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
          avgPrice: { $avg: "$price" },
        },
      },
    ]);

    const filterOptions = {
      categories: categories.filter((cat) => cat && cat.trim()),
      priceRange: priceStats[0] || {
        minPrice: 0,
        maxPrice: 1000000,
        avgPrice: 500000,
      },
      sortOptions: [
        { value: "createdAt", label: "Mới nhất", orders: ["desc", "asc"] },
        { value: "price", label: "Giá", orders: ["asc", "desc"] },
        { value: "views", label: "Lượt xem", orders: ["desc", "asc"] },
        {
          value: "discountPercent",
          label: "Khuyến mãi",
          orders: ["desc", "asc"],
        },
      ],
    };

    res.json({
      success: true,
      data: filterOptions,
    });
  } catch (error) {
    console.error("Filter options error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy tùy chọn lọc",
      error: error.message,
    });
  }
};

/**
 * API lấy danh sách sản phẩm
 */
export const getProductsController = async (req, res) => {
  try {
    const { page = 1, limit = 12, category = "" } = req.query;

    const result = await getProducts(page, limit, category);

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách sản phẩm",
      error: error.message,
    });
  }
};
