import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import "./labs.css";

export default function AddLabModal({ addLab, onClose }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:5000/add_laboratory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { lab_name: name, location } }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          alert(data.error || "Error adding lab");
          return;
        }
        return data;
      })
      .then((newLab) => {
        if (newLab) {
          addLab(newLab);
          onClose();
        }
      })
      .catch((err) => console.error("Error adding lab:", err));
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h5>Add Laboratory</h5>
          <button className="btn-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>Laboratory Number</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter Laboratory Number"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-add-lab">
              Add Lab
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
