
import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { FaPaperPlane } from "react-icons/fa";


export default function TechnicianReports() {
  const [adminReports, setAdminReports] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedReports, setSelectedReports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [title, setTitle] = useState("");
  const [userPosition, setUserPosition] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [selectedReport, setSelectedReport] = useState(null); // ✅ selected report for detail modal
  const [showDetailModal, setShowDetailModal] = useState(false); // ✅ modal visibility
  const [issueFound, setIssueFound] = useState("");
  const [stepsTaken, setStepsTaken] = useState("");
  const [partsReplaced, setPartsReplaced] = useState("");
  const [solution, setSolution] = useState("");
  const [status, setStatus] = useState(""); // ✅ status update

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/check_session")
      .then((res) => res.json())
      .then((data) => {
        if (!data.logged_in) {
          navigate("/");
        } else {
          setUserPosition(data.user.role);
          setUserEmail(data.user.email);
        }
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

  // ✅ when a row is clicked, open detail modal
  const handleRowClick = (row) => {
    setSelectedReport(row);
    setStatus(row.status);
    setShowDetailModal(true);
  };

  // ✅ technician submits maintenance report
  const handleTechnicianSubmit = async () => {
    if (!solution) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/submit_technician_report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          report_id: selectedReport.id,
          issue_found: {
            lab: selectedReport.lab ,PC_Number: selectedReport.item, status : selectedReport.status, notes: selectedReport.notes
          },
          solution: solution,
          status: status,
          technician_email: userEmail,
        }),
      });
      console.log(selectedReport);
      const result = await response.json();
      window.location.reload();
      if (response.ok) {
        alert("✅ Technician report submitted successfully!");
        setShowDetailModal(false);
        setIssueFound("");
        setStepsTaken("");
        setPartsReplaced("");
        setSolution("");
        setStatus("");
      } else {
        alert("❌ Failed: " + result.message);
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Error submitting report.");
    }
  };

  const columns = [
    {
      name: "PC Number",
      selector: (row) => row.item,
      sortable: true,
    },
    {
      name: "Lab",
      selector: (row) => row.lab,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => new Date(row.date).toLocaleString(),
      sortable: true,
    },
    {
      name: "Notes",
      selector: (row) => row.notes || "—",
    },
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
        style={{ maxWidth: "300px" }}
      />

      <DataTable
        columns={columns}
        data={filteredReports}
        pagination
        highlightOnHover
        responsive
        customStyles={customStyles}
        onRowClicked={handleRowClick} // ✅ make rows clickable
        pointerOnHover
      />

      {/* ✅ Detail Modal */}
      {showDetailModal && selectedReport && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content p-4">
              <h4 className="text-center mb-3" style={{ color: "#006633" }}>
                Technician Report
              </h4>

           

              <hr />

              <h5 style={{ color: "#006633" }}>🧾 Maintenance Details</h5>
              <p>Issue Found :<br></br>PC{selectedReport.item}<br></br>{selectedReport.status}<br></br> {selectedReport.notes}  </p>
               
             
              <textarea
                className="form-control mb-2"
                placeholder="Solution applied"
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
              />

              <label>Status Update:</label>
              <select
                className="form-select mb-3"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                
              >
                <option>operational</option>
                <option>Notoperational</option>
                <option>Damaged</option>
                <option>Missing</option>
              </select>

              <div className="text-end">
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => setShowDetailModal(false)}
                >
                  Close
                </button>
                <button className="btn btn-success" onClick={handleTechnicianSubmit}>
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