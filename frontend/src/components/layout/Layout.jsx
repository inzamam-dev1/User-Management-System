import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";
import { useState, useEffect } from "react";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // Auto-close sidebar on mobile
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      {/* Sidebar with overlay on mobile */}
      {sidebarOpen && isMobile && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 40,
            top: 60,
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <Sidebar open={sidebarOpen} isMobile={isMobile} />

      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        marginLeft: !isMobile && sidebarOpen ? 240 : 0,
        transition: "margin-left 0.25s",
      }}>
        <Navbar onMenuClick={() => setSidebarOpen((v) => !v)} />
        <main style={{
          flex: 1,
          padding: "28px 32px",
          maxWidth: 1200,
          width: "100%",
          margin: "0 auto",
          "@media (max-width: 768px)": {
            padding: "16px 16px",
          },
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
