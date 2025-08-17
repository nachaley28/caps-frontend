import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  FaTimes, FaHome, FaWarehouse, FaUserCircle
} from "react-icons/fa";

function AssistantLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const handleLogout = () => navigate('/');

  
  return (
    <div className="d-flex flex-column"
      style={{ height: '100vh', fontFamily: 'Inter, sans-serif', color: '#333', backgroundColor: '#FDF6F0' }}>

      <header className="fixed-top d-flex justify-content-between align-items-center px-4"
  style={{
    height: "60px",
    backgroundColor: "#FFFFFF",
    color: "#333",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    zIndex: 1000,
  }}
>
  <img
    src="/public/img/Inventory.png" 
    alt="Admin Logo"
    style={{ height: "80px", width: "auto" }}
  />
        <FaUserCircle size={36} color="#1E4D75" style={{ cursor: 'pointer' }} onClick={toggleSidebar} />
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
          <FaTimes size={24} style={{ cursor: 'pointer', color: '#1E4D75' }} onClick={toggleSidebar} />
        </div>
        <h5 className="mb-3" style={{ color: '#1E4D75' }}>Natalie Jenh Alarcon</h5>
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

     
   
      <main className="flex-grow-1" style={{
  marginTop: '60px',  
  padding: '25px',
  backgroundColor: '#FDF6F0',
  minHeight: 'auto', 
  height:"auto",
  transition: 'all 0.3s ease',
  color: '#333'
}}>
  <Outlet />
</main>

     
    </div>
  );
}

export default AssistantLayout;
