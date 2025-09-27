import { useEffect, useState } from "react";
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
  FaEdit,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./labs.css";  
import * as XLSX from "xlsx";



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


function LabGrid({ labs, selectLab, openEditLab }) {
  // ✅ PC counts for each lab
  const [pcCount, setPcCount] = useState({});

  useEffect(() => {
    if (!labs || labs.length === 0) return;

    // Fetch all lab counts in one request
    fetch("http://localhost:5000/labs-pc-count")
      .then((res) => res.json())
      .then((data) => {
        // Convert list of { lab, count } to object { labName: count }
        const counts = {};
        data.forEach((item) => {
          counts[item.lab] = item.count;
        });
        setPcCount(counts);
      })
      .catch((err) => console.error("Error fetching lab counts:", err));
  }, [labs]);

  return (
    <div className="d-flex flex-wrap gap-3 justify-content-center">
    {labs
      .slice()
      .sort((a, b) => a.name - b.name) // sort by lab number
      .map((lab) => (
        <div
          key={lab.id}
          onClick={() => selectLab(lab)}
          style={{
            position: "relative",
            background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
            borderRadius: 16,
            border: "1px solid #dee2e6",
            padding: "25px 20px",
            cursor: "pointer",
            textAlign: "center",
            width: 250,
            minHeight: 160,
            boxShadow: "0 3px 8px rgba(0,0,0,0.08)",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-6px)";
            e.currentTarget.style.boxShadow =
              "0 8px 18px rgba(0, 102, 51, 0.25)";
            e.currentTarget.style.background =
              "linear-gradient(135deg, #ffffff, #f1f3f6)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 3px 8px rgba(0,0,0,0.08)";
            e.currentTarget.style.background =
              "linear-gradient(135deg, #f8f9fa, #e9ecef)";
          }}
        >
         
          <div
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              backgroundColor: "#006633",
              color: "#FFCC00",
              padding: "4px 8px",
              borderRadius: "50%",
              fontWeight: 600,
              fontSize: "0.85rem",
            }}
          >
            {pcCount[lab.name] ?? 0}
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
              color="red"
              style={{ cursor: "pointer" }}
              title="Delete"
              onClick={() => {
                fetch(`http://localhost:5000/delete_lab/${lab.id}`, {
                  method: "DELETE",
                })
                  .then(() => window.location.reload())
                  .catch((err) => console.error("Delete error:", err));
              }}
            />
            <FaEdit
              size={18}
              color="#FFCC00"
              style={{ cursor: "pointer" }}
              title="Edit"
              onClick={() => openEditLab(lab)}
            />
          </div>

        
          <div
            style={{
              backgroundColor: "#00663320",
              borderRadius: "50%",
              width: 60,
              height: 60,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 auto 12px auto",
            }}
          >
            <FaDesktop size={28} color="#006633" />
          </div>

          <h5 style={{ color: "#006633", fontWeight: 600, marginBottom: 6 }}>
            Computer Lab {lab.name}
          </h5>
          <span
            style={{
              backgroundColor: "#FFCC00",
              color: "#006633",
              padding: "3px 10px",
              borderRadius: 12,
              fontSize: "0.85rem",
              fontWeight: 500,
            }}
          >
            {lab.location}
          </span>
        </div>
      ))}
  </div>
  );
}






function AddLabModal({ addLab, onClose }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/add_laboratory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: { lab_name: name, location: location },
      }),
    })
      .then((res) => res.json())
      .then((newLab) => {
        addLab(newLab);
        onClose();
      })
      .catch((err) => console.error("Error adding lab:", err));
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header" style={{ backgroundColor: "#006633", color: "white" }}>
          <h5 className="mb-0">Add Laboratory</h5>
          <button onClick={onClose} className="btn-close text-white">
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="mb-3">
            <label className="form-label fw-bold">Laboratory Number</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter Laboratory Number"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Location</label>
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
            <button type="submit" className="btn" style={{ backgroundColor: "#006633", color: "white" }}>
              Add Lab
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}




function AddComputerModal({lab,addComputer,addComputers,onClose,}) {
  const [pcNumber, setPcNumber] = useState("");
  const [parts, setParts] = useState({
    monitor: "",
    systemUnit: "",
    keyboard: "",
    mouse: "",
    headphone: "",
    hdmi: "",
    power: "",
    wifi: "",
  });
  const [bulkMode, setBulkMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleChange = (e) =>
    setParts({ ...parts, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/computer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            name: pcNumber,
            lab_name: lab.name,
            spec: JSON.stringify(parts),
          },
        }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const newComputer = await res.json();
      addComputer?.(newComputer);
      onClose();
    } catch (err) {
      console.error("Error adding computer:", err);
    }
  };

  const handleBulkUpload = () => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      const computers = rows.map((r) => ({
        pc_name: r.pc_name || r.pcNumber || r.name || "",
        lab_name: lab.name,
        specs: JSON.stringify({
          monitor: r.monitor || "",
          systemUnit: r.systemUnit || "",
          keyboard: r.keyboard || "",
          mouse: r.mouse || "",
          headphone: r.headphone || "",
          hdmi: r.hdmi || "",
          power: r.power || "",
          wifi: r.wifi || "",
        }),
      }));

      setUploading(true);
      try {
        const res = await fetch("http://localhost:5000/computer/bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: computers }),
        });
        if (!res.ok) throw new Error(`Server error ${res.status}`);
        const inserted = await res.json();
        addComputers?.(inserted);
        onClose();
      } catch (err) {
        console.error("Bulk add error:", err);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const partIcons = {
    monitor: <FaDesktop className="text-success" />,
    systemUnit: <FaServer className="text-success" />,
    keyboard: <FaKeyboard className="text-success" />,
    mouse: <FaMouse className="text-success" />,
    headphone: <FaHeadphones className="text-success" />,
    hdmi: <FaPlug className="text-success" />,
    power: <FaPlug className="text-success" />,
    wifi: <FaWifi className="text-success" />,
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card large">
        <div
          className="modal-header"
          style={{ backgroundColor: "#006633", color: "white" }}
        >
          <div className="d-flex justify-content-between w-100 align-items-center">
            <h5 className="mb-0">Add Computer – Lab {lab.name}</h5>
            <div>
              <button
                type="button"
                className={`btn btn-sm me-2 ${
                  !bulkMode ? "btn-light" : "btn-outline-light"
                }`}
                onClick={() => setBulkMode(false)}
              >
                Manual
              </button>
              <button
                type="button"
                className={`btn btn-sm ${
                  bulkMode ? "btn-light" : "btn-outline-light"
                }`}
                onClick={() => setBulkMode(true)}
              >
                Bulk Upload
              </button>
              <button onClick={onClose} className="btn-close text-white ms-3">
                <FaTimes />
              </button>
            </div>
          </div>
        </div>

        <div className="modal-body">
          {bulkMode ? (
            <div className="p-3">
              <label className="form-label fw-bold">Upload CSV/Excel</label>
              <input
                type="file"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={(e) => setSelectedFile(e.target.files[0] || null)}
                className="form-control mb-3"
                disabled={uploading}
              />

              <button
                type="button"
                className="btn"
                style={{ backgroundColor: "#006633", color: "white" }}
                disabled={!selectedFile || uploading}
                onClick={handleBulkUpload}
              >
                {uploading ? "Uploading…" : "Upload"}
              </button>

              <small className="text-muted d-block mt-2">
                Required columns: pc_name (or pcNumber/name), monitor,
                systemUnit, keyboard, mouse, headphone, hdmi, power, wifi
              </small>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-bold">PC Number</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FaDesktop className="text-success" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    value={pcNumber}
                    onChange={(e) => setPcNumber(e.target.value)}
                    required
                  />
                </div>
              </div>

              <h6 className="fw-bold mt-3 mb-3" style={{ color: "#006633" }}>
                Parts Serial Numbers
              </h6>
              <div className="row g-3">
                {Object.keys(parts).map((p) => (
                  <div key={p} className="col-md-6">
                    <label className="form-label text-capitalize">
                      {p} Serial Number
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">{partIcons[p]}</span>
                      <input
                        type="text"
                        name={p}
                        className="form-control"
                        value={parts[p]}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="modal-footer mt-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn"
                  style={{ backgroundColor: "#006633", color: "white" }}
                >
                  Add Computer
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}




function LabDetail({ lab, computers, back, addComputer }) {
  const [statuses, setStatuses] = useState({});
  const [selectedPC, setSelectedPC] = useState(null);
  const [showAddComputer, setShowAddComputer] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  

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
  

  const labComputers = computers.filter((c) => c.lab === lab.name);
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
            backgroundColor: "#006633",
            color: "white",
            padding: "5px 10px",
            borderRadius: "6px",
            marginBottom: "15px",
            textAlign: "center",
            fontWeight: "500",
          }}
        >
          {saveMsg}
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

                  // Adjust left position if it overflows the screen
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
                  color=""
                  style={{ cursor: "pointer" }}
                  title="Delete"
                  onClick={() => {
                    fetch(`http://localhost:5000/delete_computer/${pc.id}`, {
                      method: "DELETE",
                    })
                      .then(() => window.location.reload())
                      .catch((err) => console.error("Delete error:", err));
                  }}
                />
              </div>
            </div>
        ))}
      </div>

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

        {/* Legend */}
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
        <button
          onClick={() => {
            const compStatuses = statuses[selectedPC.id];
            fetch("http://localhost:5000/update_computer_status", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                compId: selectedPC.id,
                statuses: compStatuses,
              }),
            })
              .then((res) => res.json())
              .then((data) => {
                console.log("Saved:", data);
                setSelectedPC(null);
                setSaveMsg("Status updated successfully!");
                setTimeout(() => setSaveMsg(""), 4000);
              })
              .catch((err) => console.error("Error saving statuses:", err));
              }}
              className="btn"
              style={{
                backgroundColor: "#006633",
                color: "white",
                fontWeight: "600",
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
              }}
            >
              Save
            </button>
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

export default function App() {
  const [selectedLab, setSelectedLab] = useState(null);
  const [labs, setLabs] = useState([]);
  const [computers, setComputers] = useState([]);
  const [showAddLab, setShowAddLab] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/get_laboratory")
      .then((res) => res.json())
      .then((data) => setLabs(data))
      .catch((err) => console.error("Error fetching labs:", err));

    fetch("http://localhost:5000/get_computers")
      .then((res) => res.json())
      .then((data) => setComputers(data))
      .catch((err) => console.error("Error fetching computers:", err));
  }, []);

  const addLab = (lab) => setLabs((prev) => [...prev, lab]);
  const addComputer = (comp) => setComputers((prev) => [...prev, comp]);

  return (
    <div style={{ padding: 40, background: "#f1f3f6", minHeight: "100vh" }}>
      {!selectedLab && (
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <h2 style={{ marginBottom: 20, color: "#006633" }}>
            Laboratories and Computers
          </h2>
          <button
            onClick={() => setShowAddLab(true)}
            className="btn"
            style={{ backgroundColor: "#006633", color: "white" }}
          >
            + Add Laboratory
          </button>
        </div>
      )}
      {!selectedLab ? (
        <LabGrid labs={labs} selectLab={setSelectedLab} />
      ) : (
        <LabDetail
          lab={selectedLab}
          computers={computers}
          back={() => setSelectedLab(null)}
          addComputer={addComputer}
        />
      )}
      {showAddLab && (
        <AddLabModal addLab={addLab} onClose={() => setShowAddLab(false)} />
      )}
    </div>
  );
}
