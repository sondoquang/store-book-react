import { App, Button, Col, Empty, InputNumber, Row, Table } from "antd";
import "./OrderDetail.scss";
import { useAppContext } from "@context/AppContext";
import { DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { currencyFormatter } from "@utils/formatCurrency";
import { useNavigate } from "react-router-dom";

const OrderDetail = () => {
  const { carts, setCarts } = useAppContext();
  const navigate = useNavigate();

  const [totalPrice, setTotalPrice] = useState(0);
  const { notification } = App.useApp();
  useEffect(() => {
    if (carts && carts.length > 0) {
      let sum = 0;
      carts.map((item) => {
        sum += item.detail.price * item.quantity;
      });
      setTotalPrice(sum);
    } else {
      setTotalPrice(0);
    }
  }, [carts]);

  const dataSource = carts.map((cart) => ({
    ...cart.detail,
    quantity: cart.quantity,
    key: cart.id,
    total: cart.quantity * cart.detail.price,
  }));

  const handleChangeInput = (value, book) => {
    if (!value || +value < 1) return;
    if (!isNaN(+value)) {
      const cartsLocal = localStorage.getItem("carts");
      if (cartsLocal && book) {
        const carts = JSON.parse(cartsLocal);

        let isExistIndex = carts.findIndex((item) => item.id === book.id);
        if (isExistIndex > -1) {
          carts[isExistIndex].quantity = +value;
        }
        localStorage.setItem("carts", JSON.stringify(carts));
        setCarts(carts);
      }
    }
  };

  const handleRemoveItem = (id) => {
    console.log(id);
    const cartsLocal = localStorage.getItem("carts");
    if (cartsLocal) {
      const carts = JSON.parse(cartsLocal);
      const newCarts = carts.filter((book) => book.id !== id);
      localStorage.setItem("carts", JSON.stringify(newCarts));
      setCarts(newCarts);
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (value) => (
        <div className="product-image">
          <img
            src={`${import.meta.env.VITE_HOST}/storages/images/${
              value.split(",")[0]
            }`}
            alt=""
          />
        </div>
      ),
    },
    {
      title: "Title",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "id",
      render: (value, text) => (
        <InputNumber
          value={text.quantity}
          onChange={(vlu) => handleChangeInput(vlu, text)}
        />
      ),
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "Action",
      dataIndex: "remove",
      key: "remove",
      render: (value, text) => (
        <DeleteOutlined
          style={{ color: "red", cursor: "pointer" }}
          onClick={() => handleRemoveItem(text?.id)}
        />
      ),
    },
  ];

  const handleBuyBookButton = () => {
    if (carts.length < 1) {
      notification.error({
        message: "Không thể mua hàng !",
        description: "Giỏ hàng hiện không tồn tại sản phẩm",
      });
    } else {
      navigate("/orders/checkout");
    }
  };

  return (
    <div className="wrapper-order">
      <Row gutter={[20, 20]}>
        <Col lg={18} md={18}>
          {carts.length > 0 && (
            <Table
              dataSource={dataSource}
              columns={columns}
              className="table-order"
            />
          )}
          {carts.length <= 0 && <Empty />}
        </Col>
        <Col lg={6} md={6}>
          <div className="info-order">
            <Row>
              <Col span={12}>Tạm tính</Col>
              <Col span={12} style={{ textAlign: "right" }}>
                {currencyFormatter(totalPrice, "vnd")}
              </Col>
            </Row>
            <Row>
              <Col span={12}>Tổng tiền</Col>
              <Col span={12} style={{ textAlign: "right" }}>
                {currencyFormatter(totalPrice, "vnd")}
              </Col>
            </Row>
            <Button
              className="button-buy"
              onClick={() => {
                handleBuyBookButton();
              }}
            >
              Mua Hàng ({carts.length})
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default OrderDetail;
