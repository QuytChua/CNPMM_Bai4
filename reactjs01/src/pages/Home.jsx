import { useEffect, useState } from "react";
import axiosClient from "../util/axiosClient";
import { Select, Card, Pagination, Row, Col } from "antd";

const { Option } = Select;

export default function Home() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50, // Hiển thị 50 sản phẩm mỗi trang
    total: 0,
  });

  const fetchProducts = async (page = 1, categoryValue = category) => {
    try {
      console.log("Fetching products...", { page, categoryValue });

      // Tạo params object, chỉ thêm category nếu có giá trị
      const params = {
        page,
        limit: pagination.limit,
      };

      // Chỉ thêm category vào params nếu có giá trị
      if (categoryValue && categoryValue !== "") {
        params.category = categoryValue;
      }

      console.log("Request params:", params);

      const res = await axiosClient.get("/products", { params });
      console.log("Products response:", res.data);
      setProducts(res.data.items);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        console.log("Loading initial products...");
        const res = await axiosClient.get("/products", {
          params: {
            page: 1,
            limit: 50, // Tải 50 sản phẩm trong lần đầu
            // Không gửi category parameter để lấy tất cả
          },
        });
        console.log("Initial products response:", res.data);
        setProducts(res.data.items);
        setPagination(res.data.pagination);
      } catch (error) {
        console.error("Error loading initial products:", error);
      }
    };
    loadProducts();
  }, []);

  const handleCategoryChange = (value) => {
    setCategory(value);
    fetchProducts(1, value);
  };

  const handlePageChange = (page) => {
    fetchProducts(page);
  };

  return (
    <div>
      <h2>Danh sách sản phẩm</h2>

      <div style={{ marginBottom: 20 }}>
        <span>Danh mục: </span>
        <Select
          style={{ width: 200 }}
          value={category}
          onChange={handleCategoryChange}
        >
          <Option value="">Tất cả</Option>
          <Option value="phone">Điện thoại</Option>
          <Option value="laptop">Laptop</Option>
          <Option value="book">Sách</Option>
          <Option value="device">Thiết bị</Option>
          <Option value="accessory">Phụ kiện</Option>
        </Select>
      </div>

      <Row gutter={[16, 16]}>
        {products.map((p) => (
          <Col xs={24} sm={12} md={8} lg={6} key={p._id}>
            <Card
              title={p.name}
              extra={<span>{p.price.toLocaleString()} đ</span>}
              cover={
                p.image && (
                  <img
                    alt={p.name}
                    src={p.image}
                    style={{ height: 150, objectFit: "cover" }}
                  />
                )
              }
            >
              <p>{p.description}</p>
              <p>Danh mục: {p.category}</p>
            </Card>
          </Col>
        ))}
      </Row>

      <div style={{ textAlign: "center", marginTop: 20 }}>
        <Pagination
          current={pagination.page}
          pageSize={pagination.limit}
          total={pagination.total}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
}
