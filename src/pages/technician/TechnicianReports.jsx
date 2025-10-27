import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

export default function TechnicianReports() {
  const [adminReports, setAdminReports] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [solution, setSolution] = useState("");
  const [status, setStatus] = useState("");
  const [userEmail, setUserEmail] = useState("");
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

  useEffect(() => {
    fetch("http://localhost:5000/get_admin_computer_reports")
      .then((res) => res.json())
      .then((data) => setAdminReports(data))
      .catch((err) => console.error(err));
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
    setShowDetailModal(true);
  };

  const handleTechnicianSubmit = async () => {
    if (!solution) {
      alert("Please fill in the solution field.");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/submit_technician_report", {
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
          solution: solution,
          status: status,
          technician_email: userEmail,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        alert("✅ Technician report submitted successfully!");
        window.location.reload();
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
    {
      name: "Date",
      selector: (row) => new Date(row.date).toLocaleString(),
      sortable: true,
    },
    { name: "Notes", selector: (row) => row.notes || "—" },
  ];

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#006633",
        color: "#fff",
      },
    },
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4" style={{ color: "#006633" }}>
        Technician Reports
      </h1>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search reports..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        style={{ maxWidth: "300px", margin: "0 auto", display: "block" }}
      />

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

      {/* ✅ Detail Modal */}
      {showDetailModal && selectedReport && (
        <div
          className="modal d-block"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ maxWidth: "500px" }}
          >
            <div className="modal-content p-4 rounded-4 shadow">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="m-0" style={{ color: "#006633" }}>
                  Technician Report
                </h5>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="btn btn-sm btn-light"
                  style={{
                    fontWeight: "bold",
                    border: "none",
                    color: "#006633",
                  }}
                >
                  ✕
                </button>
              </div>

              <hr />

              <div>
                <p className="mb-2">
                  <strong>PC Number:</strong> {selectedReport.item}
                </p>
                <p className="mb-2">
                  <strong>Lab:</strong> {selectedReport.lab}
                </p>
                <p className="mb-2">
                  <strong>Previous Status:</strong>{" "}
                  <span
                    style={{
                      backgroundColor: statusColors[selectedReport.status] || "#ccc",
                      color: "white",
                      padding: "4px 10px",
                      borderRadius: "12px",
                    }}
                  >
                    {selectedReport.status}
                  </span>
                </p>
                <p>
                  <strong>Notes:</strong> {selectedReport.notes || "—"}
                </p>
              </div>

              <textarea
                className="form-control mb-3"
                placeholder="Enter solution applied..."
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
              />

              <label className="fw-bold">Status Update:</label>
              <div className="d-flex flex-wrap gap-2 mb-3">
                {["operational", "Notoperational", "Damaged", "Missing"].map(
                  (s) => (
                    <button
                      key={s}
                      type="button"
                      className={`btn ${
                        status === s ? "text-white" : "btn-light"
                      }`}
                      style={{
                        backgroundColor:
                          status === s ? statusColors[s] : "#f1f1f1",
                        fontSize: "14px",
                        flex: "1 1 calc(50% - 5px)",
                        textTransform: "capitalize",
                      }}
                      onClick={() => setStatus(s)}
                    >
                      {s}
                    </button>
                  )
                )}
              </div>

              <div className="text-end">
                <button
                  className="btn btn-success"
                  style={{ backgroundColor: "#006633", border: "none" }}
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
