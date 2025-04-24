import { Drawer } from "antd";

const Render = ({ setOpen, open, value }) => {
  return (
    <Drawer
      title="Chi tiết sản phẩm"
      onClose={() => setOpen(false)}
      open={open}
    >
      {(value.orderDetails || []).map((item) => (
        <div style={{ display: "flex", gap: "1rem" }}>
          <p>
            <strong>Tên sách: </strong>
            {item.name}
          </p>
          <p>
            <strong>Số lượng:</strong>
            {item.quantity}
          </p>
        </div>
      ))}
    </Drawer>
  );
};
export default Render;
