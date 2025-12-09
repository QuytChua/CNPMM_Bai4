import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "./emailService.js";

// Tạo tài khoản mới
export const register = async ({ username, email, password }) => {
  const exist = await User.findOne({ email });
  if (exist) throw new Error("Email đã tồn tại");

  const hashed = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    username,
    email,
    password: hashed,
    role: "user",
  });

  return newUser;
};

export const login = async ({ email, password }) => {
  // Tìm user theo email trong database
  const user = await User.findOne({ email });
  if (!user) throw new Error("Email không tồn tại");

  // So sánh password plain text với hashed password trong DB
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Sai mật khẩu");

  // Tạo JWT token chứa thông tin user (id, email, role) với thời hạn 1 ngày
  // Token này sẽ được client lưu và gửi kèm trong header Authorization cho các request sau
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role }, // Payload chứa thông tin user
    process.env.JWT_SECRET, // Secret key để sign token
    { expiresIn: "1d" } // Token hết hạn sau 1 ngày
  );

  // Trả về object chứa token để controller gửi về client
  return { token };
};

// Reset mật khẩu và gửi email mới
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
