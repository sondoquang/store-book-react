import React, { useState } from "react";
import "./layoutAdmin.css";
import {
  BookOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  OrderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Col, Layout, Menu, Row } from "antd";
import { Link, Outlet } from "react-router-dom";
import { useAppContext } from "@context/AppContext";
const { Header, Sider, Content } = Layout;
const LayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAppContext();

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
                <Avatar size="default" icon={<UserOutlined />}></Avatar>
                <p className="header-user-name">{user?.fullName}</p>
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
