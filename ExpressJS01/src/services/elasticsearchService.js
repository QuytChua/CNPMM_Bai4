import { Client } from "@elastic/elasticsearch";

// Khởi tạo Elasticsearch client
const client = new Client({
  node: process.env.ELASTICSEARCH_URL || "http://localhost:9200",
  requestTimeout: 5000, // 5 second timeout
  maxRetries: 1, // Don't retry on connection issues
});

const PRODUCTS_INDEX = "products";

// Kiểm tra kết nối Elasticsearch
export const checkConnection = async () => {
  try {
    // Simple ping first to check if ES is running
    await client.ping();

    // Then check cluster health
    const health = await client.cluster.health({ timeout: "5s" });
    console.log("✅ Elasticsearch connected! Status:", health.status);
    return true;
  } catch (error) {
    if (
      error.message.includes("ECONNREFUSED") ||
      error.message.includes("connect")
    ) {
      console.log("⚠️  Elasticsearch not running. Please start Elasticsearch:");
      console.log(
        "   Docker: docker run -d --name elasticsearch -p 9200:9200 -e 'discovery.type=single-node' -e 'xpack.security.enabled=false' docker.elastic.co/elasticsearch/elasticsearch:8.11.0"
      );
      console.log(
        "   Local: Download from https://www.elastic.co/downloads/elasticsearch"
      );
    } else {
      console.error("❌ Elasticsearch connection error:", error.message);
    }
    return false;
  }
};

// Tạo index cho products
export const createProductsIndex = async () => {
  try {
    const indexExists = await client.indices.exists({ index: PRODUCTS_INDEX });

    if (indexExists) {
      console.log(`Index ${PRODUCTS_INDEX} already exists`);
      return true;
    }

    await client.indices.create({
      index: PRODUCTS_INDEX,
      body: {
        settings: {
          analysis: {
            analyzer: {
              vietnamese_analyzer: {
                type: "custom",
                tokenizer: "standard",
                filter: ["lowercase", "asciifolding"],
              },
            },
          },
        },
        mappings: {
          properties: {
            id: { type: "keyword" },
            name: {
              type: "text",
              analyzer: "vietnamese_analyzer",
              fields: {
                keyword: { type: "keyword" },
              },
            },
            description: {
              type: "text",
              analyzer: "vietnamese_analyzer",
            },
            category: {
              type: "keyword",
              fields: {
                text: {
                  type: "text",
                  analyzer: "vietnamese_analyzer",
                },
              },
            },
            price: { type: "float" },
            image: { type: "text", index: false },
            isPromotion: { type: "boolean" },
            discountPercent: { type: "float" },
            views: { type: "integer" },
            createdAt: { type: "date" },
            updatedAt: { type: "date" },
          },
        },
      },
    });

    console.log(`Created index ${PRODUCTS_INDEX}`);
    return true;
  } catch (error) {
    console.error("Error creating products index:", error);
    throw error;
  }
};

// Index một sản phẩm
export const indexProduct = async (product) => {
  try {
    const document = {
      id: product._id.toString(),
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      image: product.image,
      isPromotion: product.isPromotion || false,
      discountPercent: product.discountPercent || 0,
      views: product.views || 0,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt || product.createdAt,
    };

    await client.index({
      index: PRODUCTS_INDEX,
      id: document.id,
      body: document,
    });

    console.log(`Indexed product: ${product.name}`);
    return true;
  } catch (error) {
    console.error("Error indexing product:", error);
    throw error;
  }
};

// Index nhiều sản phẩm cùng lúc
export const bulkIndexProducts = async (products) => {
  try {
    const body = [];

    products.forEach((product) => {
      body.push({
        index: { _index: PRODUCTS_INDEX, _id: product._id.toString() },
      });
      body.push({
        id: product._id.toString(),
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        image: product.image,
        isPromotion: product.isPromotion || false,
        discountPercent: product.discountPercent || 0,
        views: product.views || 0,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt || product.createdAt,
      });
    });

    const response = await client.bulk({ body });

    if (response.errors) {
      console.error("Bulk indexing errors:", response.items);
    } else {
      console.log(`Bulk indexed ${products.length} products`);
    }

    return !response.errors;
  } catch (error) {
    console.error("Error bulk indexing products:", error);
    throw error;
  }
};

// Xóa sản phẩm khỏi index
export const deleteProduct = async (productId) => {
  try {
    await client.delete({
      index: PRODUCTS_INDEX,
      id: productId.toString(),
    });

    console.log(`Deleted product from index: ${productId}`);
    return true;
  } catch (error) {
    if (error.meta?.statusCode === 404) {
      console.log(`Product not found in index: ${productId}`);
      return true;
    }
    console.error("Error deleting product from index:", error);
    throw error;
  }
};

// Tìm kiếm sản phẩm với Elasticsearch
export const searchProducts = async (searchParams) => {
  try {
    const {
      q = "",
      category = "",
      minPrice,
      maxPrice,
      promo,
      minViews,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 12,
    } = searchParams;

    const from = (page - 1) * limit;

    // Xây dựng query
    const must = [];
    const filter = [];

    // Text search với fuzzy matching
    if (q && q.trim()) {
      must.push({
        multi_match: {
          query: q.trim(),
          fields: ["name^2", "description"],
          type: "best_fields",
          fuzziness: "AUTO",
          operator: "and",
        },
      });
    }

    // Category filter
    if (category && category.trim()) {
      filter.push({
        term: { category: category.trim().toLowerCase() },
      });
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceRange = {};
      if (minPrice !== undefined) priceRange.gte = Number(minPrice);
      if (maxPrice !== undefined) priceRange.lte = Number(maxPrice);
      filter.push({ range: { price: priceRange } });
    }

    // Promotion filter
    if (typeof promo === "boolean") {
      if (promo) {
        filter.push({
          bool: {
            should: [
              { term: { isPromotion: true } },
              { range: { discountPercent: { gt: 0 } } },
            ],
          },
        });
      } else {
        filter.push({
          bool: {
            must: [
              { term: { isPromotion: false } },
              { range: { discountPercent: { lte: 0 } } },
            ],
          },
        });
      }
    }

    // Views filter
    if (minViews !== undefined) {
      filter.push({ range: { views: { gte: Number(minViews) } } });
    }

    // Xây dựng query body
    const query = {
      bool: {},
    };

    if (must.length > 0) query.bool.must = must;
    if (filter.length > 0) query.bool.filter = filter;

    // Nếu không có điều kiện gì, tìm tất cả
    if (must.length === 0 && filter.length === 0) {
      query.match_all = {};
      delete query.bool;
    }

    // Sort
    const sort = [];
    if (q && q.trim() && must.length > 0) {
      sort.push({ _score: { order: "desc" } });
    }

    const sortField = [
      "createdAt",
      "price",
      "views",
      "discountPercent",
    ].includes(sortBy)
      ? sortBy
      : "createdAt";
    const order = sortOrder === "asc" ? "asc" : "desc";
    sort.push({ [sortField]: { order } });

    const searchBody = {
      index: PRODUCTS_INDEX,
      body: {
        query,
        sort,
        from,
        size: limit,
        _source: {
          excludes: ["id"], // Loại bỏ field id trùng lặp
        },
      },
    };

    const response = await client.search(searchBody);

    const items = response.hits.hits.map((hit) => ({
      _id: hit._id,
      ...hit._source,
      _score: hit._score,
    }));

    const total = response.hits.total.value;

    return {
      items,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
      applied: {
        q: q.trim(),
        category: category.trim().toLowerCase(),
        minPrice,
        maxPrice,
        promo,
        minViews,
        sortBy: sortField,
        sortOrder: order,
      },
    };
  } catch (error) {
    console.error("Elasticsearch search error:", error);
    throw error;
  }
};

// Làm mới index
export const refreshIndex = async () => {
  try {
    await client.indices.refresh({ index: PRODUCTS_INDEX });
    return true;
  } catch (error) {
    console.error("Error refreshing index:", error);
    throw error;
  }
};

// Xóa toàn bộ index
export const deleteIndex = async () => {
  try {
    await client.indices.delete({ index: PRODUCTS_INDEX });
    console.log(`Deleted index ${PRODUCTS_INDEX}`);
    return true;
  } catch (error) {
    console.error("Error deleting index:", error);
    throw error;
  }
};

export default client;
