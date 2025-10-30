import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LabGrid from "./components/LabGrid";
import AddLabModal from "./components/AddLabModal";
import LabDetail from "./components/LabDetail";
import "./components/labs.css";

export default function App() {
  const [selectedLab, setSelectedLab] = useState(null);
  const [labs, setLabs] = useState([]);
  const [computers, setComputers] = useState([]);
  const [showAddLab, setShowAddLab] = useState(false);
  const navigate = useNavigate();

  // Check session
  useEffect(() => {
    fetch("http://localhost:5000/check_session")
      .then(res => res.json())
      .then(data => !data.logged_in && navigate("/"));
  }, [navigate]);

  // Fetch labs and computers
  useEffect(() => {
    fetch("http://localhost:5000/get_laboratory").then(res => res.json()).then(setLabs);
    fetch("http://localhost:5000/get_computers").then(res => res.json()).then(setComputers);
  }, []);

  const addLab = (lab) => setLabs(prev => [...prev, lab]);
  const addComputer = (comp) => setComputers(prev => [...prev, comp]);

  return (
   <div
  style={{
    padding: 40,
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    alignItems: "center", // centers content horizontally
  }}
>
  {/* Centered heading */}
  <h2 style={{ color: "#006633", fontWeight: 700, marginBottom: 10 }}>
    Laboratories & Computers
  </h2>

  {!selectedLab && (
    <button
      onClick={() => setShowAddLab(true)}
      style={{
        backgroundColor: "#006633",
        color: "#fff",
        border: "none",
        padding: "10px 18px",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: 600,
        cursor: "pointer",
        boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#004d26";
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#006633";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 3px 8px rgba(0,0,0,0.15)";
      }}
    >
      + Add Lab
    </button>
  )}

  {!selectedLab ? (
    <LabGrid labs={labs} selectLab={setSelectedLab} />
  ) : (
    <LabDetail
      lab={selectedLab}
      computers={computers}
      back={() => setSelectedLab(null)}
      addComputer={addComputer}
    />
  )}

  {showAddLab && <AddLabModal addLab={addLab} onClose={() => setShowAddLab(false)} />}
</div>

  );
}
