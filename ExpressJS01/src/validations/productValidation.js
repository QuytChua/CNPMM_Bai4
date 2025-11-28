import { Joi } from "express-validation";

export const getProductsValidation = {
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    category: Joi.string().trim().lowercase().optional(),
  }).unknown(false),
};

export const createProductValidation = {
  body: Joi.object({
    name: Joi.string().trim().min(2).max(200).required(),
    price: Joi.number().min(0).required(),
    category: Joi.string().trim().lowercase().min(1).max(50).required(),
    description: Joi.string().trim().max(2000).allow("").optional(),
    image: Joi.string().trim().uri().allow("").optional(),

    // optional advanced fields
    isPromotion: Joi.boolean().optional(),
    discountPercent: Joi.number().min(0).max(100).optional(),
    views: Joi.number().min(0).optional(),
  }).unknown(false),
};

// SEARCH validation
export const searchProductsValidation = {
  query: Joi.object({
    q: Joi.string().trim().allow("").optional(),
    category: Joi.string().trim().lowercase().allow("").optional(),

    minPrice: Joi.number().min(0).optional(),
    maxPrice: Joi.number().min(0).optional(),

    promo: Joi.boolean().optional(),
    minViews: Joi.number().min(0).optional(),

    sortBy: Joi.string()
      .valid("createdAt", "price", "views", "discountPercent")
      .default("createdAt"),
    sortOrder: Joi.string().valid("asc", "desc").default("desc"),

    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(12),
  }).unknown(false),
};
