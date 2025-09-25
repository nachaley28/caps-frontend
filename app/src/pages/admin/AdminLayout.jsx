import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  FaTimes,
  FaBars,
  FaHome,
  FaNetworkWired,
  FaUserCircle,
  FaClipboardList,
  FaUsers,
} from "react-icons/fa";

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showProfileSidebar, setShowProfileSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setSidebarOpen(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleProfileSidebar = () => setShowProfileSidebar(!showProfileSidebar);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleLogout = () => navigate("/");

  const sidebarLinks = [
    { icon: <FaHome />, label: "Dashboard", path: "/admin" },
    { icon: <FaNetworkWired />, label: "Labs & Computers", path: "/admin/labs" },
    { icon: <FaClipboardList />, label: "Reports", path: "/admin/reports" },
  ];

  return (
    <div
      style={{
        height: "100vh",
        fontFamily: "Inter, sans-serif",
        backgroundColor: "#f6f8fa",
        color: "#2c3e50",
        overflowX: "hidden",
      }}
      >
      
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "60px",
          backgroundColor: "#006633",          
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 1rem",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          zIndex: 1000,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {isMobile && (
            <FaBars
              size={22}
              style={{ cursor: "pointer", color: "#ffffff" }}
              onClick={toggleSidebar}
            />
          )}
        
          {!isMobile && (
            <h3 style={{ margin: 0, color: "#FFCC00", fontWeight: "600" }}>
             CLAIMS
            </h3>
          )}
        </div>

        <FaUserCircle
          size={34}
          color="#FFCC00"    
          style={{ cursor: "pointer" }}
          onClick={toggleProfileSidebar}
        />
      </header>

      
      <div
        style={{
          position: "fixed",
          top: "60px",
          right: showProfileSidebar ? 0 : "-260px",
          height: isMobile ? "calc(100% - 60px)" : "100%",
          width: isMobile ? "100%" : "260px",
          backgroundColor: "#ffffff",
          boxShadow: showProfileSidebar ? "-4px 0 12px rgba(0,0,0,0.1)" : "none",
          transition: "all 0.3s ease",
          padding: "1rem",
          color: "#333",
          zIndex: 1050,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "1rem",
          }}
        >
          <FaTimes
            size={22}
            style={{ cursor: "pointer", color: "#006633" }}
            onClick={toggleProfileSidebar}
          />
        </div>

        <h5
          style={{
            color: "#006633",
            marginBottom: "1rem",
            fontWeight: "600",
          }}
        >
          Natalie Jenh Alarcon
        </h5>

        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {["View Profile", "Edit Profile", "Help", "Data & Privacy"].map(
            (item, i) => (
              <li
                key={i}
                style={{
                  padding: "0.6rem 0.8rem",
                  borderRadius: "6px",
                  marginBottom: "0.3rem",
                  cursor: "pointer",
                  fontSize: "0.95rem",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f5f9f5")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
                onClick={() =>
                  navigate(
                    "/" +
                      item
                        .toLowerCase()
                        .replace(/ & /g, "-")
                        .replace(/ /g, "-")
                  )
                }
              >
                {item}
              </li>
            )
          )}
          <li
            style={{
              padding: "0.6rem 0.8rem",
              borderRadius: "6px",
              marginTop: "0.6rem",
              cursor: "pointer",
              color: "#e63946",
              fontWeight: "500",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#ffe5e5")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
            onClick={handleLogout}
          >
            Logout
          </li>
        </ul>
      </div>

     
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: sidebarOpen ? 0 : isMobile ? "-220px" : "0",
          height: "100%",
          width: "220px",
          backgroundColor: "#006633",  
          paddingTop: "60px",
          boxShadow: "2px 0 8px rgba(0,0,0,0.05)",
          transition: "all 0.3s ease",
          zIndex: 900,
        }}
      >
        <ul style={{ listStyle: "none", padding: "0.75rem", margin: 0 }}>
          {sidebarLinks.map((link, i) => {
            const isActive = location.pathname === link.path;
            return (
              <li key={i} style={{ marginBottom: "0.4rem" }}>
                <button
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.7rem 1rem",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: isActive ? "#FFCC00" : "transparent",
                    color: isActive ? "#006633" : "#ffffff",
                    fontWeight: isActive ? "700" : "500",
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.3s ease",
                  }}
                  onClick={() => {
                    navigate(link.path);
                    if (isMobile) setSidebarOpen(false);
                  }}
                  onMouseOver={(e) => {
                    if (!isActive)
                      e.currentTarget.style.backgroundColor = "rgba(255,204,0,0.15)";
                  }}
                  onMouseOut={(e) => {
                    if (!isActive)
                      e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {React.cloneElement(link.icon, { size: 18 })}
                  {!isMobile && link.label}
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      
      <main
        style={{
          marginLeft: isMobile ? "0" : "220px",
          marginTop: "60px",
          padding: "25px",
          minHeight: "100vh",
          backgroundColor: "#f6f8fa",
          transition: "all 0.3s ease",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
