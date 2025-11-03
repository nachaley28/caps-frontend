import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaDesktop } from "react-icons/fa";

export default function TechnicianAndQuickUpdate() {
  const [adminReports, setAdminReports] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [solution, setSolution] = useState("");
  const [replacementSerial, setReplacementSerial] = useState("");
  const [status, setStatus] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [showQuickUpdate, setShowQuickUpdate] = useState(false);
  const [labComputers, setLabComputers] = useState([]);
  const [selectedPart, setSelectedPart] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPCs, setSelectedPCs] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/check_session")
      .then((res) => res.json())
      .then((data) => {
        if (!data.logged_in) navigate("/");
        else setUserEmail(data.user.email);
      })
      .catch((err) => console.error(err));
  }, [navigate]);

 
  const loadReports = () => {
    fetch("http://localhost:5000/get_admin_computer_reports")
      .then((res) => res.json())
      .then((data) => setAdminReports(data))
      .catch((err) => console.error(err));
  };

  const loadLabComputers = () => {
    fetch("http://localhost:5000/get_lab_computers")
      .then((res) => res.json())
      .then((data) => setLabComputers(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadReports();
    loadLabComputers();
  }, []);

 
  const filteredReports = adminReports
    .filter(
      (r) =>
        (r.item || "").toLowerCase().includes(filterText.toLowerCase()) ||
        (r.lab || "").toLowerCase().includes(filterText.toLowerCase()) ||
        (r.status || "").toLowerCase().includes(filterText.toLowerCase()) ||
        (r.notes || "").toLowerCase().includes(filterText.toLowerCase())
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleRowClick = (row) => {
    setSelectedReport(row);
    setStatus(row.status);
    setSolution("");
    setReplacementSerial("");
    setShowDetailModal(true);
  };


  const handleTechnicianSubmit = async () => {
    if (!solution) {
      alert("Please select a solution.");
      return;
    }
    if (solution === "Replaced" && !replacementSerial) {
      alert("Please enter replacement serial number.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/submit_technician_report",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            report_id: selectedReport.id,
            issue_found: {
              lab: selectedReport.lab,
              PC_Number: selectedReport.item,
              status: selectedReport.status,
              notes: selectedReport.notes,
            },
            solution,
            replacement_serial: replacementSerial,
            status,
            technician_email: userEmail,
            com_id: selectedReport,
          }),
        }
      );
      const result = await response.json();
      if (response.ok) {
        alert("✅ Technician report submitted!");
       
        setAdminReports((prev) =>
          prev.filter((r) => r.id !== selectedReport.id)
        );
        setShowDetailModal(false);
      } else {
        alert("❌ Failed: " + result.message);
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Error submitting report.");
    }
  };

  const statusColors = {
    operational: "#28a745",
    Notoperational: "#ffc107",
    Damaged: "#dc3545",
    Missing: "#6c757d",
  };

  const partIcons = {
    CPU: FaDesktop,
    Mouse: FaDesktop,
    Keyboard: FaDesktop,
    Monitor: FaDesktop,
    
  };


  const handleQuickUpdate = async () => {
    if (!selectedPart || !selectedStatus || selectedPCs.length === 0) {
      alert("Select part, status, and PCs.");
      return;
    }

    const updated = {};
    selectedPCs.forEach((pcId) => {
      updated[pcId] = { [selectedPart]: selectedStatus };
    });

    try {
      const res = await fetch(
        "http://localhost:5000/update_computer_status_bulk",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ statuses: updated }),
        }
      );
      const data = await res.json();
      console.log("Quick update saved:", data);
      setShowQuickUpdate(false);
      setSelectedPart("");
      setSelectedStatus("");
      setSelectedPCs([]);
      loadLabComputers();
    } catch (err) {
      console.error("Quick update error:", err);
    }
  };


  const columns = [
    { name: "PC Number", selector: (row) => row.item, sortable: true },
    { name: "Lab", selector: (row) => row.lab, sortable: true },
    {
      name: "Status",
      selector: (row) => (
        <span
          style={{
            backgroundColor: statusColors[row.status] || "#ccc",
            color: "white",
            padding: "5px 10px",
            borderRadius: "12px",
            fontWeight: "500",
            textTransform: "capitalize",
          }}
        >
          {row.status}
        </span>
      ),
      sortable: true,
    },
    { name: "Date", selector: (row) => new Date(row.date).toLocaleString(), sortable: true },
    { name: "Notes", selector: (row) => row.notes || "—" },
  ];

  const customStyles = {
    headRow: { style: { backgroundColor: "#006633", color: "#fff" } },
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4" style={{ color: "#006633" }}>
        Computer Labs Reports
      </h1>

      <DataTable
        columns={columns}
        data={filteredReports}
        pagination
        highlightOnHover
        responsive
        customStyles={customStyles}
        onRowClicked={handleRowClick}
        pointerOnHover
      />
        {showDetailModal && selectedReport && (
          <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "500px" }}>
              <div className="modal-content p-4 rounded-4 shadow">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 style={{ color: "#006633" }}>Technician Report</h5>
                  <button onClick={() => setShowDetailModal(false)} className="btn btn-sm btn-light">
                    <FaTimes />
                  </button>
                </div>

                <hr />

                <p><strong>PC Number:</strong> {selectedReport.item}</p>
                <p><strong>Lab:</strong> {selectedReport.lab}</p>
                <p>
                  <strong>Previous Status:</strong>{" "}
                  <span style={{
                    backgroundColor: statusColors[selectedReport.status] || "#ccc",
                    color: "white",
                    padding: "4px 12px",
                    borderRadius: "50px",
                    fontWeight: "500",
                  }}>
                    {selectedReport.status}
                  </span>
                </p>
                <p><strong>Notes:</strong> {selectedReport.notes || "—"}</p>

              
                <label className="fw-bold">Solution Done:</label>
                <select
                  className="form-select mb-3"
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                >
                  <option value="">Select action...</option>
                  <option value="Repaired">Repaired</option>
                  <option value="Replaced">Replaced</option>
                  <option value="None">None</option>
                  <option value="Other">Other</option>
                </select>

              
                {solution === "Replaced" && (
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Replacement serial number..."
                    value={replacementSerial}
                    onChange={(e) => setReplacementSerial(e.target.value)}
                  />
                )}

                {solution === "Other" && (
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Describe the solution..."
                    value={replacementSerial} // reuse state or create new state e.g., customSolution
                    onChange={(e) => setReplacementSerial(e.target.value)}
                  />
                )}

                {/* Status Update */}
                <label className="fw-bold">Update Status:</label>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {["operational", "Notoperational", "Damaged", "Missing"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`btn ${status === s ? "text-white" : "text-dark"}`}
                      style={{
                        backgroundColor: status === s ? statusColors[s] : "#f1f1f1",
                        borderRadius: "50px",
                        padding: "6px 20px",
                        fontWeight: "500",
                        flex: "1 1 45%",
                        minWidth: "100px",
                        transition: "0.2s",
                      }}
                      onClick={() => setStatus(s)}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="text-end">
                  <button
                    className="btn btn-success"
                    style={{ backgroundColor: "#006633" }}
                    onClick={handleTechnicianSubmit}
                  >
                    Submit Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}



     
    </div>
  );
}
