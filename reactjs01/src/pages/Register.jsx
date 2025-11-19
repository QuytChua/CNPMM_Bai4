import { Form, Input, Button } from "antd";
import axiosClient from "../util/axiosClient";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const { confirm, ...data } = values;

      await axiosClient.post("/register", data);

      alert("Đăng ký thành công!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi đăng ký");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto" }}>
      <h2>Register</h2>

      <Form layout="vertical" form={form} onFinish={onFinish}>
        {/* Username */}
        <Form.Item
          name="username"
          label="Username"
          rules={[
            { required: true, message: "Vui lòng nhập username" },
            { min: 3, message: "Username ít nhất 3 ký tự" },
          ]}
        >
          <Input placeholder="Nhập username" />
        </Form.Item>

        {/* Email */}
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        {/* Password */}
        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu" },
            { min: 6, message: "Mật khẩu ít nhất 6 ký tự" },
          ]}
          hasFeedback
        >
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>

        {/* Confirm Password */}
        <Form.Item
          name="confirm"
          label="Xác nhận mật khẩu"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Mật khẩu xác nhận không khớp")
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder="Nhập lại mật khẩu" />
        </Form.Item>

        {/* Button Create Account */}
        <Button type="primary" htmlType="submit" block>
          Register
        </Button>

        {/* Link Login */}
        <div style={{ marginTop: 10 }}>
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </div>
      </Form>
    </div>
  );
}
