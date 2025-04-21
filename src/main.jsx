import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout.jsx";
import BookPage from "@pages/client/Book.jsx";
import AboutPage from "@pages/client/About.jsx";
import HomePage from "@pages/client/Home.jsx";
import LoginPage from "@pages/client/auth/Login.jsx";
import RegisterPage from "@pages/client/auth/Register.jsx";
import "@styles/global.scss";
import { App, ConfigProvider } from "antd";
import Dashboard from "@pages/admin/Dashboard";
import BookAPage from "@pages/admin/BookAPage";
import OrderAPage from "@pages/admin/OrderAPage";
import UserAPage from "@pages/admin/UserAPage";
import LayoutAdmin from "@components/layout/LayoutAdmin";
import { AppProvider } from "@context/AppContext";
import enUS from "antd/locale/en_US";
import ProtectedRoute from "@components/auth/ProtectedRoute";
import "./components/client/book/popoverCart.scss";
import OrderPage from "@pages/client/OrderPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/books/:id",
        element: <BookPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/orders",
        element: <OrderPage />,
      },
      {
        path: "/checkout",
        element: (
          <ProtectedRoute>
            <div>Checkout Page</div>
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/admin",
    element: <LayoutAdmin />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/books",
        element: (
          <ProtectedRoute>
            <BookAPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/orders",
        element: (
          <ProtectedRoute>
            <OrderAPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/users",
        element: (
          <ProtectedRoute>
            <UserAPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App>
      <AppProvider>
        <ConfigProvider locale={enUS}>
          <RouterProvider router={router} />
        </ConfigProvider>
      </AppProvider>
    </App>
  </StrictMode>
);
