import { Joi } from "express-validation";

export const getProductsValidation = {
  query: Joi.object({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).max(1000).optional(),
    category: Joi.string().optional(),
  }),
};

export const createProductValidation = {
  body: Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    category: Joi.string().required(),
    description: Joi.string().optional(),
    image: Joi.string().optional(),
  }),
};
