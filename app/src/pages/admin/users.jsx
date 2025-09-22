import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaUserPlus, FaEye } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./users.css";

export default function UsersRoles() {
  const [users, setUsers] = useState([]);
  const [roles] = useState([
    "Admin",
    "Lab Assistant",
    "Faculty",
    "Guest",
    "Lab Adviser",
  ]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/get_users");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();

        const transformed = data.map((u) => ({
          name: u.name?.trim(),
          email: u.email,
          role: u.role?.trim(),
        }));

        setUsers(transformed);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  const handleAddUser = () => {
    setSelectedUser({ name: "", email: "", role: "" });
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

  const handleDeleteUser = async (user) => {
  if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
    try {
      const res = await fetch(`http://localhost:5000/delete_user/${encodeURIComponent(user.email)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete user");
      setUsers(users.filter((u) => u.email !== user.email));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  }
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
    return matchesSearch && matchesRole;
  });

  return (
    <div className="container mt-4 ">
     
      <h2 className="fw text-primary" style={{ textAlign: "center" }}>
        Users & Roles</h2>
     <div className="d-flex justify-content-end mb-3">
  <button className="btn btn-success shadow-sm" onClick={handleAddUser}>
    <FaUserPlus /> Add User
  </button>
</div>
      <div className="row mb-3 g-2">
        <div className="col-md-6">
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
      </div>

      <div className="table-responsive shadow-sm rounded">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-3">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, idx) => (
                <tr key={idx}>
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
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
