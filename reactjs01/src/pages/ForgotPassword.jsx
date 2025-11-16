import { Form, Input, Button } from "antd";
import axiosClient from "../util/axiosClient";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function ForgotPassword() {
  const [newPass, setNewPass] = useState("");

  const onFinish = async (values) => {
    try {
      const res = await axiosClient.post("/forgot-password", values);
      setNewPass(res.data.newPassword);
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto" }}>
      <h2>Quên mật khẩu</h2>

      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input placeholder="Nhập email đăng ký" />
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          Lấy mật khẩu mới
        </Button>

        <div style={{ marginTop: 10 }}>
          <Link to="/login">Quay lại đăng nhập</Link>
        </div>
      </Form>
      {newPass && (
        <div
          style={{
            marginTop: 20,
            padding: 10,
            border: "1px solid #ccc",
            background: "#f9f9f9",
          }}
        >
          <strong>Mật khẩu mới của bạn:</strong>
          <div style={{ marginTop: 5, fontSize: 18 }}>{newPass}</div>
        </div>
      )}
    </div>
  );
}
