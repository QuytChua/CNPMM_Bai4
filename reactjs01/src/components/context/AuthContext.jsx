import { createContext, useState } from "react";

export const AuthContext = createContext();

// Helper function để decode JWT token
const decodeToken = (token) => {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    // Chuyển đổi từ Base64URL sang Base64 trước khi decode
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(base64));
    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // Tính toán user từ token (không cần useEffect)
  const user = token ? decodeToken(token) : null;

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  // Kiểm tra có phải admin không
  const isAdmin = () => {
    return user && user.role === "admin";
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}
