import { Form, Input, Button } from "antd";
import axiosClient from "../util/axiosClient";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await axiosClient.post("/register", values);
      alert("Đăng ký thành công!");
      navigate("/login");
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto" }}>
      <h2>Register</h2>

      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true }]}
        >
          <Input placeholder="Nhập username" />
        </Form.Item>

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

        <Button type="primary" htmlType="submit" block>
          Register
        </Button>

        <div style={{ marginTop: 10 }}>
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </div>
      </Form>
    </div>
  );
}
