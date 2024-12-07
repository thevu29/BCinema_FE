import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/Auth/authContext";

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  const decodedToken = jwtDecode(token);
  const userRole = decodedToken.role.toLowerCase();

  if (userRole !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
