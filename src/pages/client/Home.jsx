import { FilterTwoTone, ReloadOutlined } from "@ant-design/icons";
import { findAllCategories } from "@services/categoryService";
import { findAllProducts } from "@services/productService";
import { currencyFormatter } from "@utils/formatCurrency";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  InputNumber,
  Pagination,
  Rate,
  Row,
  Spin,
  Tabs,
} from "antd";
import Meta from "antd/es/card/Meta";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./home.scss";

const Home = () => {
  const [form] = Form.useForm();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [sortQuery, setSortQuery] = useState();
  const [filter, setFilter] = useState();
  const [range, setRange] = useState();

  const onFinish = (values) => {
    if (values.range.from && values.range.to) {
      if (values.range?.from >= 0 && values?.range?.to >= 0) {
        const rangeFilter = `from-${values?.range?.from}-to-${values?.range?.to}`;
        setRange(rangeFilter);
      }
    } else {
      setRange(undefined);
    }
    if (values?.category?.length > 0) {
      const criteria = values.category.join(",");
      setFilter(criteria);
    }
  };

  const handleChangeFilter = (changeValues, values) => {
    console.log({ changeValues, values });
    if (changeValues.category) {
      const filterCategory = values.category;
      if (filterCategory && filterCategory.length > 0) {
        const criteria = filterCategory.join(",");
        setFilter(criteria);
      } else {
        setFilter(undefined);
      }
    }
  };

  const handleReload = () => {
    form.resetFields();
    setRange(undefined);
    setFilter(undefined);
    setSortQuery(undefined);
  };

  useEffect(() => {
    const fetchAllProducts = async () => {
      setIsLoading(true);
      let query = `?pageNo=${pageNo}&pageSize=${pageSize}`;
      if (sortQuery) {
        query += `&sort=${sortQuery}`;
      }
      if (filter) {
        query += `&filter=${filter}`;
      }
      if (range) {
        query += `&range=${range}`;
      }
      const res = await findAllProducts(`/products${query}`);
      if (res && res.data) {
        setProducts(res.data.products);
        setPageNo(res.data.meta.currentPage);
        setPageSize(res.data.meta.pageSize);
        setTotalElements(res.data.meta.totalElements);
      }
      setIsLoading(false);
    };
    fetchAllProducts();
  }, [pageNo, pageSize, sortQuery, filter, range]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await findAllCategories();
      if (res && res.data) {
        setCategories(res.data);
      }
    };
    fetchCategories();
  }, []);

  const handleOnchangePage = (current, pageElements) => {
    if (current !== pageNo) {
      setPageNo(current);
    }
    if (pageElements !== pageSize) {
      setPageSize(pageSize);
    }
  };

  /**
   * default tabs item
   */
  const items = [
    {
      key: "-sold",
      label: "Phổ biến",
      children: <></>,
    },
    {
      key: "-createDate",
      label: "Hàng mới",
      children: <></>,
    },
    {
      key: "price",
      label: "Giá thấp đến cao",
      children: <></>,
    },
    {
      key: "-price",
      label: "Giá cao đến thấp",
      children: <></>,
    },
  ];

  return (
    <div
      className="container"
      style={{ background: "rgba(160, 160, 160, 0.5)" }}
    >
      <Row gutter={[16, 24]}>
        <Col className="gutter-row" lg={4} md={0} sm={0} xs={0}>
          <div
            style={{
              background: "#fff",
              borderRadius: "10px",
              padding: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontWeight: "bold" }}>
                <FilterTwoTone /> Bộ lọc tìm kiếm
              </span>
              <ReloadOutlined
                title="Reset"
                style={{ cursor: "pointer", color: "#212890" }}
                onClick={handleReload}
              ></ReloadOutlined>
            </div>
            <Form
              onFinish={onFinish}
              form={form}
              onValuesChange={(changeValues, values) =>
                handleChangeFilter(changeValues, values)
              }
            >
              <Form.Item
                name="category"
                label="Danh mục sản phẩm"
                labelCol={{ span: 24 }}
              >
                <Checkbox.Group>
                  <Row gutter={[10, 10]}>
                    {categories.map((category) => (
                      <Col span={24} key={category?.id}>
                        <Checkbox value={category?.id}>
                          {category?.name}
                        </Checkbox>
                      </Col>
                    ))}
                  </Row>
                </Checkbox.Group>
              </Form.Item>
              <Form.Item label="Khoảng giá" labelCol={{ span: 24 }}>
                <div
                  style={{ display: "flex", justifyContent: "space-betweens" }}
                >
                  <Form.Item name={["range", "from"]}>
                    <InputNumber
                      name="from"
                      min={0}
                      placeholder="đ từ"
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                    ></InputNumber>
                  </Form.Item>
                  <span>&nbsp;-&nbsp;</span>
                  <Form.Item name={["range", "to"]}>
                    <InputNumber
                      name="to"
                      min={0}
                      placeholder="đ đ"
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                    ></InputNumber>
                  </Form.Item>
                </div>
                <div>
                  <Button
                    onClick={() => form.submit()}
                    style={{ width: "100%", fontWeight: "bold" }}
                    type="primary"
                  >
                    Áp dụng
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </div>
        </Col>
        <Col
          className="gutter-row"
          lg={20}
          md={24}
          sm={24}
          xs={24}
          style={{
            background: "#fff",
            borderRadius: "10px",
          }}
        >
          <div style={{ padding: "1rem 1rem" }}>
            <Row>
              <Tabs
                defaultActiveKey="1"
                items={items}
                onChange={(value) => setSortQuery(value)}
              />
            </Row>
            <Spin spinning={isLoading} tip="Loading...">
              <Row className="list-items" gutter={[20, 20]}>
                {products.map((product) => (
                  <Col lg={6} md={8} sm={12} key={product?.id}>
                    <Link to={`/books/${product.id}`}>
                      <Card
                        hoverable
                        style={{ border: "1px solid lightgray" }}
                        cover={
                          <img
                            style={{
                              padding: "1px 2px",
                              maxHeight: "280px",
                              objectFit: "contain",
                              height: "280px",
                            }}
                            alt="image"
                            src={`${
                              import.meta.env.VITE_HOST
                            }/storages/images/${product?.image.split(",")[0]}`}
                          />
                        }
                      >
                        <Meta
                          title={product?.name}
                          description={product?.shortDesc}
                        />
                        <p style={{ padding: ".5rem .3rem", color: "#2577c4" }}>
                          {currencyFormatter(product?.price, "vnd")}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Rate
                            style={{ fontSize: "12px" }}
                            disabled
                            defaultValue={4}
                          />
                          {product.sold != null ? (
                            <p>Đã bán {product?.sold}</p>
                          ) : (
                            <p>Đã bán 0 </p>
                          )}
                        </div>
                      </Card>
                    </Link>
                  </Col>
                ))}
              </Row>
            </Spin>
            <Divider />
            <Row style={{ display: "flex", justifyContent: "center" }}>
              <Pagination
                defaultCurrent={pageNo}
                total={totalElements}
                pageSize={pageSize}
                responsive
                onChange={(current, pageElements) =>
                  handleOnchangePage(current, pageElements)
                }
              />
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default Home;
