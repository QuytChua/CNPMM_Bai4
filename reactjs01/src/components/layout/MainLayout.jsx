import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const { Header, Content } = Layout;

export default function MainLayout({ children }) {
  const { token, user, logout, isAdmin } = useContext(AuthContext);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header>
        <Menu theme="dark" mode="horizontal">
          <Menu.Item key="1">
            <Link to="/">Home</Link>
          </Menu.Item>

          {!token && (
            <>
              <Menu.Item key="2">
                <Link to="/login">Login</Link>
              </Menu.Item>

              <Menu.Item key="3">
                <Link to="/register">Register</Link>
              </Menu.Item>

              <Menu.Item key="4">
                <Link to="/forgot-password">Forgot Password</Link>
              </Menu.Item>
            </>
          )}

          {token && isAdmin() && (
            <Menu.Item key="admin">
              <Link to="/add-product">Thêm Sản Phẩm</Link>
            </Menu.Item>
          )}

          {token && (
            <>
              <Menu.Item key="user" disabled>
                Xin chào {user?.email}
              </Menu.Item>
              <Menu.Item key="5" onClick={logout}>
                Logout
              </Menu.Item>
            </>
          )}
        </Menu>
      </Header>

      <Content style={{ padding: 20 }}>{children}</Content>
    </Layout>
  );
}
