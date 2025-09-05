import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  function getStoredUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  useEffect(() => {
    const fetchInventory = async () => {
      const user = getStoredUser();
      await fetch("http://127.0.0.1:5000/get_inventory", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-User-Email": user?.email || "",
          "X-User-Id": user?.lgid || "",
        },
      })
        .then((res) => res.json())
        .then((data) => setInventory(data));
    };
    fetchInventory();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Operational":
        return <span className="badge bg-success">{status}</span>;
      case "Not Operational":
        return <span className="badge bg-danger">{status}</span>;
      case "Missing":
        return <span className="badge bg-warning text-dark">{status}</span>;
      case "Damaged":
        return <span className="badge bg-danger">{status}</span>;
      case "Repaired":
        return <span className="badge bg-info text-dark">{status}</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  const downloadAll = () => {
    if (!window.confirm("Download all inventory items?")) return;
    inventory.forEach((item) => {
      const content = Object.entries(item)
        .map(([key, val]) => `${key}: ${val}`)
        .join("\n");
      const blob = new Blob([content], { type: "text/plain" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${item.category}_${item.id}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
      try {
        const res = fetch(`http://localhost:5000/delete_inventory/${id}`, {
          method: "DELETE",
        });
        setInventory((prev) => prev.filter((item) => item.id !== id));
        if (!res.ok) throw new Error("Failed to delete report");

        
      } catch (err) {
        console.error("Error deleting report:", err);
      }
    
  };

  const handleDeleteAll = () => {
    if (!window.confirm("Are you sure you want to delete all inventory?")) return;
    try {
        const res = fetch(`http://localhost:5000/delete_inventory/ALL`, {
          method: "DELETE",
        });
        setInventory([]);
        if (!res.ok) throw new Error("Failed to delete report");

        
      } catch (err) {
        console.error("Error deleting report:", err);
      }
    
  };

  const handleExportExcel = () => {
    if (inventory.length === 0) {
      alert("No inventory to export.");
      return;
    }

    const data = inventory.map((item) => ({
      ID: item.id,
      Category: item.category,
      Name: item.name,
      Lab: item.lab,
      Specs: item.specs,
      Quantity: item.quantity,
      Status: item.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "inventory.xlsx");
  };

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lab.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.status.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || item.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredInventory.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentItems = filteredInventory.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container mt-5">
      {/* Embedded Styling */}
      <style>{`
        tbody tr {
          transition: all 0.25s ease-in-out;
        }
        tbody tr:hover {
          transform: scale(1.01);
          cursor: pointer;
        }
        .row-operational:hover {
          box-shadow: 0px 0px 12px rgba(25, 135, 84, 0.8);
        }
        .row-damaged:hover {
          box-shadow: 0px 0px 14px rgba(255, 0, 0, 0.9);
        }
        .row-missing:hover {
          box-shadow: 0px 0px 14px rgba(255, 193, 7, 0.9);
        }
        .row-not-operational:hover {
          box-shadow: 0px 0px 14px rgba(220, 53, 69, 0.9);
        }
        .row-repaired:hover {
          box-shadow: 0px 0px 12px rgba(13, 202, 240, 0.9);
        }
        .row-default:hover {
          box-shadow: 0px 0px 12px rgba(108, 117, 125, 0.9);
        }
      `}</style>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="fw-bold text-primary">🛠️ Inventory </h2>
        <div className="d-flex gap-2 flex-wrap">
          <button className="btn btn-success" onClick={handleExportExcel}>
            Export Excel
          </button>
          <button className="btn btn-primary" onClick={downloadAll}>
             Download All
          </button>
          <button className="btn btn-danger" onClick={handleDeleteAll}>
            Delete All
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-4 g-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control shadow-sm"
            placeholder="🔎 Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select shadow-sm"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option>All</option>
            <option>Operational</option>
            <option>Not Operational</option>
            <option>Damaged</option>
            <option>Repaired</option>
            <option>Missing</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive shadow-sm rounded">
        <table className="table table-striped table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Category</th>
              <th>Name</th>
              <th>Lab</th>
              <th>Specs</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr
                key={item.id}
                className={`row-${
                  item.status
                    ? item.status.toLowerCase().replace(" ", "-")
                    : "default"
                }`}
              >
                <td>{item.id}</td>
                <td>{item.category}</td>
                <td>{item.name}</td>
                <td>{item.lab}</td>
                <td>{item.specs}</td>
                <td>{item.quantity}</td>
                <td>{getStatusBadge(item.status)}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(item.id)}
                  >
                     Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredInventory.length > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-2">
          <div className="d-flex align-items-center gap-2">
            <label className="fw-bold">Rows per page:</label>
            <select
              className="form-select"
              style={{ width: "100px" }}
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
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
                <button
                  className="page-link"
                  onClick={() => goToPage(currentPage - 1)}
                >
                  Previous
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i + 1}
                  className={`page-item ${
                    currentPage === i + 1 ? "active" : ""
                  }`}
                >
                  <button className="page-link" onClick={() => goToPage(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => goToPage(currentPage + 1)}
                >
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
