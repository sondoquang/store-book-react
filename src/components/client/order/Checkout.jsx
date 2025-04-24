import {
  App,
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Table,
} from "antd";
import "./OrderDetail.scss";
import { useAppContext } from "@context/AppContext";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { currencyFormatter } from "@utils/formatCurrency";
import TextArea from "antd/es/input/TextArea";
import { useNavigate } from "react-router-dom";
import { create } from "@services/orderService";

const Checkout = () => {
  const [form] = Form.useForm();
  const { carts, setCarts, user } = useAppContext();
  const navigate = useNavigate();

  const [totalPrice, setTotalPrice] = useState(0);
  const { message, notification } = App.useApp();

  useEffect(() => {
    if (carts && carts?.length > 0) {
      let sum = 0;
      carts?.map((item) => {
        sum += item.detail.price * item.quantity;
      });
      setTotalPrice(sum);
    } else {
      setTotalPrice(0);
    }
  }, [carts]);

  useEffect(() => {
    form.setFieldsValue({
      fullname: user?.fullName,
      paymentMethod: "COD",
    });
  }, []);

  const dataSource = carts?.map((cart) => ({
    ...cart.detail,
    quantity: cart.quantity,
    key: cart.id,
    total: cart.quantity * cart.detail.price,
  }));

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
      render: (value, text) => <InputNumber disabled value={text.quantity} />,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
    },
  ];

  const onFinish = async (values) => {
    console.log(values);
    const cartsLocal = localStorage.getItem("carts");
    let carts;
    if (cartsLocal) {
      carts = JSON.parse(cartsLocal);
      const details = carts.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        productName: item.detail.name,
      }));
      const data = {
        ...values,
        totalPrice: totalPrice,
        username: user.username,
        details,
      };
      const res = await create(data);
      if (res?.status == 400) {
        notification.error({
          message: "Tạo đơn hàng thất bại",
          description: res.errorMessage,
        });
      } else {
        // Xoa gio hang: AppContext va LocalStorage //
        localStorage.removeItem("carts");
        setCarts([]);
        // Chuyen huong den trang dat hang thanh cong //
        message.success("Tạo đơn hàng thành công");
        navigate("/orders/success");
      }
    }
  };

  const handleReturn = () => {
    navigate("/orders");
  };

  return (
    <div className="wrapper-order">
      <Row gutter={[20, 20]}>
        <Col lg={18} md={24} sm={24} xs={24}>
          <Table
            dataSource={dataSource}
            columns={columns}
            className="table-order"
          />
          <p
            onClick={() => handleReturn()}
            style={{ fontWeight: "bold", cursor: "pointer" }}
          >
            <ArrowLeftOutlined />
            &nbsp; Quay lại
          </p>
        </Col>
        <Col lg={6} md={24} sm={24} xs={24}>
          <div className="info-order">
            <Form
              form={form}
              name="basic"
              layout="vertical"
              labelCol={{ span: 16 }}
              wrapperCol={{ span: 24 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item label="Hình thức thanh toán" name="paymentMethod">
                <Radio.Group
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: ".4rem",
                  }}
                  options={[
                    {
                      value: "COD",
                      label: "Thanh toán khi nhận hàng",
                    },
                    { value: "CARD", label: "Chuyển khoản ngân hàng" },
                  ]}
                />
              </Form.Item>
              <Form.Item
                label="Họ Tên"
                name="fullname"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền họ tên người nhận hàng!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền số điện thoại người nhận hàng!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Địa chỉ"
                name="address"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền địa chỉ người nhận hàng!",
                  },
                ]}
              >
                <TextArea></TextArea>
              </Form.Item>

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
              <Row
                style={{ justifyContent: "end", marginTop: "1rem" }}
                gutter={[10, 10]}
              >
                <Button className="button-buy" onClick={() => form.submit()}>
                  Đặt hàng ({carts.length})
                </Button>
              </Row>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default Checkout;
