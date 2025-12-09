import { useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  Switch,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import axiosClient from "../util/axiosClient";

const { TextArea } = Input;
const { Option } = Select;

export default function AddProduct() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const categories = [
    { value: "phone", label: "Điện thoại" },
    { value: "laptop", label: "Laptop" },
    { value: "device", label: "Thiết bị" },
    { value: "accessory", label: "Phụ kiện" },
    { value: "headphone", label: "Tai nghe" },
    { value: "watch", label: "Đồng hồ" },
  ];

  const onFinish = async (values) => {
    try {
      setLoading(true);

      // Chuẩn bị dữ liệu gửi lên server
      const productData = {
        name: values.name,
        price: values.price,
        category: values.category,
        description: values.description,
        image: values.image || "",
        isPromotion: values.isPromotion || false,
        discountPercent: values.isPromotion ? values.discountPercent : 0,
        views: values.views || 0,
      };

      await axiosClient.post("/products", productData);

      message.success("Tạo sản phẩm thành công!");
      form.resetFields();

      // Chuyển về trang home sau 1.5s
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Error creating product:", error);
      const errorMsg = error.response?.data?.message || "Lỗi tạo sản phẩm";
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2>Thêm Sản Phẩm Mới</h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          isPromotion: false,
          discountPercent: 0,
          views: 0,
        }}
      >
        <Form.Item
          name="name"
          label="Tên sản phẩm"
          rules={[
            { required: true, message: "Vui lòng nhập tên sản phẩm" },
            { min: 3, message: "Tên sản phẩm phải có ít nhất 3 ký tự" },
          ]}
        >
          <Input placeholder="Nhập tên sản phẩm" />
        </Form.Item>

        <Form.Item
          name="price"
          label="Giá (VNĐ)"
          rules={[
            { required: true, message: "Vui lòng nhập giá" },
            {
              type: "number",
              min: 1000,
              message: "Giá phải lớn hơn 1,000 VNĐ",
            },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            placeholder="Nhập giá sản phẩm"
          />
        </Form.Item>

        <Form.Item
          name="category"
          label="Danh mục"
          rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
        >
          <Select placeholder="Chọn danh mục">
            {categories.map((cat) => (
              <Option key={cat.value} value={cat.value}>
                {cat.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
          rules={[
            { required: true, message: "Vui lòng nhập mô tả" },
            { min: 10, message: "Mô tả phải có ít nhất 10 ký tự" },
          ]}
        >
          <TextArea rows={4} placeholder="Nhập mô tả chi tiết sản phẩm" />
        </Form.Item>

        <Form.Item name="image" label="Đường dẫn hình ảnh">
          <Input placeholder="Nhập URL hình ảnh (tùy chọn)" />
        </Form.Item>

        <Form.Item
          name="isPromotion"
          label="Có khuyến mãi"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.isPromotion !== currentValues.isPromotion
          }
        >
          {({ getFieldValue }) =>
            getFieldValue("isPromotion") ? (
              <Form.Item
                name="discountPercent"
                label="Phần trăm giảm giá (%)"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập phần trăm giảm giá",
                  },
                  {
                    type: "number",
                    min: 1,
                    max: 90,
                    message: "Giảm giá từ 1-90%",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={1}
                  max={90}
                  placeholder="Nhập % giảm giá"
                />
              </Form.Item>
            ) : null
          }
        </Form.Item>

        <Form.Item name="views" label="Lượt xem ban đầu">
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            placeholder="Số lượt xem (mặc định 0)"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Tạo Sản Phẩm
          </Button>
        </Form.Item>

        <Form.Item>
          <Button onClick={() => navigate("/")} block>
            Quay lại trang chủ
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
