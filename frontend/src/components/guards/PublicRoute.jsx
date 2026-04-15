import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import Spinner from "../ui/Spinner.jsx";

export default function PublicRoute() {
  const { user, loading } = useAuth();
  if (loading) return <Spinner fullscreen />;
  if (user) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
