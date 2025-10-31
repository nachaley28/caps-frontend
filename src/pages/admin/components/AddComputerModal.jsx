import React, { useState } from "react";
import {
  FaDesktop,
  FaMouse,
  FaKeyboard,
  FaHeadphones,
  FaServer,
  FaPlug,
  FaWifi,
  FaTimes,
  FaHashtag,
  FaTrashAlt,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AddComputerModal({
  lab,
  addComputer,
  addComputers,
  onClose,
}) {
  if (!lab) return null;

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
  const [otherParts, setOtherParts] = useState([{ name: "", serial: "" }]);
  const [bulkMode, setBulkMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleChange = (e) =>
    setParts({ ...parts, [e.target.name]: e.target.value });

  const handleOtherPartChange = (index, field, value) => {
    const updated = [...otherParts];
    updated[index][field] = value;
    setOtherParts(updated);
  };

  const addOtherPart = () => {
    if (otherParts.length < 10) {
      setOtherParts([...otherParts, { name: "", serial: "" }]);
    }
  };

  const removeOtherPart = (index) => {
    const updated = otherParts.filter((_, i) => i !== index);
    setOtherParts(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const exists = lab.computers?.some(
      (c) => c.name.toLowerCase() === pcNumber.toLowerCase()
    );
    if (exists) {
      alert(`A computer with the name "${pcNumber}" already exists in this lab.`);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/computer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            id: lab.lab_id,
            name: pcNumber,
            lab_name: lab.name,
            spec: JSON.stringify(parts),
            other_parts: JSON.stringify(otherParts),
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
        window.location.reload();
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
            <form
              onSubmit={handleSubmit}
              style={{ maxWidth: "1000px", margin: "auto" }}
            >
              {/* PC Number */}
              <div className="mb-3">
                <label className="form-label fw-bold">PC Number</label>
                <div className="input-group input-group-sm">
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

              {/* Section Title */}
              <h6 className="fw-bold mb-3" style={{ color: "#006633" }}>
                Parts Serial Numbers
              </h6>

              {/* 3-column grid */}
              <div className="row g-2">
                {Object.keys(parts).map((p) => (
                  <div key={p} className="col-md-4">
                    <label className="form-label text-capitalize small mb-1">
                      {p} Serial Number
                    </label>
                    <div className="input-group input-group-sm">
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

              {/* Other Parts Section */}
              <h6 className="fw-bold mt-4 mb-3" style={{ color: "#006633" }}>
                Other Parts (Optional)
              </h6>
              <div className="row g-2">
                {otherParts.map((part, index) => (
                  <div key={index} className="col-md-6">
                    <div className="d-flex align-items-start gap-2">
                      <div className="flex-grow-1">
                        <label className="form-label small mb-1">
                          Other Part {index + 1}
                        </label>
                        <div className="input-group input-group-sm mb-2">
                          <span className="input-group-text">
                            <FaPlug className="text-secondary" />
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Part Name"
                            value={part.name}
                            onChange={(e) =>
                              handleOtherPartChange(index, "name", e.target.value)
                            }
                          />
                        </div>
                        <div className="input-group input-group-sm">
                          <span className="input-group-text">
                            <FaHashtag className="text-secondary" />
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Serial Number"
                            value={part.serial}
                            onChange={(e) =>
                              handleOtherPartChange(index, "serial", e.target.value)
                            }
                          />
                        </div>
                      </div>

                      {/* Remove button */}
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm mt-4"
                        onClick={() => removeOtherPart(index)}
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add button */}
              <div className="d-flex justify-content-end mt-2">
                <button
                  type="button"
                  className="btn btn-outline-success btn-sm"
                  onClick={addOtherPart}
                  disabled={otherParts.length >= 10}
                >
                  + Add Other Part
                </button>
              </div>

              {/* Footer */}
              <div className="modal-footer mt-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-sm"
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
