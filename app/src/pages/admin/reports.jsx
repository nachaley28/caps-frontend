import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Reports() {
  const [adminReports, setAdminReports] = useState([]);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/get_admin_computer_reports")
      .then((res) => res.json())
      .then((data) => setAdminReports(data))
      .catch((err) => console.error(err));
  }, []);

  // Filtered data based on search
  const filteredReports = adminReports.filter((r) =>
  (r.item || "").toLowerCase().includes(filterText.toLowerCase()) ||
  (r.lab || "").toLowerCase().includes(filterText.toLowerCase()) ||
  (r.status || "").toLowerCase().includes(filterText.toLowerCase()) ||
  (r.notes || "").toLowerCase().includes(filterText.toLowerCase())
);

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
    header: {
      style: {
        fontSize: "22px",
        fontWeight: "bold",
        color: "#006633",
      },
    },
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
        Admin Reports Dashboard
      </h1>

    
      <div className="mb-3 text-end">
        <input
          type="text"
          className="form-control"
          placeholder="Search reports..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{ maxWidth: "300px", display: "inline-block" }}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredReports}
        pagination
        highlightOnHover
        responsive
        customStyles={customStyles}
        defaultSortFieldId={1} 
      />
    </div>
  );
}
