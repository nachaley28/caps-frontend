import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; 
import './App.css';
import LandingPage from "./pages/Landing";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/dashboard";
import Laboratory from "./pages/admin/labs";  
import Reports from "./pages/admin/reports";  




function RouteWithTransitions() {
  const location = useLocation();

  return (
    <AnimatePresence>
      <motion.div
        key={location.pathname}  
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}  
        exit={{ opacity: 0 }}    
        transition={{ duration: 1 }}  
        className="page-container" 
      >
        <Routes location={location}>
          <Route path="/" element={<LandingPage />} />

    


          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard/>} />
            <Route path="/admin/labs" element={<Laboratory />} />
            <Route path="/admin/reports" element={<Reports />} />



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
