import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "./emailService.js";

export const register = async ({ username, email, password }) => {
  const exist = await User.findOne({ email });
  if (exist) throw new Error("Email đã tồn tại");

  const hashed = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    username,
    email,
    password: hashed,
    role: "user", // mặc định user
  });

  return newUser;
};

// LOGIN – thêm role vào token
export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Email không tồn tại");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Sai mật khẩu");

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { token };
};

export const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Email không tồn tại");

  const newPassword = crypto.randomBytes(4).toString("hex");
  const hashed = await bcrypt.hash(newPassword, 10);

  user.password = hashed;
  await user.save();

  const html = `
    <h2>Khôi phục mật khẩu</h2>
    <p>Mật khẩu mới của bạn:</p>
    <h3>${newPassword}</h3>
    <p>Đăng nhập và đổi lại mật khẩu ngay.</p>
  `;

  await sendEmail(email, "Khôi phục mật khẩu", html);

  return true;
};
