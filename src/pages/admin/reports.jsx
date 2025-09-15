import React, { useState,useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function Reports() {
  const [activeTab, setActiveTab] = useState("admin");

  const [adminReports, setAdminReports] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/get_admin_computer_reports")
      .then((res) => res.json())
      .then((data) => setAdminReports(data))
      .catch((err) => console.error("Error fetching reports:", err));
  }, []);

 

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

      {activeTab === "admin" && (
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>PC Number</th>
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
                          : r.status === "Notoperational"
                          ? "bg-warning text-dark" 
                          : r.status === "Damaged"
                          ? "bg-danger"       
                          : r.status === "Missing"
                          ? "bg-secondary"    
                          : "bg-light text-dark"
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
                    <td colSpan="7" className="text-center">
                      <span className="badge bg-secondary">There are no reports here</span>
                    </td>
                  </tr>
                ) : (
                  studentReports.map((r) => (
                    <tr key={r.id}>
                      <td>{r.submitted_by}</td>
                      <td>{r.item}</td>
                      <td>{r.lab}</td>
                      <td>
                        <span
                          className={`badge ${
                            r.status === "Operational"
                              ? "bg-success"
                              : r.status === "Warning"
                              ? "bg-warning text-dark"
                              : r.status === "Damaged"
                              ? "bg-danger"
                              : r.status === "Missing"
                              ? "bg-secondary"
                              : "bg-light text-dark"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td>{new Date(r.date).toLocaleString()}</td>
                      <td>{r.notes || "—"}</td>
                      <td>
                        {r.label ? (
                          <span
                            className={`badge ${
                              r.label === "Recorded" ? "bg-success" : "bg-danger"
                            }`}
                          >
                            {r.label}
                          </span>
                        ) : (
                          <div className="btn-group">
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => updateStudentReportLabel(r.id, "Recorded")}
                            >
                              Mark Recorded
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => updateStudentReportLabel(r.id, "Not Recorded")}
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
