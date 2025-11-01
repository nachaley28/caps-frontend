import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { FaPaperPlane } from "react-icons/fa";
import "./components/labs.css"; // Include CSS for toast

export default function Reports() {
  const [adminReports, setAdminReports] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedReports, setSelectedReports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [title, setTitle] = useState("");
  const [userPosition, setUserPosition] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [emailStatus, setEmailStatus] = useState("idle"); // idle, sending, success, error
  const [showSentMessage, setShowSentMessage] = useState(false); // Toast for sent report

  const navigate = useNavigate();
  

  // --- Check session ---
  useEffect(() => {
    fetch("http://localhost:5000/check_session")
      .then((res) => res.json())
      .then((data) => {
        if (!data.logged_in) {
          navigate("/");
        } else {
          setUserPosition(data.user.role);
          setUserEmail(data.user.email);
          setUserName(data.user.name || "Unknown");
        }
      })
      .catch((err) => console.error(err));
  }, [navigate]);

  // --- Fetch reports ---
  const fetchReports = () => {
    fetch("http://localhost:5000/get_admin_computer_reports")
      .then((res) => res.json())
      .then((data) => {
        const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        console.log("Fetched Reports:", sortedData);
        setAdminReports(sortedData);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchReports();

  }, []);

  // --- Filtered reports ---
  const filteredReports = adminReports.filter(
    (r) =>
      (r.item || "").toLowerCase().includes(filterText.toLowerCase()) ||
      (r.lab || "").toLowerCase().includes(filterText.toLowerCase()) ||
      (r.status || "").toLowerCase().includes(filterText.toLowerCase()) ||
      (r.notes || "").toLowerCase().includes(filterText.toLowerCase())
  );

  // --- Handle selecting reports ---
  const handleSelectReport = (report) => {
    setSelectedReports((prevSelected) =>
      prevSelected.includes(report)
        ? prevSelected.filter((r) => r !== report)
        : [...prevSelected, report]
    );
  };

  // --- Handle Send Button ---
  const handleSendButton = () => {
    if (!showCheckboxes) {
      alert("Please click 'Select Reports' first to choose reports.");
      return;
    }
    if (selectedReports.length === 0) {
      alert("Please select at least one report.");
      return;
    }
    setShowModal(true);
  };

  // --- Generate summary ---
  const summaryText = selectedReports.map((r) => ({
    pc: r.item,
    lab: r.lab,
    status: r.status,
    notes: r.notes || "—",
    com_id: r.id
  }));

  // --- Handle submit modal (Send Email) ---
  const handleSubmit = async () => {
    if (!title) {
      alert("Please fill in the title");
      return;
    }

    setEmailStatus("sending");

    try {
      const response = await fetch("http://localhost:5000/send_report_email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          summary: summaryText,
          position: userPosition,
          userEmail,
          userName,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setEmailStatus("success");

        // Mark reports as sent
        await fetch("http://localhost:5000/mark_reports_sent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reportIds: selectedReports.map((r) => r.id),
          }),
        });

        fetchReports(); // Refresh table
      } else {
        setEmailStatus("error");
        console.error(result.message);
      }
    } catch (error) {
      console.error(error);
      setEmailStatus("error");
    }

    setShowModal(false);
    setShowStatusModal(true);
    setSelectedReports([]);
    setTitle("");
    setShowCheckboxes(false);
  };

  // --- Table columns ---
  const columns = [
    ...(showCheckboxes
      ? [
          {
            name: "",
            cell: (row) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (row.sent) {
                    setShowSentMessage(true);
                    setTimeout(() => setShowSentMessage(false), 2500);
                    return;
                  }
                  handleSelectReport(row);
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedReports.includes(row)}
                  readOnly
                />
              </div>
            ),
            width: "70px",
          },
        ]
      : []),
    { name: "PC Number", selector: (row) => row.item, sortable: true },
    { name: "Lab", selector: (row) => row.lab, sortable: true },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <span
          style={{
            backgroundColor:
              row.status === "Operational"
                ? "#006633"
                : row.status === "Notoperational" || row.status === "Warning"
                ? "#FFCC00"
                : row.status === "Damaged"
                ? "#dc3545"
                : row.status === "Missing"
                ? "#6c757d"
                : "#f8f9fa",
            color:
              row.status === "Notoperational" || row.status === "Warning"
                ? "#000"
                : "#fff",
            padding: "3px 7px",
            borderRadius: "5px",
          }}
        >
          {row.status}
        </span>
      ),
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
        Admin Reports Dashboard
      </h1>

      <div className="d-flex justify-content-between mb-3">
        <button
          className={`btn ${showCheckboxes ? "btn-secondary" : "btn-success"}`}
          onClick={() => {
            setShowCheckboxes(!showCheckboxes);
            setSelectedReports([]);
          }}
        >
          {showCheckboxes ? "Cancel Selection" : "Select Reports"}
        </button>

        <input
          type="text"
          className="form-control"
          placeholder="Search reports..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{ maxWidth: "300px" }}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredReports}
        pagination
        highlightOnHover
        responsive
        customStyles={customStyles}
      />

      {/* Floating Send Button */}
      <button
        className="btn btn-success rounded-circle p-3"
        onClick={handleSendButton}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          width: "60px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
        }}
      >
        <FaPaperPlane size={20} />
      </button>

      {/* Toast for already sent report */}
      {showSentMessage && <div className="toast-message">You already sent this report</div>}

      {/* Input Modal */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content p-4">
              <h4 className="mb-3 text-center" style={{ color: "#006633" }}>
                Send Report
              </h4>

              <p><strong>User Position:</strong> {userPosition || "Unknown"}</p>
              <p><strong>Name of Sender:</strong> {userName || "Unknown"}</p>

              <div className="d-flex flex-column gap-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={emailStatus === "sending"}
                />

                <div className="table-responsive border rounded mt-3" style={{ maxHeight: "250px", overflowY: "auto" }}>
                  <table className="table table-striped table-bordered">
                    <thead className="table-success">
                      <tr>
                        <th>#</th>
                        <th>PC</th>
                        <th>Lab</th>
                        <th>Status</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedReports.map((r, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{r.item}</td>
                          <td>{r.lab}</td>
                          <td>{r.status}</td>
                          <td>{r.notes || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="text-end mt-4">
                <button className="btn btn-secondary me-2" onClick={() => setShowModal(false)} disabled={emailStatus === "sending"}>
                  Cancel
                </button>
                <button className="btn btn-success" onClick={handleSubmit} disabled={emailStatus === "sending"}>
                  {emailStatus === "sending" ? "Sending..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Modal */}
      {showStatusModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4 text-center">
              {emailStatus === "success" ? (
                <div className="alert alert-success">✅ Email sent successfully!</div>
              ) : (
                <div className="alert alert-danger">❌ Email failed to send. Try again.</div>
              )}
              <button
                className="btn btn-primary mt-3"
                onClick={() => {
                  setShowStatusModal(false);
                  setEmailStatus("idle");
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
