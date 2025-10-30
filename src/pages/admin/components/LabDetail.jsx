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
        <button onClick={() => setShowAddComputer(true)} className="btn" style={{ backgroundColor: "#006633", color: "white" }}>
          + Add Computer
        </button>
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
          lab={lab}
          addComputer={addComputer}
          onClose={() => setShowAddComputer(false)}
        />
      )}
    </div>
  );
}