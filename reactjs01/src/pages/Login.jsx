import { Form, Input, Button } from "antd";
import axiosClient from "../util/axiosClient";
import { AuthContext } from "../components/context/AuthContext";
import { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const res = await axiosClient.post("/login", values);
      login(res.data.token);
      navigate("/");
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto" }}>
      <h2>Login</h2>

      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true }]}
        >
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>

        <div style={{ marginBottom: 15 }}>
          <Link to="/forgot-password">Quên mật khẩu?</Link>
        </div>

        <Button type="primary" htmlType="submit" block>
          Login
        </Button>

        <div style={{ marginTop: 10 }}>
          Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
        </div>
      </Form>
    </div>
  );
}
