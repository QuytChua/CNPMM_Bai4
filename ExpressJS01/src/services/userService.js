import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "./emailService.js";

// REGISTER
export const register = async ({ username, email, password }) => {
  const exist = await User.findOne({ email });
  if (exist) throw new Error("Email đã tồn tại");

  const hashed = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    username,
    email,
    password: hashed,
  });

  return newUser;
};

// LOGIN
export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Email không tồn tại");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Sai mật khẩu");

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { token };
};

// FORGOT PASSWORD
export const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Email không tồn tại");

  // Tạo mật khẩu mới
  const newPassword = crypto.randomBytes(4).toString("hex");
  const hashed = await bcrypt.hash(newPassword, 10);

  // Lưu vào DB
  user.password = hashed;
  await user.save();

  // Gửi email
  const htmlContent = `
    <h2>Khôi phục mật khẩu</h2>
    <p>Mật khẩu mới của bạn là:</p>
    <h3 style="color:#e60000">${newPassword}</h3>
    <p>Hãy đăng nhập và đổi mật khẩu ngay.</p>
  `;

  await sendEmail(email, "Khôi phục mật khẩu", htmlContent);

  return true;
};
