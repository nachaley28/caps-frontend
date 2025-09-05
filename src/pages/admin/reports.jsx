import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [labFilter, setLabFilter] = useState("All Labs");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [sortOption, setSortOption] = useState("Newest");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [reportsPerPage, setReportsPerPage] = useState(10);

  useEffect(() => {
    const fetchReports = async () => {
      await fetch("http://localhost:5000/get_reports")
        .then((res) => res.json())
        .then((data) => setReports(data));
    };
    fetchReports();
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Delete this report?")) return;
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  const handleDeleteAll = () => {
    if (!window.confirm("Delete ALL reports?")) return;
    setReports([]);
  };

  const handleExportExcel = () => {
    if (reports.length === 0) {
      alert("No reports to export.");
      return;
    }

    const data = reports.map((report) => {
      const dateObj = new Date(report.date);
      return {
        Item: report.item,
        Lab: report.lab,
        Label: report.label,
        "Submitted By": report.submitted_by,
        Status: report.status,
        Date: `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString()}`,
        Notes: report.notes || "",
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "reports.xlsx");
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.lab.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.submitted_by.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.notes?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLab = labFilter === "All" || report.lab === labFilter;
    const matchesStatus = statusFilter === "All" || report.status === statusFilter;

    const reportDate = new Date(report.date);
    const matchesDateFrom = !dateFrom || reportDate >= new Date(dateFrom);
    const matchesDateTo = !dateTo || reportDate <= new Date(dateTo);

    return matchesSearch && matchesLab && matchesStatus && matchesDateFrom && matchesDateTo;
  });

  const sortedReports = [...filteredReports].sort((a, b) => {
    if (sortOption === "Newest") return new Date(b.date) - new Date(a.date);
    if (sortOption === "Oldest") return new Date(a.date) - new Date(b.date);
    if (sortOption === "Alphabetical") return a.item.localeCompare(b.item);
    return 0;
  });

  const totalPages = Math.ceil(sortedReports.length / reportsPerPage);
  const startIndex = (currentPage - 1) * reportsPerPage;
  const currentReports = sortedReports.slice(startIndex, startIndex + reportsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const uniqueLabs = ["All", ...new Set(reports.map((r) => r.lab))];
  const uniqueStatuses = ["All", ...new Set(reports.map((r) => r.status))];

  const statusConfig = {
    Success: { class: "bg-success", icon: "✅" },
    Completed: { class: "bg-success", icon: "✔️" },
    Pending: { class: "bg-warning text-dark", icon: "⏳" },
    Failed: { class: "bg-danger" },
    Damage: { class: "bg-dark text-white"},
    Missing: { class: "bg-danger", },
    Default: { class: "bg-secondary"},
  };

  return (
    <div className="container mt-5">
      {/* Inline styles */}
      <style>{`
        /* Highlighted rows */
        .row-damage {
          background-color: #343a40 !important;
          color: white;
          animation: fadeIn 0.5s ease-in-out;
        }
        .row-missing {
          background-color: #dc3545 !important;
          color: white;
          animation: fadeIn 0.5s ease-in-out;
        }
        .row-pending {
          background-color: #ffc107 !important;
          animation: fadeIn 0.5s ease-in-out;
        }

        /* Hover glow for rows */
        .row-damage:hover,
        .row-missing:hover,
        .row-pending:hover {
          box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.7);
          transform: scale(1.01);
          transition: 0.2s ease-in-out;
        }

        /* Pagination glow */
        .pagination .page-item .page-link {
          transition: all 0.2s ease-in-out;
        }
        .pagination .page-item .page-link:hover {
          background-color: #0d6efd;
          color: white;
          box-shadow: 0px 0px 10px rgba(13, 110, 253, 0.7);
          transform: scale(1.05);
        }
        .pagination .page-item.active .page-link {
          background-color: #0d6efd;
          border-color: #0d6efd;
          box-shadow: 0px 0px 10px rgba(13, 110, 253, 0.9);
        }

        /* Rows per page selector glow */
        .rows-select {
          transition: all 0.2s ease-in-out;
        }
        .rows-select:hover {
          box-shadow: 0px 0px 10px rgba(0,0,0,0.3);
          transform: scale(1.05);
        }

        /* Fade-in animation */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="fw-bold text-primary"> Reports Dashboard</h2>
        <div className="d-flex gap-2 flex-wrap">
          <button className="btn btn-success" onClick={handleExportExcel}>
            Export to Excel
          </button>
          <button className="btn btn-danger" onClick={handleDeleteAll}>
          Delete All
          </button>
        </div>
      </div>

      <div className="row mb-4 g-3">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control shadow-sm"
            placeholder="🔎 Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <select
            className="form-select shadow-sm"
            value={labFilter}
            onChange={(e) => setLabFilter(e.target.value)}
          >
            {uniqueLabs.map((lab, i) => (
              <option key={i} value={lab}>
                {lab}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <select
            className="form-select shadow-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {uniqueStatuses.map((status, i) => (
              <option key={i} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-1">
          <select
            className="form-select shadow-sm"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option>Newest</option>
            <option>Oldest</option>
            <option>Alphabetical</option>
          </select>
        </div>
      </div>

      

      {/* Table */}
      {currentReports.length === 0 ? (
        <div className="text-center text-muted">
          <p>No reports found.</p>
        </div>
      ) : (
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Item</th>
                <th>Lab</th>
                <th>Label</th>
                <th>Submitted By</th>
                <th>Status</th>
                <th>Date</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentReports.map((report) => {
                const dateObj = new Date(report.date);
                const cfg = statusConfig[report.status] || statusConfig.Default;

                let rowClass = "";
                if (report.status === "Damage") rowClass = "row-damage";
                if (report.status === "Missing") rowClass = "row-missing";
                if (report.status === "Pending") rowClass = "row-pending";

                return (
                  <tr key={report.id} className={rowClass}>
                    <td>{report.item}</td>
                    <td>{report.lab}</td>
                    <td>{report.label}</td>
                    <td>{report.submitted_by}</td>
                    <td>
                      <span className={`badge ${cfg.class}`}>
                        {cfg.icon} {report.status}
                      </span>
                    </td>
                    <td>
                      {dateObj.toLocaleDateString()} {dateObj.toLocaleTimeString()}
                    </td>
                    <td>{report.notes || "—"}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(report.id)}
                      >
                         Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {sortedReports.length > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-2">
          {/* Rows per page selector */}
          <div className="d-flex align-items-center gap-2">
            <label className="fw-bold">Rows per page:</label>
            <select
              className="form-select rows-select"
              style={{ width: "100px" }}
              value={reportsPerPage}
              onChange={(e) => {
                setReportsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <nav>
            <ul className="pagination mb-0 justify-content-center">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => goToPage(currentPage - 1)}>
                  Previous
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i + 1}
                  className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                >
                  <button className="page-link" onClick={() => goToPage(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => goToPage(currentPage + 1)}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
