import React, { useState } from 'react';
import { FaPlus, FaLaptop, FaDesktop, FaPlug, FaEdit, FaTrash, FaSearch, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

// ----- Lab Form Component -----
function LabForm({ show, onClose, onSave, labName, setLabName, labLocation, setLabLocation, editing }) {
  if (!show) return null;
  return (
    <div className="card shadow-sm p-3 mb-3 border-0">
      <h5 className="card-title">{editing ? 'Edit Lab' : 'Add New Lab'}</h5>
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
        <button className="btn btn-primary w-100" onClick={onSave}>
          {editing ? 'Update Lab' : 'Save Lab'}
        </button>
        <button className="btn btn-secondary w-100" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

// ----- Computer / Accessory Form Component -----
function ItemForm({ show, onClose, onSave, name, setName, spec, setSpec, assignedLab, setAssignedLab, labs, editing, title, btnColor }) {
  if (!show) return null;
  return (
    <div className={`card shadow-sm p-3 mb-3 border-0`}>
      <h5 className="card-title">{editing ? `Edit ${title}` : `Add ${title}`}</h5>
      <input
        type="text"
        className="form-control mb-2"
        placeholder={`${title} Name/Unit`}
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
      <select className="form-select mb-3" value={assignedLab} onChange={(e) => setAssignedLab(e.target.value)}>
        <option value="">Assign to Lab</option>
        {labs.map(l => <option key={l.id} value={`${l.name} (${l.location})`}>{l.name} — {l.location}</option>)}
      </select>
      <div className="d-flex gap-2">
        <button className={`btn btn-${btnColor} w-100`} onClick={onSave}>{editing ? `Update ${title}` : `Save ${title}`}</button>
        <button className="btn btn-secondary w-100" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

// ----- Main Component -----
export default function AdminComputers() {
  // --- Dummy Data ---
  const initialLabs = [
    { id: 1, name: 'Computer Lab A', location: 'Building 1' },
    { id: 2, name: 'Computer Lab B', location: 'Building 2' }
  ];
  const initialComputers = [
    { id: 1, name: 'PC-01', spec: 'Intel i5, 8GB RAM', lab: 'Computer Lab A (Building 1)' },
    { id: 2, name: 'PC-02', spec: 'Intel i7, 16GB RAM', lab: 'Computer Lab A (Building 1)' },
    { id: 3, name: 'PC-03', spec: 'Intel i5, 8GB RAM', lab: 'Computer Lab B (Building 2)' }
  ];
  const initialAccessories = [
    { id: 1, name: 'Projector', spec: 'Full HD', lab: 'Computer Lab A (Building 1)' },
    { id: 2, name: 'Printer', spec: 'LaserJet', lab: 'Computer Lab B (Building 2)' }
  ];

  // --- State ---
  const [labs, setLabs] = useState(initialLabs);
  const [computers, setComputers] = useState(initialComputers);
  const [accessories, setAccessories] = useState(initialAccessories);
  const [searchTerm, setSearchTerm] = useState('');

  // Form toggles
  const [showLabForm, setShowLabForm] = useState(false);
  const [showComputerForm, setShowComputerForm] = useState(false);
  const [showAccessoryForm, setShowAccessoryForm] = useState(false);

  // Lab form states
  const [newLabName, setNewLabName] = useState('');
  const [newLabLocation, setNewLabLocation] = useState('');
  const [editingLabId, setEditingLabId] = useState(null);

  // Computer form states
  const [newComputerName, setNewComputerName] = useState('');
  const [newComputerSpec, setNewComputerSpec] = useState('');
  const [assignedLabForComputer, setAssignedLabForComputer] = useState('');
  const [editingComputerId, setEditingComputerId] = useState(null);

  // Accessory form states
  const [newAccessoryName, setNewAccessoryName] = useState('');
  const [newAccessorySpec, setNewAccessorySpec] = useState('');
  const [assignedLabForAccessory, setAssignedLabForAccessory] = useState('');
  const [editingAccessoryId, setEditingAccessoryId] = useState(null);

  // Collapse toggles per lab
  const [collapsedLabs, setCollapsedLabs] = useState({});

  const toggleCollapse = (labId) => {
    setCollapsedLabs({ ...collapsedLabs, [labId]: !collapsedLabs[labId] });
  };

  // ----- CRUD Operations -----
  const addOrUpdateLab = () => {
    if (!newLabName.trim() || !newLabLocation.trim()) return;
    if (editingLabId) {
      const oldLab = labs.find(l => l.id === editingLabId);
      setLabs(labs.map(l => l.id === editingLabId ? { ...l, name: newLabName, location: newLabLocation } : l));
      setComputers(computers.map(c => c.lab === `${oldLab.name} (${oldLab.location})` ? { ...c, lab: `${newLabName} (${newLabLocation})` } : c));
      setAccessories(accessories.map(a => a.lab === `${oldLab.name} (${oldLab.location})` ? { ...a, lab: `${newLabName} (${newLabLocation})` } : a));
      setEditingLabId(null);
    } else {
      setLabs([...labs, { id: Date.now(), name: newLabName, location: newLabLocation }]);
    }
    setNewLabName('');
    setNewLabLocation('');
    setShowLabForm(false);
  };

  const editLab = (lab) => {
    setNewLabName(lab.name);
    setNewLabLocation(lab.location);
    setEditingLabId(lab.id);
    setShowLabForm(true);
  };

  const deleteLab = (labId) => {
    const lab = labs.find(l => l.id === labId);
    setLabs(labs.filter(l => l.id !== labId));
    setComputers(computers.filter(c => c.lab !== `${lab.name} (${lab.location})`));
    setAccessories(accessories.filter(a => a.lab !== `${lab.name} (${lab.location})`));
  };

  const addOrUpdateComputer = () => {
    if (!newComputerName.trim() || !newComputerSpec.trim() || !assignedLabForComputer) return;
    if (editingComputerId) {
      setComputers(computers.map(c => c.id === editingComputerId ? { ...c, name: newComputerName, spec: newComputerSpec, lab: assignedLabForComputer } : c));
      setEditingComputerId(null);
    } else {
      setComputers([...computers, { id: Date.now(), name: newComputerName, spec: newComputerSpec, lab: assignedLabForComputer }]);
    }
    setNewComputerName('');
    setNewComputerSpec('');
    setAssignedLabForComputer('');
    setShowComputerForm(false);
  };

  const editComputer = (comp) => {
    setNewComputerName(comp.name);
    setNewComputerSpec(comp.spec);
    setAssignedLabForComputer(comp.lab);
    setEditingComputerId(comp.id);
    setShowComputerForm(true);
  };

  const deleteComputer = (compId) => setComputers(computers.filter(c => c.id !== compId));

  const addOrUpdateAccessory = () => {
    if (!newAccessoryName.trim() || !newAccessorySpec.trim() || !assignedLabForAccessory) return;
    if (editingAccessoryId) {
      setAccessories(accessories.map(a => a.id === editingAccessoryId ? { ...a, name: newAccessoryName, spec: newAccessorySpec, lab: assignedLabForAccessory } : a));
      setEditingAccessoryId(null);
    } else {
      setAccessories([...accessories, { id: Date.now(), name: newAccessoryName, spec: newAccessorySpec, lab: assignedLabForAccessory }]);
    }
    setNewAccessoryName('');
    setNewAccessorySpec('');
    setAssignedLabForAccessory('');
    setShowAccessoryForm(false);
  };

  const editAccessory = (acc) => {
    setNewAccessoryName(acc.name);
    setNewAccessorySpec(acc.spec);
    setAssignedLabForAccessory(acc.lab);
    setEditingAccessoryId(acc.id);
    setShowAccessoryForm(true);
  };

  const deleteAccessory = (accId) => setAccessories(accessories.filter(a => a.id !== accId));

  // ----- Filtered Labs -----
  const filterLabs = labs.filter(lab =>
    lab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lab.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ----- Render -----
  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center fw-bold">Computer Labs Management</h2>

      {/* Search */}
      <div className="input-group mb-4 shadow-sm">
        <span className="input-group-text bg-white"><FaSearch /></span>
        <input
          type="text"
          className="form-control"
          placeholder="Search labs, computers, accessories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Forms Row */}
      <div className="row mb-4 g-3">
        <div className="col-md-4">
          <button className="btn btn-primary w-100 shadow-sm" onClick={() => { setShowLabForm(!showLabForm); if (!showLabForm) { setNewLabName(''); setNewLabLocation(''); setEditingLabId(null); } }}>
            <FaDesktop className="me-2" /> {editingLabId ? 'Edit Lab' : 'Add New Lab'}
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
        </div>

        <div className="col-md-4">
          <button className="btn btn-success w-100 shadow-sm" onClick={() => { setShowComputerForm(!showComputerForm); if (!showComputerForm) { setNewComputerName(''); setNewComputerSpec(''); setAssignedLabForComputer(''); setEditingComputerId(null); } }}>
            <FaLaptop className="me-2" /> {editingComputerId ? 'Edit Computer' : 'Add New Computer'}
          </button>
          <ItemForm
            show={showComputerForm}
            onClose={() => setShowComputerForm(false)}
            onSave={addOrUpdateComputer}
            name={newComputerName} setName={setNewComputerName}
            spec={newComputerSpec} setSpec={setNewComputerSpec}
            assignedLab={assignedLabForComputer} setAssignedLab={setAssignedLabForComputer}
            labs={labs}
            editing={editingComputerId}
            title="Computer"
            btnColor="success"
          />
        </div>

        <div className="col-md-4">
          <button className="btn btn-warning w-100 shadow-sm" onClick={() => { setShowAccessoryForm(!showAccessoryForm); if (!showAccessoryForm) { setNewAccessoryName(''); setNewAccessorySpec(''); setAssignedLabForAccessory(''); setEditingAccessoryId(null); } }}>
            <FaPlug className="me-2" /> {editingAccessoryId ? 'Edit Accessory' : 'Add Accessory/Equipment'}
          </button>
          <ItemForm
            show={showAccessoryForm}
            onClose={() => setShowAccessoryForm(false)}
            onSave={addOrUpdateAccessory}
            name={newAccessoryName} setName={setNewAccessoryName}
            spec={newAccessorySpec} setSpec={setNewAccessorySpec}
            assignedLab={assignedLabForAccessory} setAssignedLab={setAssignedLabForAccessory}
            labs={labs}
            editing={editingAccessoryId}
            title="Accessory"
            btnColor="warning"
          />
        </div>
      </div>

      {/* Labs Overview */}
      <div className="row">
        <div className="col-12">
          <h4 className="fw-bold mb-3">Labs Overview</h4>
          {filterLabs.length === 0 && <p className="text-muted">No labs match your search.</p>}
          {filterLabs.map(lab => {
            const labComputers = computers.filter(c => c.lab === `${lab.name} (${lab.location})` && c.name.toLowerCase().includes(searchTerm.toLowerCase()));
            const labAccessories = accessories.filter(a => a.lab === `${lab.name} (${lab.location})` && a.name.toLowerCase().includes(searchTerm.toLowerCase()));
            const collapsed = collapsedLabs[lab.id];

            return (
              <div key={lab.id} className="card mb-3 shadow-sm">
                <div className="card-header d-flex justify-content-between align-items-center bg-info text-white rounded-top">
                  <div className="fw-bold"><FaDesktop className="me-2" /> {lab.name} — <small>{lab.location}</small></div>
                  <div className="d-flex gap-1">
                    <button className="btn btn-light btn-sm" onClick={() => editLab(lab)}><FaEdit /></button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteLab(lab.id)}><FaTrash /></button>
                    <button className="btn btn-light btn-sm" onClick={() => toggleCollapse(lab.id)}>
                      {collapsed ? <FaChevronDown /> : <FaChevronUp />}
                    </button>
                  </div>
                </div>
                {!collapsed && (
                  <div className="card-body">
                    {/* Computers */}
                    <h6 className="fw-bold">Computers</h6>
                    {labComputers.length === 0 ? <p className="text-muted"><small>No computers match search.</small></p> :
                      <ul className="list-group mb-3 shadow-sm">
                        {labComputers.map(comp => (
                          <li key={comp.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>{comp.name} — <small>{comp.spec}</small></div>
                            <div className="d-flex gap-1">
                              <button className="btn btn-light btn-sm" onClick={() => editComputer(comp)}><FaEdit /></button>
                              <button className="btn btn-danger btn-sm" onClick={() => deleteComputer(comp.id)}><FaTrash /></button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    }

                    {/* Accessories */}
                    <h6 className="fw-bold">Accessories/Equipment</h6>
                    {labAccessories.length === 0 ? <p className="text-muted"><small>No accessories match search.</small></p> :
                      <ul className="list-group shadow-sm">
                        {labAccessories.map(acc => (
                          <li key={acc.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>{acc.name} — <small>{acc.spec}</small></div>
                            <div className="d-flex gap-1">
                              <button className="btn btn-light btn-sm" onClick={() => editAccessory(acc)}><FaEdit /></button>
                              <button className="btn btn-danger btn-sm" onClick={() => deleteAccessory(acc.id)}><FaTrash /></button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    }
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
