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
  <div style={{ padding: 40, background: "#f1f3f6", minHeight: "100vh" }}>
      {!selectedLab && (
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <h2 style={{ marginBottom: 20, color: "#006633" }}>
            Laboratories and Computers
          </h2>
          <button
            onClick={() => setShowAddLab(true)}
            className="btn"
            style={{ backgroundColor: "#006633", color: "white" }}
          >
            + Add Laboratory
          </button>
        </div>
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
      {showAddLab && (
        <AddLabModal addLab={addLab} onClose={() => setShowAddLab(false)} />
      )}
    </div>
  );

  
}
