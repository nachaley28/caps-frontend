import React, { useState, useEffect } from "react";
import {
  FaDesktop,
  FaMouse,
  FaKeyboard,
  FaHeadphones,
  FaServer,
  FaPlug,
  FaWifi,
  FaTimes,
  FaTrashAlt,
  FaCheckCircle,
  FaEdit,
  FaHashtag, 
} from "react-icons/fa";
import AddComputerModal from "./AddComputerModal";

const statusColors = {
  operational: { color: "#006633", label: "Operational", priority: 0 },
  notOperational: { color: "#FFCC00", label: "Not Operational", priority: 1 },
  damaged: { color: "#dc3545", label: "Damaged", priority: 2 },
  missing: { color: "#6c757d", label: "Missing", priority: 3 },
};

function StatusButtons({ part, compId, status, setStatus }) {
  const statuses = ["operational", "notOperational", "damaged", "missing"];
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 6 }}>
      {statuses.map((s) => (
        <button
          key={s}
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            border: `1px solid ${statusColors[s].color}`,
            backgroundColor: status === s ? statusColors[s].color : "transparent",
            cursor: "pointer",
            boxShadow: hovered === s ? `0 0 6px ${statusColors[s].color}` : "none",
            transition: "all 0.2s",
          }}
          onClick={() => setStatus(compId, part, s)}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(null)}
          title={statusColors[s].label}
        />
      ))}
    </div>
  );
}

export default function LabDetail({ lab, computers, back, addComputer }) {
  const [statuses, setStatuses] = useState({});
  const [selectedPC, setSelectedPC] = useState(null);
  const [showAddComputer, setShowAddComputer] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [deletePC, setDeletePC] = useState(null); 
  const [editPC, setEditPC] = useState(null);
  const [selectedPart,setSelectedPart]= useState(true); 
  const [selectedPCs, setSelectedPCs] = useState([]);
  const [rangeStart, setRangeStart] = useState([]);
  const [rangeEnd, setRangeEnd] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState([]);





  const [editData, setEditData] = useState({
    pcNumber: "",
    parts: {},
    otherParts: [],
  });
  const [showOtherParts, setShowOtherParts] = useState(true); 
  const [showQuickUpdate, setShowQuickUpdate] = useState(false);
  const getNextStatus = (current) => {
  const keys = Object.keys(statusColors);
  const idx = keys.indexOf(current);
  return keys[(idx + 1) % keys.length];
};


  // ✅ Handlers for Other Parts
  const handleOtherPartChange = (index, key, value) => {
    const updated = [...editData.otherParts];
    updated[index][key] = value;
    setEditData({ ...editData, otherParts: updated });
  };

  const removeOtherPart = (index) => {
    const updated = [...editData.otherParts];
    updated.splice(index, 1);
    setEditData({ ...editData, otherParts: updated });
  };

  const addOtherPart = () => {
    if (editData.otherParts.length < 10) {
      setEditData({
        ...editData,
        otherParts: [...editData.otherParts, { name: "", serial: "" }],
      });
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    console.log("Edited PC data:", editData);
    // TODO: send editData to backend
    setEditPC(null);
    setSaveMsg("Computer info updated successfully!");
  };

  const labComputers = computers
  .filter((c) => c.lab === lab.name)
  .sort((a, b) => a.pcNumber - b.pcNumber);


  useEffect(() => {
  if (saveMsg) {
    const timer = setTimeout(() => {
      setSaveMsg("");
    }, 5000); 

    return () => clearTimeout(timer);
  }
}, [saveMsg]);

  useEffect(() => {
    fetch("http://localhost:5000/get_computer_statuses")
      .then((res) => res.json())
      .then((data) => {
        const newStatuses = {};
        data.forEach((row) => {
          newStatuses[row.com_id] = {
            hdmi: row.hdmi,
            headphone: row.headphone,
            keyboard: row.keyboard,
            monitor: row.monitor,
            mouse: row.mouse,
            power: row.power,
            systemUnit: row.systemUnit,
            wifi: row.wifi,
          };
        });
        setStatuses(newStatuses);
          })
          .catch((err) => console.error("Error fetching statuses:", err));
      }, []);
          const partIcons = {
          monitor: FaDesktop,
          systemUnit: FaServer,
          keyboard: FaKeyboard,
          mouse: FaMouse,
          headphone: FaHeadphones,
          hdmi: FaPlug,
          power: FaPlug,
          wifi: FaWifi,
        };

        const getStatusStyle = (compId, part) =>
          statusColors[statuses[compId]?.[part] || "operational"];
        const setStatus = (compId, part, status) =>
          setStatuses((prev) => ({
            ...prev,
            [compId]: { ...prev[compId], [part]: status },
          }));

        const getPCColor = (pc) => {
          const partStatuses = Object.keys(pc.parts).map(
            (p) => statuses[pc.id]?.[p] || "operational"
          );
          const worst = partStatuses.reduce(
            (max, curr) =>
              statusColors[curr].priority > statusColors[max].priority ? curr : max,
            "operational"
          );
          return statusColors[worst].color;
        };
        const handleDeleteComputer = async () => {
        try {
          const res = await fetch(`http://localhost:5000/delete_computer/${deletePC.id}`, {
            method: "DELETE",
          });
          if (res.ok) {
            setDeletePC(null);
            window.location.reload(); 
          }
        } catch (err) {
          console.error("Error deleting computer:", err);
        }
      };
      
      
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button onClick={back} className="btn btn-secondary btn-sm">
        ← Back to Labs
        </button>
        <div>
        <button
          onClick={() => setShowAddComputer(true)}
          className="btn"
          style={{ backgroundColor: "#006633", color: "white", marginRight: 10 }}>
          + Add Computer
        </button>

        <button
          onClick={() => setShowQuickUpdate(true)}
          className="btn btn-warning"
          style={{ color: "#000" }}>
          Quick Update
        </button>
        </div>
      </div>
        {saveMsg && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.45)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: "35px 40px",
                borderRadius: "18px",
                textAlign: "center",
                boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
                width: "380px",
                animation: "fadeIn 0.4s ease",
              }}
            >
              
              <div
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  backgroundColor: "#E6F4EA",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0 auto 15px auto",
                  animation: "popIn 0.4s ease",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 52 52"
                  style={{ width: "38px", height: "38px" }}
                >
                  <circle
                    cx="26"
                    cy="26"
                    r="25"
                    fill="none"
                    stroke="#00a651"
                    strokeWidth="2"
                  />
                  <path
                    fill="none"
                    stroke="#00a651"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 27l7 7 16-16"
                  >
                    <animate
                      attributeName="stroke-dasharray"
                      from="0,50"
                      to="50,0"
                      dur="0.6s"
                      fill="freeze"
                    />
                  </path>
                </svg>
              </div>

              <h4
                style={{
                  color: "#006633",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                {saveMsg}
              </h4>

              <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
                

                <button
                  className="btn"
                  style={{
                    backgroundColor: "#004d26",
                    color: "#fff",
                    borderRadius: "8px",
                    padding: "8px 18px",
                    fontWeight: "500",
                  }}
                  onClick={() => (window.location.href = "/admin/reports")}
                >
                  See Report
                </button>

                 <button
                  className="btn"
                  style={{
                    backgroundColor: "#004d26",
                    color: "#fff",
                    borderRadius: "8px",
                    padding: "8px 18px",
                    fontWeight: "500",
                  }}
                  onClick={() => (window.location.href = "/admin/labs")}
                >
                  Dismiss
              </button>
              </div>
            </div>  
          </div>
        )}


      <h3 style={{ color: "#006633", marginBottom: 15 }}>Computer Lab{lab.name}– {lab.location}</h3>
     
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 20,
        }}
      >
        {labComputers.map((pc) => (
          <div
              key={pc.id}
              onClick={() => setSelectedPC(pc)}
              style={{
                background: getPCColor(pc),
                border: "1px solid #e0e6ed",
                borderRadius: 10,
                padding: "20px 10px",
                textAlign: "center",
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                position: "relative",
                overflow: "visible",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
                
                const summary = e.currentTarget.querySelector(".part-summary");
                if (summary) {
                  const rect = summary.getBoundingClientRect();
                  const screenWidth = window.innerWidth;

                  if (rect.left < 0) {
                    summary.style.left = `${-rect.left + rect.width / 2}px`;
                  } else if (rect.right > screenWidth) {
                    summary.style.left = `calc(50% - ${rect.right - screenWidth}px)`;
                  } else {
                    summary.style.left = "50%";
                  }

                  summary.style.opacity = 1;
                  summary.style.transform = "translateX(-50%) translateY(0)";
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.05)";
                
                const summary = e.currentTarget.querySelector(".part-summary");
                if (summary) {
                  summary.style.opacity = 0;
                  summary.style.transform = "translateX(-50%) translateY(-10px)";
                }
              }}
            >
              <FaDesktop size={50} color="#fff" />
              <h6 style={{ marginTop: 10, color: "#fff" }}>PC {pc.pcNumber}</h6>
              

              <div
                className="part-summary"
                style={{
                  position: "absolute",
                  top: -10,
                  left: "50%",
                  transform: "translateX(-50%) translateY(-10px)",
                  display: "flex",
                  gap: 10,
                  background: "rgba(0,0,0,0.85)",
                  padding: "8px 12px",
                  borderRadius: 8,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  opacity: 0,
                  pointerEvents: "none",
                  transition: "opacity 0.25s ease, transform 0.25s ease, left 0.25s ease",
                  zIndex: 10,
                }}
              >
                {Object.keys(pc.parts).map((part) => {
                  const Icon = partIcons[part];
                  const status = statuses[pc.id]?.[part] || "operational";
                  const color = statusColors[status].color;
                  return <Icon key={part} size={18} color={color} title={part} />;
                })}

                
                <div
                  style={{
                    position: "absolute",
                    bottom: -6,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 0,
                    height: 0,
                    borderLeft: "6px solid transparent",
                    borderRight: "6px solid transparent",
                    borderTop: "6px solid rgba(0,0,0,0.85)",
                  }}
                />
              </div>

              <div
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  display: "flex",
                  gap: "10px",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <FaEdit
                size={18}
                color="white"
                style={{ cursor: "pointer" }}
                title="Edit"
                onClick={() => {
                  setEditPC(pc);
                  setEditData({
                    pcNumber: pc.pcNumber,
                    serialNumber: pc.serialNumber || "",
                  });
                }}
              />
             <FaTrashAlt
              size={18}
              color="white"
              style={{ cursor: "pointer" }}
              title="Delete"
              onClick={() => setDeletePC(pc)} 
            />
             </div>
            </div>
          ))}
      </div>

        {deletePC && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: "25px 30px",
                borderRadius: "12px",
                width: "350px",
                textAlign: "center",
                boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
              }}
            >
              <h5 style={{ color: "#006633", marginBottom: "15px" }}>
                Confirm Delete
              </h5>
              <p style={{ color: "#444", fontSize: "15px" }}>
                Are you sure you want to delete{" "}
                <strong>PC {deletePC.pcNumber}</strong>?
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "20px",
                }}
              >
                <button
                  className="btn"
                  style={{
                    backgroundColor: "#6c757d",
                    color: "#fff",
                    flex: 1,
                    marginRight: "8px",
                  }}
                  onClick={() => setDeletePC(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn"
                  style={{
                    backgroundColor: "#d32f2f",
                    color: "#fff",
                    flex: 1,
                    marginLeft: "8px",
                  }}
                  onClick={handleDeleteComputer}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
 {/* ✅ EDIT MODAL */}
        {editPC && (
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
            zIndex: 9999,
            overflowY: "auto",
            padding: "15px",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px 25px",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "700px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
            }}
          >
            <h5 style={{ color: "#006633", marginBottom: "15px" }}>
              Edit Computer Info – PC {editData.pcNumber || ""}
            </h5>

            <form onSubmit={handleEditSubmit}>
              {/* PC Number */}
              <div className="mb-2">
                <label className="form-label fw-bold small">PC Number</label>
                <div className="input-group input-group-sm">
                  <span className="input-group-text">
                    <FaDesktop className="text-success" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    value={editData.pcNumber || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, pcNumber: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Predefined Parts */}
              <div className="mb-3">
                <h6 className="fw-bold small" style={{ color: "#006633" }}>
                  Parts Serial Numbers
                </h6>
                <div className="row g-2">
                  {["monitor","systemUnit","keyboard","mouse","headphone","hdmi","power","wifi"].map((part) => {
                    const Icon = partIcons[part] || FaPlug;
                    return (
                      <div key={part} className="col-6 col-md-4">
                        <div className="input-group input-group-sm mb-1">
                          <span className="input-group-text"><Icon /></span>
                          <input
                            type="text"
                            className="form-control"
                            placeholder={`${part} Serial`}
                            value={editData.parts?.[part] || ""}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                parts: { ...editData.parts, [part]: e.target.value },
                              })
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Other Parts Toggle */}
              <div className="d-flex justify-content-end mb-2">
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => setShowOtherParts((prev) => !prev)}
                >
                  {showOtherParts ? "Hide Other Parts" : "Edit Other Parts"}
                </button>
              </div>

              {/* Other Parts Inputs */}
              {showOtherParts && (
                <div className="row g-2 mb-2">
                  {(editData.otherParts || []).map((op, idx) => (
                    <div key={idx} className="col-12 col-md-6">
                      <div className="d-flex align-items-start gap-2">
                        <div className="flex-grow-1">
                          <div className="input-group input-group-sm mb-1">
                            <span className="input-group-text"><FaPlug /></span>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Part Name"
                              value={op?.name || ""}
                              onChange={(e) => handleOtherPartChange(idx, "name", e.target.value)}
                            />
                          </div>
                          <div className="input-group input-group-sm">
                            <span className="input-group-text"><FaHashtag /></span>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Serial Number"
                              value={op?.serial || ""}
                              onChange={(e) => handleOtherPartChange(idx, "serial", e.target.value)}
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeOtherPart(idx)}
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="col-12 d-flex justify-content-end mt-1">
                    <button
                      type="button"
                      className="btn btn-outline-success btn-sm"
                      onClick={addOtherPart}
                      disabled={(editData.otherParts || []).length >= 10}
                    >
                      + Add Other Part
                    </button>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="d-flex justify-content-end gap-2 mt-3">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setEditPC(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-sm"
                  style={{ backgroundColor: "#006633", color: "#fff" }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
        )}





         




{showQuickUpdate && (
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
      zIndex: 9999,
      padding: "10px",
    }}
  >
    <div
      style={{
        background: "#fff",
        borderRadius: "15px",
        width: "80%",
        maxWidth: "850px",
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 20px",
          borderBottom: "1px solid #ccc",
          flexShrink: 0,
        }}
      >
        <h4 style={{ color: "#006633", margin: 0 }}>Quick Update PCs Status</h4>
        <button
          className="btn-close"
          onClick={() => setShowQuickUpdate(false)}
          style={{ fontSize: "18px" }}
        >
          <FaTimes />
        </button>
      </div>

      {/* Scrollable Content */}
      <div
        style={{
          padding: "15px 20px",
          overflowY: "auto",
          flex: 1,
        }}
      >
        {/* Step 1: Select Part */}
        <div style={{ marginBottom: 12 }}>
          <span style={{ fontWeight: 600 }}>Select Part to Update:</span>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginTop: 8,
              justifyContent: "center",
            }}
          >
            {Object.keys(partIcons).map((part) => {
              const Icon = partIcons[part];
              return (
                <button
                  key={part}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    border:
                      selectedPart === part ? "2px solid #006633" : "1px solid #ccc",
                    backgroundColor: selectedPart === part ? "#e6f7e6" : "#f4f4f4",
                    cursor: "pointer",
                    transition: "0.2s",
                  }}
                  onClick={() => {
                    setSelectedPart(part);
                    setSelectedStatus("");
                    setSelectedPCs([]);
                  }}
                >
                  <Icon size={28} />
                  <span style={{ fontSize: 13, marginTop: 5 }}>{part}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Select Status */}
        {selectedPart && (
          <div style={{ marginBottom: 12 }}>
            <span style={{ fontWeight: 600 }}>
              Select Status for {selectedPart}:
            </span>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginTop: 8,
                justifyContent: "center",
              }}
            >
              {Object.keys(statusColors).map((s) => (
                <button
                  key={s}
                  style={{
                    backgroundColor:
                      selectedStatus === s
                        ? statusColors[s]?.color || "#f4f4f4"
                        : "#f4f4f4",
                    color: s === "missing" ? "#fff" : "#000",
                    border:
                      selectedStatus === s ? "2px solid #006633" : "1px solid #ccc",
                    padding: "6px 16px",
                    borderRadius: 25,
                    cursor: "pointer",
                    fontWeight: 500,
                    transition: "0.2s",
                  }}
                  onClick={() => setSelectedStatus(s)}
                >
                  {statusColors[s]?.label || s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Select PCs */}
        {selectedPart && selectedStatus && (
          <div style={{ marginBottom: 15, display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: 600 }}>Select PCs to Update:</span>

            {/* Select / Deselect All */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                marginTop: 8,
              }}
            >
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() =>
                  setSelectedPCs(labComputers.map((pc) => pc.id))
                }
              >
                Select All
              </button>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setSelectedPCs([])}
              >
                Deselect All
              </button>
            </div>

            {/* PC Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(10, 1fr)",
                gap: 12,
                marginTop: 10,
              }}
            >
              {labComputers.map((pc) => {
                const selected = selectedPCs.includes(pc.id);
                const currentStatus =
                  pc.parts && pc.parts[selectedPart]
                    ? pc.parts[selectedPart]
                    : "unknown";
                const statusColor =
                  statusColors[currentStatus]?.color || "#f4f4f4";
                const selectedStatusColor =
                  statusColors[selectedStatus]?.color || "#c8e6c9";

                return (
                  <div
                    key={pc.id}
                    onClick={() => {
                      setSelectedPCs((prev) =>
                        prev.includes(pc.id)
                          ? prev.filter((id) => id !== pc.id)
                          : [...prev, pc.id]
                      );
                    }}
                    style={{
                      padding: "14px",
                      borderRadius: "10px",
                      border: selected ? "2px solid #006633" : "1px solid #ccc",
                      cursor: "pointer",
                      backgroundColor: selected ? selectedStatusColor : statusColor,
                      textAlign: "center",
                      position: "relative",
                    }}
                  >
                    <FaDesktop size={34} />
                    <span
                      style={{
                        fontSize: 13,
                        marginTop: 6,
                        fontWeight: 500,
                        display: "block",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        color: "#333",
                      }}
                      title={pc.name}
                    >
                      {pc.name}
                    </span>
                    {!selected && (
                      <span
                        style={{
                          position: "absolute",
                          bottom: 6,
                          left: "50%",
                          transform: "translateX(-50%)",
                          fontSize: 10,
                          padding: "2px 5px",
                          borderRadius: 4,
                          backgroundColor: "#fff",
                          border: "1px solid #ccc",
                        }}
                      >
                        {currentStatus}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 10,
          padding: "10px 20px",
          borderTop: "1px solid #ccc",
          flexShrink: 0,
        }}
      >
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => setShowQuickUpdate(false)}
        >
          Cancel
        </button>
        <button
          className="btn btn-sm"
          style={{ backgroundColor: "#006633", color: "#fff" }}
          onClick={() => {
            const updated = {};
            selectedPCs.forEach((pcId) => {
              updated[pcId] = { [selectedPart]: selectedStatus };
            });

            fetch("http://localhost:5000/update_computer_status_bulk", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ statuses: updated }),
            })
              .then((res) => res.json())
              .then((data) => {
                console.log("Saved all:", data);
                setShowQuickUpdate(false);
                setSaveMsg("Selected PCs updated!");
                setTimeout(() => setSaveMsg(""), 4000);
              })
              .catch((err) =>
                console.error("Error saving bulk statuses:", err)
              );
          }}
        >
          Save All
        </button>
      </div>
    </div>
  </div>
)}

 

 {selectedPC && (
      <div className="modal-backdrop">
        <div className="modal-card large">
          <div
            className="modal-header"
            style={{ backgroundColor: "#006633", color: "white" }}
          >
            <span>PC {selectedPC.pcNumber} – Update Status</span>
            <button
              onClick={() => setSelectedPC(null)}
              className="btn-close text-white"
            >
              <FaTimes />
            </button>
          </div>

      <div className="modal-body">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
          }}
        >
          {Object.keys(selectedPC.parts).map((part) => {
            const Icon = partIcons[part];
            const style = getStatusStyle(selectedPC.id);

            const value = selectedPC.parts[part];
            const partLabel =
              value === 1
                ? "Present"
                : value === 0
                ? "Missing"
                : String(value);

            return (
              <div
                key={part}
                style={{
                  textAlign: "center",
                  padding: 12,
                  borderRadius: 10,
                  background: "#f8f9fa",
                }}
              >
                <Icon size={50} color={style.color} />
                <div style={{ textTransform: "capitalize", marginTop: 6 }}>
                  {part}
                </div>

              
                <div style={{ fontSize: 12, color: "#495057", marginTop: 4 }}>
                  {partLabel}
                </div>

                <StatusButtons
                  part={part}
                  compId={selectedPC.id}
                  status={statuses[selectedPC.id]?.[part] || "operational"}
                  setStatus={(compId, p, newStatus) => {
                    setStatuses((prev) => ({
                      ...prev,
                      [compId]: { ...prev[compId], [p]: newStatus },
                    }));
                  }}
                />
              </div>
            );
          })}
        </div>

       
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 20,
            marginTop: 25,
            flexWrap: "wrap",
            background: "#f8f9fa",
            padding: 12,
            borderRadius: 8,
          }}
        >
          {Object.keys(statusColors).map((s) => (
            <div
              key={s}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  backgroundColor: statusColors[s].color,
                  border: "1px solid #ccc",
                }}
              />
              <span style={{ fontSize: 14, color: "#495057" }}>
                {statusColors[s].label}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="modal-footer"> 
        <button onClick={() => { 
          const compStatuses = statuses[selectedPC.id]; 
          const compIdToSend = selectedPC.real_id || selectedPC.random_id || selectedPC.id; 

          fetch("http://localhost:5000/update_computer_status", 
          { method: "POST", headers: { "Content-Type": "application/json" }, 
          body: JSON.stringify({ compId: compIdToSend, statuses: compStatuses, }), }) 
          .then((res) => res.json()) 
          .then((data) => { console.log("Saved:", data); 
            setSelectedPC(null); 
            setSaveMsg("Status updated successfully!"); 
            setTimeout(() => setSaveMsg(""), 4000); }) 
            .catch((err) => console.error("Error saving statuses:", err)); }} 
          className="btn" 
            style={{ backgroundColor: "#006633",
            color: "white",
            fontWeight: "600",
            padding: "8px 16px",
            borderRadius: "6px", border: "none", }} > 
            Save </button> 
            </div>
              </div>
            </div>
          )}







      {showAddComputer && (
      <AddComputerModal
        onClose={() => setShowAddComputer(false)}
        lab={lab} 
      />
    )}
        
    </div>
  );
}
 