
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const role = sessionStorage.getItem("role");

  if (!role) return <Navigate to="/info" />;
  if (!allowedRoles.includes(role)) return <Navigate to="/info" />;

  return children;
};

export default ProtectedRoute;
