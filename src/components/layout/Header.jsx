import {
  EditOutlined,
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  MenuOutlined,
  ShoppingCartOutlined,
  SignatureOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Badge, Button, Drawer, Dropdown, Popover, Space } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "@context/AppContext";
import { logoutApi } from "@services/authService";
import "./header.css";
import { Input, Row, Col } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { currencyFormatter } from "@utils/formatCurrency";
import UpdateUser from "@components/client/user/UpdateUser";
import ChangePassword from "@components/client/user/ChangePassword";

const Header = () => {
  const { user, setUser, isAuthenticated, setIsAuthenticated, carts } =
    useAppContext();
  const [open, setOpen] = useState(false);
  const [isOpenModelUpdateInfo, setIsOpenModelUpdateInfo] = useState(false);
  const [isOpenModelChangePassword, setIsOpenModelChangePassword] =
    useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    const response = await logoutApi();
    if (response?.statusCode === 200) {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("accessToken");
      setOpen(false); // Đóng drawer sau khi đăng xuất
    }
  };

  let items = [];
  if (isAuthenticated) {
    items = [
      {
        label: <Link to="/admin">Quản lý</Link>,
        key: "1",
        icon: <UserOutlined />,
      },
      {
        label: <Link to="/">Trang chủ</Link>,
        key: "2",
        icon: <HomeOutlined />,
      },
      {
        label: (
          <p onClick={() => setIsOpenModelUpdateInfo(true)}>
            Cập nhật thông tin
          </p>
        ),
        key: "3",
        icon: <EditOutlined />,
      },
      {
        label: (
          <a href="#" onClick={() => setIsOpenModelChangePassword(true)}>
            Đổi mật khẩu
          </a>
        ),
        key: "4",
        icon: <EditOutlined />,
      },
      {
        label: (
          <p onClick={handleLogout} style={{ color: "#1677ff" }}>
            Đăng xuất
          </p>
        ),
        key: "5",
        icon: <LogoutOutlined />,
      },
    ];
  } else {
    items = [
      {
        label: <Link to="/login">Đăng nhập</Link>,
        key: "4",
        icon: <LoginOutlined />,
      },
      {
        label: <Link to="/">Trang chủ</Link>,
        key: "5",
        icon: <HomeOutlined />,
      },
      {
        label: <Link to="/register">Đăng kí</Link>,
        key: "6",
        icon: <SignatureOutlined />,
      },
    ];
  }

  const contentPopover = () => {
    return (
      <>
        {carts?.map((item) => (
          <div key={item.id} className="popover-cart">
            <div className="popover-cart-img">
              <img
                src={`${import.meta.env.VITE_HOST}/storages/images/${
                  item.detail.image.split(",")[0]
                }`}
                alt="Image Product"
              />
            </div>
            <div className="popover-cart-content">
              <p className="popover-cart-content_title">{item.detail.name}</p>
              <p className="popover-cart-content_price">
                {currencyFormatter(item.detail.price, "vnd")}
              </p>
            </div>
          </div>
        ))}
        <div className="btnAction">
          <Button className="btnCheckOut">
            <Link to="/orders">Xem giỏ hàng</Link>
          </Button>
        </div>
      </>
    );
  };

  return (
    <div className="container">
      <Row style={{ alignItems: "center" }}>
        <Col xs={3} sm={3} md={3} lg={4} xl={4}>
          <div className="header--logo">
            {/* Icon menu cho mobile */}
            <div className="mobile-menu-icon" onClick={showDrawer}>
              <MenuOutlined style={{ fontSize: "24px", color: "#000" }} />
            </div>
            {/* Logo cho desktop */}
            <div className="desktop-logo">
              <Link to="/">
                <h2>STLang </h2>
              </Link>
            </div>
          </div>
        </Col>
        <Col xs={18} sm={18} md={18} lg={15} xl={15}>
          <Input
            size="large"
            placeholder="Tìm kiếm sản phẩm tại đây"
            prefix={<SearchOutlined />}
          />
        </Col>
        <Col
          xs={3}
          sm={3}
          md={3}
          lg={5}
          xl={5}
          style={{ justifyItems: "right" }}
        >
          <div className="header--right">
            <Space size="middle">
              <Popover
                rootClassName="popover-cart-body"
                placement="bottomRight"
                title={"Giỏ hàng của bạn"}
                content={contentPopover}
                arrow={true}
              >
                <Badge count={carts ? carts.length : 0} className="cart-icon">
                  <ShoppingCartOutlined
                    style={{ fontSize: "24px", color: "#009ACD" }}
                  />
                </Badge>
              </Popover>
            </Space>
            <Space size="middle" className="header--right--user">
              <Badge className="avatar-icon">
                <Avatar shape="square" icon={<UserOutlined />} />
              </Badge>
              <Dropdown menu={{ items: items }}>
                <Space>
                  <Button>
                    <div className="desktop-account">
                      {!isAuthenticated ? (
                        <Link to="/admin">Tài khoản</Link>
                      ) : (
                        <span>{user?.fullName}</span>
                      )}
                    </div>
                  </Button>
                </Space>
              </Dropdown>
            </Space>
          </div>
        </Col>
      </Row>

      {/* Drawer menu cho mobile */}
      <Drawer title="Menu" placement="left" onClose={onClose} open={open}>
        {items.map((item) => (
          <div
            key={item.key}
            style={{ display: "flex", gap: "1rem", marginBottom: "16px" }}
          >
            {item.icon}
            {item.label}
          </div>
        ))}
      </Drawer>
      <UpdateUser
        isOpen={isOpenModelUpdateInfo}
        setIsOpen={setIsOpenModelUpdateInfo}
      />
      <ChangePassword
        isOpen={isOpenModelChangePassword}
        setIsOpen={setIsOpenModelChangePassword}
      />
    </div>
  );
};

export default Header;
