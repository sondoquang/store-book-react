import { Button, Result } from "antd";
import { Link } from "react-router-dom";

const Success = () => {
  return (
    <Result
      status="success"
      title="Đặt hàng thành công"
      subTitle="Hệ thống đã ghi nhận thông tin đơn hàng của bạn."
      extra={[
        <Button type="primary" key="console">
          <Link to="/">Trang chủ</Link>
        </Button>,
        <Button key="buy">
          <Link to={`/orders/history`}>Lịch sử mua hàng</Link>
        </Button>,
      ]}
    />
  );
};
export default Success;
