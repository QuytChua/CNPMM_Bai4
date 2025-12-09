import * as userService from "../services/userService.js";

// Đăng ký tài khoản mới
export const handleRegister = async (req, res) => {
  try {
    const result = await userService.register(req.body);
    res.json({ message: "Đăng ký thành công", user: result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}; // Đăng nhập và tạo JWT token
export const handleLogin = async (req, res) => {
  try {
    const result = await userService.login(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}; // Reset mật khẩu và gửi email
export const handleForgotPassword = async (req, res) => {
  try {
    await userService.forgotPassword(req.body.email);
    res.json({ message: "Đã gửi mật khẩu mới đến email của bạn!" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
