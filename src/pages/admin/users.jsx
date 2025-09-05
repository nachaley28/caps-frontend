import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaUserPlus, FaCheck, FaTimes, FaEye } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

export default function UsersRoles() {
  const [users, setUsers] = useState([]);
  const [roles] = useState(["Admin", "Lab Assistant", "Faculty", "Guest"]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(""); // view | edit | add

  useEffect(() => {
    setUsers([
      { name: "John Doe", email: "john@example.com", role: "Admin", status: "Active", lastLogin: "2025-08-17 10:00" },
      { name: "Jane Smith", email: "jane@example.com", role: "Lab Assistant", status: "Inactive", lastLogin: "2025-08-15 09:30" },
      { name: "Mark Cruz", email: "mark@example.com", role: "Faculty", status: "Active", lastLogin: "2025-08-16 12:00" },
      { name: "Alice Brown", email: "alice@example.com", role: "Guest", status: "Active", lastLogin: "2025-08-14 14:45" },
    ]);
  }, []);

  const handleAddUser = () => {
    setSelectedUser({ name: "", email: "", role: "", status: "Active" });
    setModalType("add");
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalType("edit");
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setModalType("view");
  };

  const handleDeleteUser = (user) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((u) => u !== user));
    }
  };

  const handleToggleStatus = (user) => {
    const updatedUsers = users.map((u) => {
      if (u === user) u.status = u.status === "Active" ? "Inactive" : "Active";
      return u;
    });
    setUsers(updatedUsers);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (modalType === "add") {
      setUsers([...users, selectedUser]);
    }
    setModalType("");
    setSelectedUser(null);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === "All" || user.role === filterRole;
    const matchesStatus = filterStatus === "All" || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="container mt-4">
      <style>{`
        tbody tr { transition: all 0.25s ease-in-out; }
        tbody tr:hover { transform: scale(1.01); cursor: pointer; }

        /* Status hover glow */
        .row-active:hover { box-shadow: 0px 0px 14px rgba(25,135,84,0.8); }
        .row-inactive:hover { box-shadow: 0px 0px 14px rgba(220,53,69,0.8); }

        /* Role-based row colors */
        .role-admin { background-color: #f8d7da !important; }
        .role-admin:hover { box-shadow: 0px 0px 16px rgba(220,53,69,0.9); }

        .role-lab-assistant { background-color: #d1e7dd !important; }
        .role-lab-assistant:hover { box-shadow: 0px 0px 16px rgba(25,135,84,0.9); }

        .role-faculty { background-color: #cfe2ff !important; }
        .role-faculty:hover { box-shadow: 0px 0px 16px rgba(13,110,253,0.9); }

        .role-guest { background-color: #e2e3e5 !important; }
        .role-guest:hover { box-shadow: 0px 0px 16px rgba(108,117,125,0.9); }

        /* Modal overlay */
        .modal-overlay {
          background: rgba(0,0,0,0.5);
          position: fixed;
          inset: 0;
          z-index: 1050;
        }
      `}</style>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold text-primary">Users & Roles </h2>
        <button className="btn btn-success shadow-sm" onClick={handleAddUser}>
          <FaUserPlus /> Add User
        </button>
      </div>


      {/* Search & Filters */}
      <div className="row mb-3 g-2">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control shadow-sm"
            placeholder="🔍 Search by name/email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select shadow-sm"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="All">All Roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <select
            className="form-select shadow-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* User Table */}
      <div className="table-responsive shadow-sm rounded">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-3">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, idx) => (
                <tr
                  key={idx}
                  className={`row-${user.status.toLowerCase()} role-${user.role
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span
                      className={`badge bg-${
                        user.role === "Admin"
                          ? "danger"
                          : user.role === "Lab Assistant"
                          ? "success"
                          : user.role === "Faculty"
                          ? "primary"
                          : "secondary"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge bg-${
                        user.status === "Active" ? "success" : "secondary"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td>{user.lastLogin}</td>
                  <td className="d-flex gap-1">
                    <button
                      className="btn btn-sm btn-primary"
                      title="View User"
                      onClick={() => handleViewUser(user)}
                    >
                      <FaEye />
                    </button>
                    <button
                      className="btn btn-sm btn-warning"
                      title="Edit User"
                      onClick={() => handleEditUser(user)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      title="Delete User"
                      onClick={() => handleDeleteUser(user)}
                    >
                      <FaTrash />
                    </button>
                    <button
                      className={`btn btn-sm ${
                        user.status === "Active"
                          ? "btn-secondary"
                          : "btn-success"
                      }`}
                      title={
                        user.status === "Active" ? "Deactivate" : "Activate"
                      }
                      onClick={() => handleToggleStatus(user)}
                    >
                      {user.status === "Active" ? <FaTimes /> : <FaCheck />}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalType && (
        <div className="modal show d-block modal-overlay">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalType === "view"
                    ? "View User"
                    : modalType === "edit"
                    ? "Edit User"
                    : "Add User"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalType("")}
                ></button>
              </div>
              <div className="modal-body">
                {modalType === "view" ? (
                  <div>
                    <p>
                      <strong>Name:</strong> {selectedUser.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedUser.email}
                    </p>
                    <p>
                      <strong>Role:</strong> {selectedUser.role}
                    </p>
                    <p>
                      <strong>Status:</strong> {selectedUser.status}
                    </p>
                    <p>
                      <strong>Last Login:</strong> {selectedUser.lastLogin}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedUser.name}
                        onChange={(e) =>
                          setSelectedUser({
                            ...selectedUser,
                            name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={selectedUser.email}
                        onChange={(e) =>
                          setSelectedUser({
                            ...selectedUser,
                            email: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Role</label>
                      <select
                        className="form-select"
                        value={selectedUser.role}
                        onChange={(e) =>
                          setSelectedUser({
                            ...selectedUser,
                            role: e.target.value,
                          })
                        }
                        required
                      >
                        <option value="">Select Role</option>
                        {roles.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        value={selectedUser.status}
                        onChange={(e) =>
                          setSelectedUser({
                            ...selectedUser,
                            status: e.target.value,
                          })
                        }
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <button type="submit" className="btn btn-primary">
                      {modalType === "edit" ? "Update" : "Add"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
