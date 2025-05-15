import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Adjust path if needed

const AuthRedirect = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />;
};

export default AuthRedirect;
