import React, { useState } from "react";
import "./layoutAdmin.css";
import {
  BookOutlined,
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  OrderedListOutlined,
  SignatureOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Col,
  Dropdown,
  Layout,
  Menu,
  Row,
  Space,
} from "antd";
import { Link, Navigate, Outlet } from "react-router-dom";
import { useAppContext } from "@context/AppContext";
import { logoutApi } from "@services/authService";
const { Header, Sider, Content } = Layout;
const LayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, setUser, isAuthenticated, setIsAuthenticated } =
    useAppContext();

  const menuItems = [
    {
      key: "dashboard",
      icon: <HomeOutlined />,
      label: <Link to="/admin">Dashboard</Link>,
    },
    {
      key: "users",
      label: "Users",
      icon: <UserOutlined />,
      children: [
        {
          key: "users-01",
          label: <Link to="/admin/users">CRUD Users</Link>,
        },
      ],
    },
    {
      key: "products",
      icon: <BookOutlined />,
      label: <Link to="/admin/books">Manager Books</Link>,
    },
    {
      key: "orders",
      icon: <OrderedListOutlined />,
      label: <Link to="/admin/orders">Manager Orders</Link>,
    },
  ];

  const handleLogout = async () => {
    const response = await logoutApi();
    if (response?.statusCode === 200) {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("accessToken");
      <Navigate to={`/login`} replace />;
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

  return (
    <Layout className="site--layout">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="site--layout--background"
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="#5f4af5"
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          items={menuItems}
        />
      </Sider>
      <Layout className="side-right">
        <Header className="header--admin">
          <Row>
            <Col lg={20} md={16}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: "16px",
                  width: 64,
                  height: 64,
                }}
              />
            </Col>
            <Col lg={4} md={8}>
              <div className="header--admin--avatar">
                <Space size="middle" className="header--right--user">
                  <Badge className="avatar-icon">
                    <Avatar shape="square" icon={<UserOutlined />} />
                  </Badge>
                  <Dropdown menu={{ items: items }}>
                    <Space>
                      <Button>
                        <div className="desktop-account">
                          {!isAuthenticated ? (
                            <Link to="/login">Tài khoản</Link>
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
        </Header>
        <Content className="side-right-content" style={{}}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default LayoutAdmin;
