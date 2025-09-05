import React, { useState, useEffect } from "react";
import {
  FaLaptop,
  FaDesktop,
  FaPlug,
  FaEdit,
  FaTrash,
  FaSearch,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

// ------------------ Glow Colors ------------------
const glowColors = {
  labs: "rgba(0,123,255,0.5)",
  computers: "rgba(40,167,69,0.5)",
  accessories: "rgba(255,193,7,0.5)",
};

// ------------------ Utility Functions ------------------
const getRowHover = (category) => ({
  style: { transition: "box-shadow 0.3s ease" },
  onMouseEnter: (e) => (e.currentTarget.style.boxShadow = `0 0 10px ${glowColors[category]}`),
  onMouseLeave: (e) => (e.currentTarget.style.boxShadow = "none"),
});

const getBtnHover = (color) => ({
  style: { transition: "box-shadow 0.3s ease" },
  onMouseEnter: (e) =>
    (e.currentTarget.style.boxShadow =
      color === "primary"
        ? "0 0 12px rgba(0,123,255,0.7)"
        : color === "success"
        ? "0 0 12px rgba(40,167,69,0.7)"
        : color === "warning"
        ? "0 0 12px rgba(255,193,7,0.7)"
        : "0 0 12px rgba(0,0,0,0.5)"),
  onMouseLeave: (e) => (e.currentTarget.style.boxShadow = "none"),
});

// ------------------ Lab Form ------------------
function LabForm({
  show,
  onClose,
  onSave,
  labName,
  setLabName,
  labLocation,
  setLabLocation,
  editing,
}) {
  if (!show) return null;

  return (
    <div
      className="card shadow-sm p-3 mb-3 border-0"
      style={{ transition: "box-shadow 0.3s ease" }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 15px rgba(0,123,255,0.5)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      <h5 className="card-title">{editing ? "Edit Lab" : "Add New Lab"}</h5>
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Lab Name"
        value={labName}
        onChange={(e) => setLabName(e.target.value)}
      />
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Location"
        value={labLocation}
        onChange={(e) => setLabLocation(e.target.value)}
      />
      <div className="d-flex gap-2">
        <button
          className="btn btn-primary w-100"
          {...getBtnHover("primary")}
          onClick={onSave}
        >
          {editing ? "Update Lab" : "Save Lab"}
        </button>
        <button
          className="btn btn-secondary w-100"
          {...getBtnHover("secondary")}
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ------------------ Item Form ------------------
function ItemForm({
  show,
  onClose,
  onSave,
  name,
  setName,
  spec,
  setSpec,
  assignedLab,
  setAssignedLab,
  labs,
  editing,
  title,
  btnColor,
}) {
  if (!show) return null;

  return (
    <div
      className="card shadow-sm p-3 mb-3 border-0"
      style={{ transition: "box-shadow 0.3s ease" }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 15px rgba(0,0,0,0.2)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      <h5 className="card-title">{editing ? `Edit ${title}` : `Add ${title}`}</h5>
      <input
        type="text"
        className="form-control mb-2"
        placeholder={`${title} Name`}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Specification"
        value={spec}
        onChange={(e) => setSpec(e.target.value)}
      />
      <select
        className="form-select mb-3"
        value={assignedLab}
        onChange={(e) => setAssignedLab(e.target.value)}
      >
        <option value="">Assign to Lab</option>
        {labs.map((l) => (
          <option key={l.id} value={`${l.name} (${l.location})`}>
            {l.name} — {l.location}
          </option>
        ))}
      </select>
      <div className="d-flex gap-2">
        <button className={`btn btn-${btnColor} w-100`} {...getBtnHover(btnColor)} onClick={onSave}>
          {editing ? `Update ${title}` : `Save ${title}`}
        </button>
        <button className="btn btn-secondary w-100" {...getBtnHover("secondary")} onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

// ------------------ Main Component ------------------
export default function AdminComputers() {
  const [labs, setLabs] = useState([]);
  const [computers, setComputers] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadLabs() {
      try {
        const res = await fetch("http://127.0.0.1:5000/get_laboratory");
        const data = await res.json();
        setLabs(data);
      } catch (err) {
        console.error(err);
      }
    }
    async function loadComputers() {
      try {
        const res = await fetch("http://127.0.0.1:5000/get_computer");
        const data = await res.json();
        setComputers(data);
      } catch (err) {
        console.error(err);
      }
    }
    async function loadAccessories() {
      try {
        const res = await fetch("http://127.0.0.1:5000/get_accessories");
        const data = await res.json();
        setAccessories(data);
      } catch (err) {
        console.error(err);
      }
    }
    loadLabs();
    loadComputers();
    loadAccessories();
  }, []);

  // ------------------ Forms State ------------------
  const [showLabForm, setShowLabForm] = useState(false);
  const [showComputerForm, setShowComputerForm] = useState(false);
  const [showAccessoryForm, setShowAccessoryForm] = useState(false);

  const [newLabName, setNewLabName] = useState("");
  const [newLabLocation, setNewLabLocation] = useState("");
  const [editingLabId, setEditingLabId] = useState(null);

  const [newComputerName, setNewComputerName] = useState("");
  const [newComputerSpec, setNewComputerSpec] = useState("");
  const [assignedLabForComputer, setAssignedLabForComputer] = useState("");
  const [editingComputerId, setEditingComputerId] = useState(null);

  const [newAccessoryName, setNewAccessoryName] = useState("");
  const [newAccessorySpec, setNewAccessorySpec] = useState("");
  const [assignedLabForAccessory, setAssignedLabForAccessory] = useState("");
  const [editingAccessoryId, setEditingAccessoryId] = useState(null);

  const addOrUpdateLab = () => {
    if (!newLabName.trim() || !newLabLocation.trim()) return;
    if (editingLabId) {
      setLabs(labs.map((l) => (l.id === editingLabId ? { ...l, name: newLabName, location: newLabLocation } : l)));
      setEditingLabId(null);
    } else {
      setLabs([...labs, { id: Date.now(), name: newLabName, location: newLabLocation }]);
    }
    setNewLabName("");
    setNewLabLocation("");
    setShowLabForm(false);
  };

  const deleteLab = async (id) => {
  if (!window.confirm("Delete this lab?")) return;
  try {
    const res = await fetch(`http://127.0.0.1:5000/delete_lab/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete lab");
    setLabs(labs.filter((l) => l.id !== id));
  } catch (err) {
    console.error("Error deleting lab:", err);
  }
};

  const filterLabs = labs.filter(
    (lab) =>
      lab?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lab?.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center fw-bold">Computer Labs Management</h2>

      <div className="input-group mb-4 shadow-sm">
        <span className="input-group-text bg-white">
          <FaSearch />
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="Search labs, computers, accessories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <ul className="nav nav-tabs mb-3" id="adminTabs" role="tablist">
        <li className="nav-item" role="presentation">
          <button className="nav-link active" id="labs-tab" data-bs-toggle="tab" data-bs-target="#labs" type="button" role="tab">
            <FaDesktop className="me-2" /> Labs
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link" id="computers-tab" data-bs-toggle="tab" data-bs-target="#computers" type="button" role="tab">
            <FaLaptop className="me-2" /> Computers
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link" id="accessories-tab" data-bs-toggle="tab" data-bs-target="#accessories" type="button" role="tab">
            <FaPlug className="me-2" /> Accessories
          </button>
        </li>
      </ul>

      <div className="tab-content" id="adminTabsContent">
        {/* Labs Tab */}
        <div className="tab-pane fade show active" id="labs" role="tabpanel">
          <button className="btn btn-primary mb-3" {...getBtnHover("primary")} onClick={() => setShowLabForm(!showLabForm)}>
            <FaDesktop className="me-2" /> Add Lab
          </button>

          <LabForm
            show={showLabForm}
            onClose={() => setShowLabForm(false)}
            onSave={addOrUpdateLab}
            labName={newLabName}
            setLabName={setNewLabName}
            labLocation={newLabLocation}
            setLabLocation={setNewLabLocation}
            editing={editingLabId}
          />

          <table className="table table-bordered table-hover shadow-sm">
            <thead className="table-light">
              <tr>
                <th>Lab Name</th>
                <th>Location</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filterLabs.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center text-muted">
                    No labs found.
                  </td>
                </tr>
              ) : (
                filterLabs.map((lab) => (
                  <tr key={lab.id} {...getRowHover("labs")}>
                    <td>{lab.name}</td>
                    <td>{lab.location}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-light me-2"
                        {...getBtnHover("secondary")}
                        onClick={() => {
                          setNewLabName(lab.name);
                          setNewLabLocation(lab.location);
                          setEditingLabId(lab.id);
                          setShowLabForm(true);
                        }}
                      >
                        <FaEdit />
                      </button>
                      <button className="btn btn-sm btn-danger" {...getBtnHover("warning")} onClick={() => deleteLab(lab.id)}>
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Computers Tab */}
        <div className="tab-pane fade" id="computers" role="tabpanel">
          <button className="btn btn-success mb-3" {...getBtnHover("success")} onClick={() => setShowComputerForm(!showComputerForm)}>
            <FaLaptop className="me-2" /> Add Computer
          </button>

          <ItemForm
            show={showComputerForm}
            onClose={() => setShowComputerForm(false)}
            onSave={() => {}}
            name={newComputerName}
            setName={setNewComputerName}
            spec={newComputerSpec}
            setSpec={setNewComputerSpec}
            assignedLab={assignedLabForComputer}
            setAssignedLab={setAssignedLabForComputer}
            labs={labs}
            editing={editingComputerId}
            title="Computer"
            btnColor="success"
          />

          <table className="table table-bordered table-hover shadow-sm">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Specification</th>
                <th>Assigned Lab</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {computers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    No computers found.
                  </td>
                </tr>
              ) : (
                computers.map((c) => (
                  <tr key={c.id} {...getRowHover("computers")}>
                    <td>{c.name}</td>
                    <td>{c.spec}</td>
                    <td>{c.lab}</td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-light me-2" {...getBtnHover("secondary")}>
                        <FaEdit />
                      </button>
                      <button className="btn btn-sm btn-danger" {...getBtnHover("warning")}>
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Accessories Tab */}
        <div className="tab-pane fade" id="accessories" role="tabpanel">
          <button className="btn btn-warning mb-3" {...getBtnHover("warning")} onClick={() => setShowAccessoryForm(!showAccessoryForm)}>
            <FaPlug className="me-2" /> Add Accessory
          </button>

          <ItemForm
            show={showAccessoryForm}
            onClose={() => setShowAccessoryForm(false)}
            onSave={() => {}}
            name={newAccessoryName}
            setName={setNewAccessoryName}
            spec={newAccessorySpec}
            setSpec={setNewAccessorySpec}
            assignedLab={assignedLabForAccessory}
            setAssignedLab={setAssignedLabForAccessory}
            labs={labs}
            editing={editingAccessoryId}
            title="Accessory"
            btnColor="warning"
          />

          <table className="table table-bordered table-hover shadow-sm">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Specification</th>
                <th>Assigned Lab</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {accessories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    No accessories found.
                  </td>
                </tr>
              ) : (
                accessories.map((a) => (
                  <tr key={a.id} {...getRowHover("accessories")}>
                    <td>{a.name}</td>
                    <td>{a.spec}</td>
                    <td>{a.lab}</td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-light me-2" {...getBtnHover("secondary")}>
                        <FaEdit />
                      </button>
                      <button className="btn btn-sm btn-danger" {...getBtnHover("warning")}>
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
