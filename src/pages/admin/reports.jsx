import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function Reports() {
  const [activeTab, setActiveTab] = useState("admin");

  // Dummy Admin Reports (auto-generated from system updates)
  const [adminReports] = useState([
    {
      id: 1,
      item: "PC-01",
      lab: "Lab A",
      status: "Damaged",
      date: "2025-09-10T10:30:00",
      notes: "Monitor replaced",
    },
    {
      id: 2,
      item: "PC-05",
      lab: "Lab B",
      status: "Operational",
      date: "2025-09-11T14:45:00",
      notes: "System reboot successful",
    },
  ]);

  // Dummy Student Reports (pending admin review)
  const [studentReports, setStudentReports] = useState([
    {
      id: 101,
      submitted_by: "John Doe",
      item: "Keyboard X",
      lab: "Lab C",
      status: "Not Working",
      date: "2025-09-12T09:15:00",
      notes: "Keys unresponsive",
      label: null,
    },
    {
      id: 102,
      submitted_by: "Jane Smith",
      item: "Mouse Y",
      lab: "Lab A",
      status: "Missing",
      date: "2025-09-13T08:45:00",
      notes: "",
      label: null,
    },
  ]);

  const updateStudentReportLabel = (id, label) => {
    setStudentReports((prev) =>
      prev.map((report) =>
        report.id === id ? { ...report, label } : report
      )
    );
  };

  return (
    <div className="container mt-5">
      <h2 className="fw-bold text-primary mb-4">Reports Dashboard</h2>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "admin" ? "active" : ""}`}
            onClick={() => setActiveTab("admin")}
          >
            Admin Reports
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "student" ? "active" : ""}`}
            onClick={() => setActiveTab("student")}
          >
            Student Reports
          </button>
        </li>
      </ul>

      {/* Admin Reports Tab */}
      {activeTab === "admin" && (
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Item</th>
                <th>Lab</th>
                <th>Status</th>
                <th>Date</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {adminReports.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No admin reports found.
                  </td>
                </tr>
              ) : (
                adminReports.map((r) => (
                  <tr key={r.id}>
                    <td>{r.item}</td>
                    <td>{r.lab}</td>
                    <td>
                      <span
                        className={`badge ${
                          r.status === "Operational"
                            ? "bg-success"
                            : r.status === "Damaged"
                            ? "bg-danger"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td>{new Date(r.date).toLocaleString()}</td>
                    <td>{r.notes || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Student Reports Tab */}
      {activeTab === "student" && (
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Submitted By</th>
                <th>Item</th>
                <th>Lab</th>
                <th>Status</th>
                <th>Date</th>
                <th>Notes</th>
                <th>Admin Label</th>
              </tr>
            </thead>
            <tbody>
              {studentReports.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted">
                    No student reports found.
                  </td>
                </tr>
              ) : (
                studentReports.map((r) => (
                  <tr key={r.id}>
                    <td>{r.submitted_by}</td>
                    <td>{r.item}</td>
                    <td>{r.lab}</td>
                    <td>
                      <span className="badge bg-warning text-dark">
                        {r.status}
                      </span>
                    </td>
                    <td>{new Date(r.date).toLocaleString()}</td>
                    <td>{r.notes || "—"}</td>
                    <td>
                      {r.label ? (
                        <span
                          className={`badge ${
                            r.label === "Recorded"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {r.label}
                        </span>
                      ) : (
                        <div className="btn-group">
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() =>
                              updateStudentReportLabel(r.id, "Recorded")
                            }
                          >
                            Mark Recorded
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() =>
                              updateStudentReportLabel(r.id, "Not Recorded")
                            }
                          >
                            Not Recorded
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
