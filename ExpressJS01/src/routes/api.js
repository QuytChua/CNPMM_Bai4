import express from "express";
import {
  handleRegister,
  handleLogin,
  handleForgotPassword,
} from "../controllers/userController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

const initRoutes = (app) => {
  router.post("/register", handleRegister);
  router.post("/login", handleLogin);
  router.post("/forgot-password", handleForgotPassword);

  router.get("/home", auth, (req, res) => {
    res.json({ message: "Xin chào " + req.user.email });
  });

  app.use("/api", router);
};

export default initRoutes;
