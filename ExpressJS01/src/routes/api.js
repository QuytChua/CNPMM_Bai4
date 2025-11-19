import express from "express";
import {
  handleRegister,
  handleLogin,
  handleForgotPassword,
} from "../controllers/userController.js";
import {
  handleCreateProduct,
  handleGetProducts,
} from "../controllers/productController.js";
import { auth, authorize } from "../middleware/auth.js";

import rateLimit from "express-rate-limit";
import { validate } from "express-validation";
import {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
} from "../validations/authValidation.js";
import {
  createProductValidation,
  getProductsValidation,
} from "../validations/productValidation.js";

const router = express.Router();

// rate limit cho các route auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 20, // tối đa 20 request / 15 phút / IP
  message: { message: "Quá nhiều yêu cầu, vui lòng thử lại sau." },
});

const initRoutes = (app) => {
  // AUTH
  router.post(
    "/register",
    authLimiter,
    validate(registerValidation),
    handleRegister
  );
  router.post("/login", authLimiter, validate(loginValidation), handleLogin);
  router.post(
    "/forgot-password",
    authLimiter,
    validate(forgotPasswordValidation),
    handleForgotPassword
  );

  // HOME (cần login)
  router.get("/home", auth, (req, res) => {
    res.json({ message: "Xin chào " + req.user.email });
  });

  // PRODUCTS
  // user thường cũng xem được danh sách sản phẩm
  router.get("/products", validate(getProductsValidation), handleGetProducts);

  // chỉ ADMIN mới được tạo sản phẩm
  router.post(
    "/products",
    auth,
    authorize("admin"),
    validate(createProductValidation),
    handleCreateProduct
  );

  app.use("/api", router);
};

export default initRoutes;
