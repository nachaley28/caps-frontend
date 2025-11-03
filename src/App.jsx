import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; 
import './App.css';
import LandingPage from "./pages/Landing";
import AdminLayout from "./pages/admin/AdminLayout";
import Profile from "./pages/admin/profile";
import Edit from "./pages/admin/edit";
import Dashboard from "./pages/admin/dashboard";
import Laboratory from "./pages/admin/labs";  
import Reports from "./pages/admin/reports";  

import TechnicianLayout from "./pages/technician/TechnicianLayout";
import TechnicianDashboard from "./pages/technician/TechnicianDashboard";
import TechnicianLabs from "./pages/technician/TechnicianLabs";
import TechnicianReports from "./pages/technician/TechnicianReports";
import TechnicianLogs from "./pages/technician/TechnicianLogs";
import TechnicianEdit from "./pages/technician/TechnicianEdit";

import LabGrid from "./pages/admin/components/LabGrid";
import AddLabModal from "./pages/admin/components/AddLabModal";
import LabDetail from './pages/admin/components/LabDetail';
import AddComputerModal from './pages/admin/components/AddComputerModal';

import DeanLayout from "./pages/dean/DeanLayout";
import DeanLabs from "./pages/dean/DeanLabs";
import DeanEdit from "./pages/dean/DeanEdit";
import User from "./pages/dean/User";







function RouteWithTransitions() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}  
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}  
        exit={{ opacity: 0 }}    
        transition={{ duration: 0.5 }}  
        className="page-container" 
      >
        <Routes location={location}>
          <Route path="/" element={<LandingPage />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />           
            <Route path="profile" element={<Profile />} />    
            <Route path="edit" element={<Edit />} />          
            <Route path="labs" element={<Laboratory />} />
            <Route path="reports" element={<Reports />} /> 
            <Route path="LabGrid" element={<LabGrid />} /> 
            <Route path="AddLabModal" element={<AddLabModal />} />
            <Route path="LabDetail" element={<LabDetail/>} />
            <Route path="AddComputerModal" element={<AddComputerModal/>} />
          </Route>

           <Route path="/technician" element={<TechnicianLayout />}>
            <Route index element={<TechnicianDashboard />} /> 
            <Route path="TechnicianLabs" element={<TechnicianLabs/>} />    
            <Route path="TechnicianReports" element={<TechnicianReports />} />
            <Route path="TechnicianLogs" element={<TechnicianLogs />} />
            <Route path="TechnicianEdit" element={<TechnicianEdit />} />
      
          </Route>

           <Route path="/dean" element={<DeanLayout />}>
            <Route index element={<TechnicianDashboard />} /> 
            <Route path="DeanLabs" element={<DeanLabs/>} />
            <Route path="DeanEdit" element={<DeanEdit/>} />
             <Route path="User" element={<User/>} />
            
           
      
          </Route>

          


        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <RouteWithTransitions />
      </div>
    </Router>
  );
}

export default App;
