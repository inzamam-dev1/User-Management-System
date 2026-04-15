import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/guards/ProtectedRoute.jsx";
import PublicRoute from "./components/guards/PublicRoute.jsx";
import Layout from "./components/layout/Layout.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import UserList from "./pages/UserList.jsx";
import UserDetail from "./pages/UserDetail.jsx";
import MyProfile from "./pages/MyProfile.jsx";
import NotFound from "./pages/NotFound.jsx";
import { ROLES } from "./utils/roleUtils.js";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Protected */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<MyProfile />} />

          {/* Admin + Manager */}
          <Route element={<ProtectedRoute roles={[ROLES.ADMIN, ROLES.MANAGER]} />}>
            <Route path="/users" element={<UserList />} />
            <Route path="/users/:id" element={<UserDetail />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
