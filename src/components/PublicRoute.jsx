import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContextHooks";

const PublicRoute = () => {
  const { user } = useAuth();

  if (user) {
    // Redirect to dashboard or home if already logged in
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
