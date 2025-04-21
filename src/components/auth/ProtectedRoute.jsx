import { useAppContext } from "@context/AppContext";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = (props) => {
  const { isAuthenticated, user } = useAppContext();
  const location = useLocation();

  if (isAuthenticated === false) {
    return <Navigate to="/login" replace />;
  }

  const isAdminRoute = location.pathname.includes("admin");

  if ((isAdminRoute === true, isAuthenticated === false)) {
    const role = user?.role;
    if (!role.includes("ADMIN")) {
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={<Button type="primary">Back Home</Button>}
      />;
    }
  }

  return <>{props.children}</>;
};
export default ProtectedRoute;
