import { Steps } from "antd";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

const OrderPage = () => {
  const [steps, setSteps] = useState(0);
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/orders") {
      setSteps(0);
    } else if (location.pathname === "/orders/checkout") {
      setSteps(1);
    } else {
      setSteps(2);
    }
  }, [location]);
  return (
    <>
      <div
        className="container"
        style={{ background: "rgba(160, 160, 160, 0.5)" }}
      >
        <div>
          <Steps
            style={{
              padding: "1rem 2rem",
              background: "#fff",
              borderRadius: "4px",
              marginBottom: "1rem",
            }}
            size="small"
            current={steps}
            items={[
              {
                title: "Đơn hàng",
              },
              {
                title: "Đăt hàng",
              },
              {
                title: "Thanh toán",
              },
            ]}
          />
        </div>
        <Outlet />
      </div>
    </>
  );
};
export default OrderPage;
