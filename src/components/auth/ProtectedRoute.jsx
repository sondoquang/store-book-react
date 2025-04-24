import { useAppContext } from "@context/AppContext";
import { fetchAccount } from "@services/accountService";
import { Button, Result } from "antd";
import { useEffect } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = (props) => {
  const { isAuthenticated, user, setIsAuthenticated, setUser } =
    useAppContext();

  const location = useLocation();

  useEffect(() => {
    const getAccount = async () => {
      const res = await fetchAccount();
      if (!res.data) {
        setIsAuthenticated(false);
        setUser(null);
      }
    };
    getAccount();
  }, []);

  if (location.pathname === "/orders") {
    if (!isAuthenticated) {
      localStorage.setItem("securityURI", location.pathname);
      localStorage.removeItem("accessToken");
      return <Navigate to="/login" replace />;
    }
  }

  if (isAuthenticated === false) {
    localStorage.setItem("securityURI", location.pathname);
    localStorage.removeItem("accessToken");
    return <Navigate to="/login" replace />;
  }

  const isAdminRoute = location.pathname.includes("admin");

  if (isAdminRoute === true) {
    const roles = user?.roles;
    if (!roles.includes("ADMIN")) {
      return (
        <Result
          status="403"
          title="403"
          subTitle="Sorry, you are not authorized to access this page."
          extra={
            <Link to="/">
              <Button type="primary">Back Home</Button>
            </Link>
          }
        />
      );
    }
  }

  return <>{props.children}</>;
};
export default ProtectedRoute;
