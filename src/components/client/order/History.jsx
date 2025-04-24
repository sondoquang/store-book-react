import { getAllOrders } from "@services/orderService";
import { Table, Tag } from "antd";
import { useEffect, useState } from "react";
import Render from "./Render";

const History = () => {
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await getAllOrders();
      if (res && res.data) {
        setOrders(res.data);
      }
    };
    fetchOrders();
  }, []);

  const dataSources = orders?.map((item) => ({
    ...item,
    key: item.id,
  }));

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Thời gian",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "price",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (value, record, index) => (
        <Tag color="green" key={index}>
          Đã thanh toán
        </Tag>
      ),
    },
    {
      title: "Chi tiết",
      render: (value, record) => (
        <p
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => {
            setOpen(true);
            setOrder(value);
          }}
        >
          Xem chi tiết
        </p>
      ),
    },
  ];

  return (
    <>
      <Table
        dataSource={dataSources}
        columns={columns}
        className="table-order"
      />
      <Render setOpen={setOpen} open={open} value={order} />
    </>
  );
};
export default History;
