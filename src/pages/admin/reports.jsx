import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      await fetch('http://localhost:5000/get_reports')
      .then(res => res.json())
      .then(data => setReports(data))
      
    };

    fetchReports();
  }, []);

  // Toggle read/unread for a single report
  const handleToggleRead = (id) => {
    setReports(prev =>
      prev.map(r => r.id === id ? { ...r, isRead: !r.isRead } : r)
    );
  };

  // Delete a single report
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    setReports(prev => prev.filter(r => r.id !== id));
  };

  // Bulk download all reports
  const handleDownloadAll = () => {
    if (!window.confirm("Are you sure you want to download all reports?")) return;

    reports.forEach(report => {
      const element = document.createElement("a");
      const dateObj = new Date(report.date);
      const file = new Blob(
        [
          `Item: ${report.item}`,
          `Status: ${report.report_status}`,
          `Lab: ${report.lab}\n`,
          `Label: ${report.label}`,
          `Submitted By: ${report.submitted_by}\n`,
          `Status: ${report.status}\n`,
          `Submitted Date: ${dateObj.toLocaleDateString()}\n`,
          `Submitted Time: ${dateObj.toLocaleTimeString()}\n`,
          `Notes: ${report.notes}\n`,
          `Status: ${report.isRead ? 'Read' : 'Unread'}`
        ],
        { type: "text/plain" }
      );
      element.href = URL.createObjectURL(file);
      element.download = `${report.title.replace(/ /g, "_")}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    });
  };

  // Bulk delete all reports
  const handleDeleteAll = () => {
    if (!window.confirm("Are you sure you want to delete all reports?")) return;
    setReports([]);
  };

  const toggleFilter = () => setShowUnreadOnly(!showUnreadOnly);

  // Sort unread reports first
  const sortedReports = [...reports].sort((a, b) => a.isRead - b.isRead);
  const displayedReports = showUnreadOnly
    ? sortedReports.filter(r => !r.isRead)
    : sortedReports;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-primary fw-bold">Reports Submitted</h2>

      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div className="d-flex gap-2 flex-wrap">
          <button className="btn btn-outline-primary" onClick={toggleFilter}>
            {showUnreadOnly ? 'Show All Reports' : 'Show Unread Only'}
          </button>
          <button className="btn btn-success" onClick={handleDownloadAll}>
            Download All Reports
          </button>
          <button className="btn btn-danger" onClick={handleDeleteAll}>
            Delete All Reports
          </button>
        </div>
        <span className="fw-bold text-secondary">Total Reports: {reports.length}</span>
      </div>

      {displayedReports.length === 0 ? (
        <p className="text-muted">No reports available.</p>
      ) : (
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                
                <th>Status</th>
                <th>Item</th>
                <th>Lab</th>
                <th>Label</th>
                <th>Submitted By</th>
                <th>Status</th>
                <th>Submitted Date:</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedReports.map(report => {
                const dateObj = new Date(report.date);
                const submittedDate = dateObj.toLocaleDateString();
                const submittedTime = dateObj.toLocaleTimeString();
                return (
                  <tr key={report.id} style={{ backgroundColor: report.report_status ? 'white' : '#e3f2fd' }}>
                    <td>
                      <span className={`badge ${report.report_status ? 'bg-secondary' : 'bg-primary'}`}>
                        {report.report_status ? 'Read' : 'Unread'}
                      </span>
                    </td>
                    <td>{report.item}</td>
                    <td>{report.lab}</td>
                    <td>{report.label}</td>
                    <td>{report.submitted_by}</td>
                    <td>{report.status}</td>
                    <td>{submittedDate} - {submittedTime}</td>
                    <td>{report.notes}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className={`btn btn-sm ${report.report_status ? 'btn-warning' : 'btn-primary'}`}
                          onClick={() => handleToggleRead(report.id)}
                        >
                          {report.report_status ? 'Mark Unread' : 'Mark Read'}
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(report.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
