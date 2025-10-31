
import React, { useState, useEffect } from "react";
import {
  FaDesktop,
  FaTrashAlt,
  FaEdit
} from "react-icons/fa";
import "./labs.css";

export default function LabGrid({ labs, selectLab }) {
  const [pcCount, setPcCount] = useState({});
  const [editLab, setEditLab] = useState(null);
  const [deleteLab, setDeleteLab] = useState(null);
  const [formData, setFormData] = useState({ name: "", location: "" });
  const [hoveredLabName, setHoveredLabName] = useState(null);
  const [selectedLabName, setSelectedLabName] = useState(null);

 
  useEffect(() => {
    if (!labs || labs.length === 0) return;

    fetch("http://localhost:5000/labs-pc-count")
      .then((res) => res.json())
      .then((data) => {
        const counts = {};
        data.forEach((item) => {
          counts[item.lab_name] = item.count;
        });
        setPcCount(counts);
      })
      .catch((err) => console.error("Error fetching lab counts:", err));
  }, [labs]);

  // Edit and Delete handlers
  const handleEditClick = (lab, e) => {
    e.stopPropagation();
    setEditLab(lab);
    setFormData({ name: lab.name, location: lab.location });
  };

  const handleDeleteClick = (lab, e) => {
    e.stopPropagation();
    setDeleteLab(lab);
  };

  const handleEditSubmit = () => {
    fetch(`http://localhost:5000/edit_lab/${encodeURIComponent(editLab.lab_id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lab_name: formData.name,
        location: formData.location,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setEditLab(null);
          window.location.reload();
        } else {
          console.error("Edit error:", data.message);
        }
      })
      .catch((err) => console.error("Edit error:", err));
  };

  const handleDelete = () => {
    fetch(`http://localhost:5000/delete_lab/${deleteLab.name}`, { method: "DELETE" })
      .then(() => {
        setDeleteLab(null);
        window.location.reload();
      })
      .catch((err) => console.error("Delete error:", err));
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, minmax(160px, 1fr))",
        gap: "20px",
        padding: "20px",
        justifyItems: "center",
      }}
    >
      {labs
        .slice()
        .sort((a, b) => parseInt(a.name) - parseInt(b.name))
        .map((lab) => {
          const isActive = hoveredLabName === lab.name || selectedLabName === lab.name;

          return (
            <div
              key={lab.name}
              onClick={() => {
                selectLab(lab);
                setSelectedLabName(lab.name);
              }}
              onMouseEnter={() => setHoveredLabName(lab.name)}
              onMouseLeave={() => setHoveredLabName(null)}
              style={{
                position: "relative",
                background: selectedLabName === lab.name ? "#E0FFE0" : "#fff",
                borderRadius: 16,
                padding: "20px 15px",
                cursor: "pointer",
                textAlign: "center",
                width: "100%",
                minHeight: 140,
                boxShadow: isActive
                  ? "0 8px 20px rgba(0,0,0,0.25)"
                  : "0 4px 12px rgba(0,0,0,0.12)",
                transform: isActive ? "translateY(-5px)" : "translateY(0)",
                transition: "all 0.25s ease",
              }}
            >
              {/* PC Count */}
              <div
                style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  backgroundColor: "#006633",
                  color: "#FFCC00",
                  padding: "5px 9px",
                  borderRadius: "50%",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                }}
              >
                {pcCount[lab.name] ?? 0}
              </div>

              {/* Edit/Delete */}
              <div
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  display: "flex",
                  gap: "6px",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <FaTrashAlt
                  size={16}
                  color="#e74c3c"
                  style={{ cursor: "pointer" }}
                  onClick={(e) => handleDeleteClick(lab, e)}
                />
                <FaEdit
                  size={16}
                  color="#FFCC00"
                  style={{ cursor: "pointer" }}
                  onClick={(e) => handleEditClick(lab, e)}
                />
              </div>

              {/* Desktop Icon */}
              <div
                style={{
                  backgroundColor: "#00663320",
                  borderRadius: "50%",
                  width: 48,
                  height: 48,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0 auto 10px auto",
                }}
              >
                <FaDesktop size={24} color="#006633" />
              </div>

              {/* Lab Name & Location */}
              <h5 style={{ color: "#006633", fontWeight: 600, marginBottom: 4 }}>
                Computer Lab {lab.name}
              </h5>
              <span
                style={{
                  backgroundColor: "#FFCC00",
                  color: "#006633",
                  padding: "3px 10px",
                  borderRadius: 14,
                  fontSize: "0.82rem",
                  fontWeight: 500,
                }}
              >
                {lab.location}
              </span>
            </div>
          );
        })}

      {/* Modals (Edit/Delete) */}
      {editLab && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setEditLab(null)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "25px 20px",
              width: 320,
              textAlign: "center",
              boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 style={{ color: "#006633", marginBottom: 15, fontWeight: 600 }}>Edit Lab</h4>
            <input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Lab Name"
              style={{
                width: "100%",
                marginBottom: 10,
                padding: "8px 6px",
                borderRadius: 6,
                border: "1px solid #ccc",
                fontSize: 14,
              }}
            />
            <input
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Location"
              style={{
                width: "100%",
                marginBottom: 15,
                padding: "8px 6px",
                borderRadius: 6,
                border: "1px solid #ccc",
                fontSize: 14,
              }}
            />
            <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
              <button
                onClick={() => setEditLab(null)}
                style={{
                  flex: 1,
                  padding: "8px 0",
                  borderRadius: 6,
                  border: "none",
                  backgroundColor: "#FFCC00",
                  color: "#006633",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                style={{
                  flex: 1,
                  padding: "8px 0",
                  borderRadius: 6,
                  border: "none",
                  backgroundColor: "#006633",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteLab && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setDeleteLab(null)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "25px 20px",
              width: 300,
              textAlign: "center",
              boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 style={{ color: "#006633", marginBottom: 12, fontWeight: 600 }}>Confirm Delete</h4>
            <p style={{ fontSize: 14, color: "#444" }}>
              Are you sure you want to delete <strong>Computer Lab {deleteLab.name}</strong>?
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 20 }}>
              <button
                onClick={() => setDeleteLab(null)}
                style={{
                  flex: 1,
                  padding: "8px 0",
                  borderRadius: 6,
                  border: "none",
                  backgroundColor: "#FFCC00",
                  color: "#006633",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                style={{
                  flex: 1,
                  padding: "8px 0",
                  borderRadius: 6,
                  border: "none",
                  backgroundColor: "#d32f2f",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
