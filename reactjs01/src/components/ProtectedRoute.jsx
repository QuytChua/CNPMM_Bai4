import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { Alert } from "antd";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { token, isAdmin } = useContext(AuthContext);

  // Chưa đăng nhập
  if (!token) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Alert
          message="Yêu cầu đăng nhập"
          description="Bạn cần đăng nhập để truy cập trang này."
          type="warning"
          showIcon
          style={{ marginBottom: 20 }}
        />
        <p>
          <a href="/login">Đi tới trang đăng nhập</a>
        </p>
      </div>
    );
  }

  // Cần quyền admin nhưng không phải admin
  if (requireAdmin && !isAdmin()) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Alert
          message="Không có quyền truy cập"
          description="Bạn không có quyền admin để truy cập trang này."
          type="error"
          showIcon
          style={{ marginBottom: 20 }}
        />
        <p>
          <a href="/">Quay lại trang chủ</a>
        </p>
      </div>
    );
  }

  return children;
}
