import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function Reports() {
  const [activeTab, setActiveTab] = useState("admin");
  const [adminReports, setAdminReports] = useState([]);
  const [studentReports, setStudentReports] = useState([]);

  const [adminPage, setAdminPage] = useState(1);
  const [studentPage, setStudentPage] = useState(1);
  const pageSize = 10; 

  useEffect(() => {
    fetch("http://localhost:5000/get_admin_computer_reports")
      .then((res) => res.json())
      .then((data) => setAdminReports(data))
      .catch((err) => console.error("Error fetching admin reports:", err));

    fetch("http://localhost:5000/get_student_reports")
      .then((res) => res.json())
      .then((data) => setStudentReports(data))
      .catch((err) => console.error("Error fetching student reports:", err));
  }, []);

  const updateStudentReportLabel = (id, label) => {
    setStudentReports((prev) =>
      prev.map((report) =>
        report.id === id ? { ...report, label } : report
      )
    );
  };

  const paginate = (arr, page) =>
    arr.slice((page - 1) * pageSize, page * pageSize);

  const AdminTable = () => {
    const totalPages = Math.ceil(adminReports.length / pageSize) || 1;
    const data = paginate(adminReports, adminPage);

    return (
      <>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-primary text-white" style={{ backgroundColor: "#0d6efd" }}>
              <tr>
                <th>PC Number</th>
                <th>Lab</th>
                <th>Status</th>
                <th>Date</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No admin reports found.
                  </td>
                </tr>
              ) : (
                data.map((r) => (
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

        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${adminPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link text-primary"
                onClick={() => setAdminPage((p) => p - 1)}
              >
                Previous
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i + 1}
                className={`page-item ${adminPage === i + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setAdminPage(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${adminPage === totalPages ? "disabled" : ""}`}
            >
              <button
                className="page-link text-primary"
                onClick={() => setAdminPage((p) => p + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </>
    );
  };

  const StudentTable = () => {
    const totalPages = Math.ceil(studentReports.length / pageSize) || 1;
    const data = paginate(studentReports, studentPage);

    return (
      <>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-primary text-white" style={{ backgroundColor: "#0d6efd" }}>
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
              {data.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted">
                    No student reports found.
                  </td>
                </tr>
              ) : (
                data.map((r) => (
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

        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${studentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link text-primary"
                onClick={() => setStudentPage((p) => p - 1)}
              >
                Previous
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i + 1}
                className={`page-item ${studentPage === i + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setStudentPage(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${studentPage === totalPages ? "disabled" : ""}`}
            >
              <button
                className="page-link text-primary"
                onClick={() => setStudentPage((p) => p + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </>
    );
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h1 className="fw text-primary">Reports Dashboard</h1>
  
      </div>

      <ul className="nav nav-pills justify-content-center mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "admin" ? "active bg-primary text-white" : "text-primary"}`}
            onClick={() => setActiveTab("admin")}
          >
            Admin Reports
          </button>
        </li>
        <li className="nav-item ms-2">
          <button
            className={`nav-link ${activeTab === "student" ? "active bg-primary text-white" : "text-primary"}`}
            onClick={() => setActiveTab("student")}
          >
            Student Reports
          </button>
        </li>
      </ul>

      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              {activeTab === "admin" ? <AdminTable /> : <StudentTable />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
