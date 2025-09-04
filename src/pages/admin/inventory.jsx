import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');

  function getStoredUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

  useEffect(() => {
    const fetchInventory = async () => {
      const user = getStoredUser();

      await fetch('http://127.0.0.1:5000/get_inventory',{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-User-Email": user?.email || "",
          "X-User-Id": user?.lgid || ""
        }
      })
      .then(res => res.json())
      .then(data => setInventory(data) )
      // setInventory(combinedInventory);
    };
    fetchInventory();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Operational': return <span className="badge bg-success">{status}</span>;
      case 'Not Operational': return <span className="badge bg-danger">{status}</span>;
      case 'Missing': return <span className="badge bg-warning text-dark">{status}</span>;
      case 'Damaged': return <span className="badge bg-danger">{status}</span>;
      case 'Repaired': return <span className="badge bg-info text-dark">{status}</span>;
      default: return <span className="badge bg-secondary">{status}</span>;
    }
  };

  const downloadAll = () => {
    if (!window.confirm("Download all inventory items?")) return;
    inventory.forEach(item => {
      const content = Object.entries(item).map(([key, val]) => `${key}: ${val}`).join('\n');
      const blob = new Blob([content], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${item.category}_${item.id}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    setInventory(prev => prev.filter(item => item.id !== id));
  };

  const handleDeleteAll = () => {
    if (!window.confirm("Are you sure you want to delete all inventory?")) return;
    setInventory([]);
  };

  // Filtered inventory based on status
  const filteredInventory = filterStatus === 'All'
    ? inventory
    : inventory.filter(item => item.status === filterStatus);

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-primary fw-bold">Combined Inventory Dashboard</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="btn-group">
          <button className="btn btn-success" onClick={downloadAll}>Download All Inventory</button>
          <button className="btn btn-danger" onClick={handleDeleteAll}>Delete All Inventory</button>
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className="fw-bold">Filter Status:</span>
          <select
            className="form-select form-select-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
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
            {filteredInventory.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.category}</td>
                <td>{item.name}</td>
                <td>{item.lab}</td>
                <td>{item.specs}</td>
                <td>{item.quantity}</td>
                <td>{getStatusBadge(item.status)}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
