import { Joi } from "express-validation";

export const registerValidation = {
  body: Joi.object({
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(50).required(),
  }),
};

export const loginValidation = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(50).required(),
  }),
};

export const forgotPasswordValidation = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
};
