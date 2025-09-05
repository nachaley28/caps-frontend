import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  FaTimes, FaHome, FaLaptop, FaUserCircle,FaClipboardList, FaUsers  } from "react-icons/fa";

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const handleLogout = () => navigate('/');

   const sidebarLinks = [
    { icon: <FaHome />, label: 'Dashboard', path: '/admin', color: '#0d6efd' },
    { icon: <FaLaptop />, label: 'Labs & Computers', path: '/admin/labs', color: '#0d6efd' },
    { icon: <FaClipboardList />, label: 'Reports', path: '/admin/reports', color: '#0d6efd' },
    { icon: <FaLaptop />, label: 'Inventory', path: '/admin/inventory', color: '#0d6efd' },
    { icon: <FaUsers />, label: 'Users & Roles', path: '/admin/users', color: '#0d6efd' },
  ];

  return (
    <div className="d-flex flex-column"
      style={{ height: '100vh', fontFamily: 'Inter, sans-serif', color: '#333', backgroundColor: '#FDF6F0' }}>

      <header
  className="fixed-top d-flex justify-content-between align-items-center px-4"
  style={{
    height: "60px",
    backgroundColor: "#FFFFFF",
    color: "#333",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    zIndex: 1000,
  }}
>
  <img
    src="/public/img/Inventory.png" // replace with your logo path
    alt="Admin Logo"
    style={{ height: "80px", width: "auto" }}
  />

        <FaUserCircle size={36} color="#FFA500" style={{ cursor: 'pointer' }} onClick={toggleSidebar} />
      </header>

      <div className="position-fixed top-0 end-0 h-100 shadow"
        style={{
          backgroundColor: '#FFF5E6',
          top: '60px',
          width: '260px',
          transition: 'transform 0.3s ease, opacity 0.3s ease',
          zIndex: 1050,
          borderLeft: '1px solid #FFA500',
          display: showSidebar ? 'block' : 'none',
          opacity: showSidebar ? 1 : 0,
          padding: '1rem',
          color: '#333'
        }}>
        <div className="d-flex justify-content-end mb-3">
          <FaTimes size={24} style={{ cursor: 'pointer', color: '#FFA500' }} onClick={toggleSidebar} />
        </div>
        <h5 className="mb-3" style={{ color: '#FFA500' }}>Natalie Jenh Alarcon</h5>
        <ul className="list-group list-group-flush">
          {["View Profile", "Edit Profile", "Help", "Data & Privacy"].map((item, i) => (
            <li key={i}
              className="list-group-item rounded mb-1 sidebar-item"
              onClick={() => navigate('/' + item.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'))}
            >
              {item}
            </li>
          ))}
          <li className="list-group-item rounded sidebar-item logout"
            onClick={handleLogout}>
            Logout
          </li>
        </ul>
      </div>

      {/* Left Sidebar Navigation */}
      <aside className="position-fixed top-0 start-0 h-100 shadow"
        style={{
          width: '220px',
          backgroundColor: '#FFFFFF',
          paddingTop: '60px',
          color: '#333',
          marginTop: '10px',
          transition: 'all 0.3s ease',
          borderRight: '1px solid #E5E5E5'
        }}>
        <ul className="nav flex-column px-2">
          {sidebarLinks.map((link, i) => {
            const isActive = location.pathname === link.path;
            return (
              <li key={i} className="nav-item mb-2"> {/* added margin-top here (mb-3) */}
                <button
                  className={`nav-link btn w-100 d-flex align-items-center justify-content-start sidebar-link ${isActive ? 'active' : ''}`}
                  onClick={() => navigate(link.path)}
                >
                  {React.cloneElement(link.icon, { className: "me-2" })}
                  {link.label}
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <main className="flex-grow-1" style={{
        marginLeft: '220px',
        marginTop: '60px',
        padding: '25px',
        backgroundColor: '#FDF6F0',
        minHeight: '100vh',
        transition: 'all 0.3s ease',
        color: '#333'
      }}>
        <Outlet />
      </main>

      <style>{`
        .sidebar-link {
          background-color: transparent;
          color: #333;
          font-weight: 500;
          font-size: 0.95rem;
          border-radius: 8px;
          padding: 0.5rem 1rem;
          transition: background-color 0.2s, color 0.2s;
        }
        .sidebar-link:hover {
          background-color: #FFE5B4;
        }
        .sidebar-link.active {
          background-color: #FFE5B4;
          color: #FFA500 !important;
        }
        .sidebar-item {
          cursor: pointer;
          background: transparent;
          transition: background-color 0.2s;
        }
        .sidebar-item:hover {
          background-color: #FFE5B4;
        }
        .sidebar-item.logout {
          color: #FF6B6B;
        }
        .sidebar-item.logout:hover {
          background-color: #FFD6D6;
        }
      `}</style>
    </div>
  );
}

export default AdminLayout;
