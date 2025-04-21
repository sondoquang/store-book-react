import { BookOutlined, HomeOutlined, OrderedListOutlined, UserOutlined } from "@ant-design/icons";

export const menuItems = [
  {
    key: "1",
    icon: <HomeOutlined />,
    label: "Dashboard",
  },
  {
    key: "2",
    icon: <UserOutlined />,
    label: "Manager Users",
  },
  {
    key: "3",
    icon: <BookOutlined />,
    label: "Manager Books",
  },
  {
    key: "4",
    icon: <OrderedListOutlined />,
    label: "Manager Orders",
  },
]