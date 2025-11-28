import { useEffect, useState } from "react";
import axiosClient from "../util/axiosClient";
import {
  Select,
  Card,
  Pagination,
  Row,
  Col,
  Input,
  Space,
  Slider,
  Switch,
  Typography,
  Tag,
  Button,
  Collapse,
} from "antd";

const { Option } = Select;
const { Search } = Input;
const { Title, Text } = Typography;
const { Panel } = Collapse;

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Tìm kiếm và lọc
  const [searchParams, setSearchParams] = useState({
    q: "",
    category: "",
    minPrice: 0,
    maxPrice: 50000000,
    promo: undefined,
    // minViews: undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 12,
  });

  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    priceRange: { minPrice: 0, maxPrice: 50000000 },
    sortOptions: [],
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  // Load filter options when component mounts
  useEffect(() => {
    loadFilterOptions();
  }, []);

  // Load products when search params change
  useEffect(() => {
    searchProducts();
  }, [searchParams]);

  const loadFilterOptions = async () => {
    try {
      const res = await axiosClient.get("/products/filter-options");
      if (res.data.success) {
        setFilterOptions(res.data.data);
        // Update price range in search params
        setSearchParams((prev) => ({
          ...prev,
          maxPrice: res.data.data.priceRange.maxPrice,
        }));
      }
    } catch (error) {
      console.error("Error loading filter options:", error);
    }
  };

  const searchProducts = async () => {
    try {
      setLoading(true);

      // Clean up params - remove undefined values
      const cleanParams = Object.entries(searchParams).reduce(
        (acc, [key, value]) => {
          if (value !== undefined && value !== "" && value !== null) {
            acc[key] = value;
          }
          return acc;
        },
        {}
      );

      console.log("Search params:", cleanParams);

      const res = await axiosClient.get("/products/search", {
        params: cleanParams,
      });

      if (res.data.success) {
        setProducts(res.data.data.items);
        setPagination(res.data.data.pagination);
      }
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchParams((prev) => ({
      ...prev,
      q: value,
      page: 1,
    }));
  };

  const handleFilterChange = (key, value) => {
    setSearchParams((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const handlePageChange = (page) => {
    setSearchParams((prev) => ({
      ...prev,
      page,
    }));
  };

  const resetFilters = () => {
    setSearchParams({
      q: "",
      category: "",
      minPrice: filterOptions.priceRange.minPrice,
      maxPrice: filterOptions.priceRange.maxPrice,
      promo: undefined,
      // minViews: undefined,
      sortBy: "createdAt",
      sortOrder: "desc",
      page: 1,
      limit: 12,
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Tìm kiếm sản phẩm</Title>

      {/* Search and Filters */}
      <div style={{ marginBottom: 24 }}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* Search Bar */}
          <Search
            placeholder="Tìm kiếm sản phẩm..."
            allowClear
            size="large"
            onSearch={handleSearch}
            style={{ maxWidth: 600 }}
          />

          {/* Filters */}
          <Collapse>
            <Panel header="Bộ lọc nâng cao" key="1">
              <Row gutter={[16, 16]}>
                {/* Category Filter */}
                <Col xs={24} sm={12} md={6}>
                  <Text strong>Danh mục:</Text>
                  <Select
                    style={{ width: "100%", marginTop: 8 }}
                    placeholder="Chọn danh mục"
                    allowClear
                    value={searchParams.category || undefined}
                    onChange={(value) => handleFilterChange("category", value)}
                  >
                    {filterOptions.categories.map((cat) => (
                      <Option key={cat} value={cat}>
                        {cat}
                      </Option>
                    ))}
                  </Select>
                </Col>

                {/* Price Range */}
                <Col xs={24} sm={12} md={8}>
                  <Text strong>Khoảng giá:</Text>
                  <div style={{ marginTop: 8 }}>
                    <Slider
                      range
                      min={filterOptions.priceRange.minPrice}
                      max={filterOptions.priceRange.maxPrice}
                      value={[searchParams.minPrice, searchParams.maxPrice]}
                      onChange={(value) => {
                        handleFilterChange("minPrice", value[0]);
                        handleFilterChange("maxPrice", value[1]);
                      }}
                      tooltip={{
                        formatter: (value) => `${value?.toLocaleString()} đ`,
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "12px",
                      }}
                    >
                      <span>{searchParams.minPrice?.toLocaleString()} đ</span>
                      <span>{searchParams.maxPrice?.toLocaleString()} đ</span>
                    </div>
                  </div>
                </Col>

                {/* Promotion Filter */}
                <Col xs={24} sm={12} md={4}>
                  <Text strong>Khuyến mãi:</Text>
                  <div style={{ marginTop: 8 }}>
                    <Switch
                      checked={searchParams.promo === true}
                      onChange={(checked) =>
                        handleFilterChange("promo", checked ? true : undefined)
                      }
                      checkedChildren="Có"
                      unCheckedChildren="Tất cả"
                    />
                  </div>
                </Col>

                {/* Sort Options */}
                <Col xs={24} sm={12} md={6}>
                  <Text strong>Sắp xếp:</Text>
                  <Space style={{ marginTop: 8, width: "100%" }}>
                    <Select
                      style={{ flex: 1 }}
                      value={searchParams.sortBy}
                      onChange={(value) => handleFilterChange("sortBy", value)}
                    >
                      <Option value="createdAt">Mới nhất</Option>
                      <Option value="price">Giá</Option>
                      {/* <Option value="views">Lượt xem</Option> */}
                      <Option value="discountPercent">Khuyến mãi</Option>
                    </Select>
                    <Select
                      style={{ width: 80 }}
                      value={searchParams.sortOrder}
                      onChange={(value) =>
                        handleFilterChange("sortOrder", value)
                      }
                    >
                      <Option value="asc">Tăng</Option>
                      <Option value="desc">Giảm</Option>
                    </Select>
                  </Space>
                </Col>
              </Row>

              <Row style={{ marginTop: 16 }}>
                <Col>
                  <Button onClick={resetFilters}>Đặt lại bộ lọc</Button>
                </Col>
              </Row>
            </Panel>
          </Collapse>
        </Space>
      </div>

      {/* Search Results Info */}
      <div style={{ marginBottom: 16 }}>
        <Text>
          Tìm thấy <strong>{pagination.total}</strong> sản phẩm
          {searchParams.q && (
            <span>
              {" "}
              cho từ khóa "<strong>{searchParams.q}</strong>"
            </span>
          )}
        </Text>
        {searchParams.category && (
          <Tag color="blue" style={{ marginLeft: 8 }}>
            Danh mục: {searchParams.category}
          </Tag>
        )}
        {searchParams.promo && (
          <Tag color="red" style={{ marginLeft: 8 }}>
            Có khuyến mãi
          </Tag>
        )}
      </div>

      {/* Products Grid */}
      <Row gutter={[16, 16]}>
        {products.map((product) => (
          <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
            <Card
              hoverable
              loading={loading}
              cover={
                product.image && (
                  <img
                    alt={product.name}
                    src={product.image}
                    style={{ height: 200, objectFit: "cover" }}
                  />
                )
              }
              // actions={[
              //   <Text key="views">👁 {product.views || 0}</Text>,
              //   <Text key="rating">⭐ {product.rating || 0}</Text>,
              // ]}
            >
              <Card.Meta
                title={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: "14px" }}>{product.name}</span>
                    {product.discountPercent > 0 && (
                      <Tag color="red" size="small">
                        -{product.discountPercent}%
                      </Tag>
                    )}
                  </div>
                }
                description={
                  <div>
                    <Text strong style={{ color: "#f50", fontSize: "16px" }}>
                      {product.price?.toLocaleString()} đ
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      {product.category}
                    </Text>
                    <br />
                    <Text ellipsis style={{ fontSize: "12px" }}>
                      {product.description}
                    </Text>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Empty State */}
      {products.length === 0 && !loading && (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Text type="secondary">Không tìm thấy sản phẩm nào</Text>
        </div>
      )}

      {/* Pagination */}
      {pagination.total > 0 && (
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Pagination
            current={pagination.page}
            pageSize={pagination.limit}
            total={pagination.total}
            onChange={handlePageChange}
            showSizeChanger={false}
            showQuickJumper
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} của ${total} sản phẩm`
            }
          />
        </div>
      )}
    </div>
  );
}
