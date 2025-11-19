import { Form, Input, Button } from "antd";
import axiosClient from "../util/axiosClient";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const onFinish = async (values) => {
    try {
      const res = await axiosClient.post("/forgot-password", values);
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi quên mật khẩu");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto" }}>
      <h2>Quên mật khẩu</h2>

      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input placeholder="Nhập email đăng ký" />
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          Lấy mật khẩu mới
        </Button>

        <div style={{ marginTop: 10 }}>
          <Link to="/login">Quay lại đăng nhập</Link>
        </div>
      </Form>
    </div>
  );
}
