import React, { useState } from 'react';
import { FaLaptop, FaPlug, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function LabInventoryDashboard() {
  const [labs, setLabs] = useState([
    {
      id: 'lab-1',
      name: 'Computer Lab A',
      location: 'Building 1',
      items: [
        { id: 'item-1', name: 'PC-01', type: 'Computer', spec: 'Intel i5, 8GB RAM' },
        { id: 'item-2', name: 'Projector', type: 'Accessory', spec: 'Full HD' },
      ],
    },
    {
      id: 'lab-2',
      name: 'Computer Lab B',
      location: 'Building 2',
      items: [
        { id: 'item-3', name: 'PC-02', type: 'Computer', spec: 'Intel i7, 16GB RAM' },
        { id: 'item-4', name: 'Printer', type: 'Accessory', spec: 'LaserJet' },
      ],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingLabId, setEditingLabId] = useState(null);
  const [itemName, setItemName] = useState('');
  const [itemSpec, setItemSpec] = useState('');
  const [itemType, setItemType] = useState('Computer');

  // ----- CRUD -----
  const saveItem = () => {
    if (!itemName.trim() || !itemSpec.trim()) return;

    if (editingItem) {
      setLabs(labs.map(lab => {
        if (lab.id === editingLabId) {
          return {
            ...lab,
            items: lab.items.map(i =>
              i.id === editingItem.id ? { ...i, name: itemName, spec: itemSpec, type: itemType } : i
            )
          };
        }
        return lab;
      }));
    } else {
      const newItem = { id: `item-${Date.now()}`, name: itemName, type: itemType, spec: itemSpec };
      setLabs(labs.map(lab => {
        if (lab.id === editingLabId) {
          return { ...lab, items: [...lab.items, newItem] };
        }
        return lab;
      }));
    }

    setModalOpen(false);
    setEditingItem(null);
    setItemName('');
    setItemSpec('');
    setItemType('Computer');
  };

  const deleteItem = (labId, itemId) => {
    setLabs(labs.map(lab => {
      if (lab.id === labId) {
        return { ...lab, items: lab.items.filter(i => i.id !== itemId) };
      }
      return lab;
    }));
  };

  const openModal = (labId, item = null) => {
    setEditingLabId(labId);
    setEditingItem(item);
    if (item) {
      setItemName(item.name);
      setItemSpec(item.spec);
      setItemType(item.type);
    }
    setModalOpen(true);
  };

  // ----- Drag and Drop -----
  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceLab = labs.find(l => l.id === source.droppableId);
    const destLab = labs.find(l => l.id === destination.droppableId);
    const [movedItem] = sourceLab.items.splice(source.index, 1);

    if (sourceLab.id === destLab.id) {
      sourceLab.items.splice(destination.index, 0, movedItem);
      setLabs([...labs]);
    } else {
      destLab.items.splice(destination.index, 0, movedItem);
      setLabs(labs.map(lab => lab.id === sourceLab.id ? sourceLab : lab.id === destLab.id ? destLab : lab));
    }
  };

  const filteredLabs = labs.map(lab => ({
    ...lab,
    items: lab.items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }));

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center fw-bold">Lab Inventory Dashboard</h2>

      {/* Search */}
      <div className="input-group mb-4 shadow-sm">
        <input
          type="text"
          className="form-control"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        {filteredLabs.map(lab => (
          <div key={lab.id} className="mb-4 shadow-sm border rounded p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5>{lab.name} — <small>{lab.location}</small></h5>
              <button className="btn btn-success btn-sm" onClick={() => openModal(lab.id)}><FaPlus /> Add Item</button>
            </div>

            <Droppable droppableId={lab.id}>
              {(provided) => (
                <table className="table table-striped table-hover mb-0" ref={provided.innerRef} {...provided.droppableProps}>
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>Type</th>
                      <th>Specification</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lab.items.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <tr ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <td>{item.name}</td>
                            <td>
                              <span className={`badge ${item.type === 'Computer' ? 'bg-primary' : 'bg-warning text-dark'}`}>
                                {item.type}
                              </span>
                            </td>
                            <td>{item.spec}</td>
                            <td className="d-flex gap-1">
                              <button className="btn btn-sm btn-primary" onClick={() => openModal(lab.id, item)}><FaEdit /></button>
                              <button className="btn btn-sm btn-danger" onClick={() => deleteItem(lab.id, item.id)}><FaTrash /></button>
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {lab.items.length === 0 && <tr><td colSpan="4" className="text-center text-muted">No items</td></tr>}
                  </tbody>
                </table>
              )}
            </Droppable>
          </div>
        ))}
      </DragDropContext>

      {/* Item Modal */}
      {modalOpen && (
        <div className="modal show d-block modal-overlay">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow">
              <div className="modal-header">
                <h5 className="modal-title">{editingItem ? 'Edit Item' : 'Add Item'}</h5>
                <button type="button" className="btn-close" onClick={() => setModalOpen(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Item Name</label>
                  <input type="text" className="form-control" value={itemName} onChange={(e) => setItemName(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Specification</label>
                  <input type="text" className="form-control" value={itemSpec} onChange={(e) => setItemSpec(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Type</label>
                  <select className="form-select" value={itemType} onChange={(e) => setItemType(e.target.value)}>
                    <option value="Computer">Computer</option>
                    <option value="Accessory">Accessory</option>
                  </select>
                </div>
                <button className="btn btn-primary w-100" onClick={saveItem}>{editingItem ? 'Update Item' : 'Add Item'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
