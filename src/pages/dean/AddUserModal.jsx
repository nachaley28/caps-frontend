import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AddUserModal.css"; // 👈 create this CSS file (see below)

function AddUserModal({ show, onClose }) {
  const [formData, setFormData] = useState({
    lgid: "",
    name: "",
    email: "",
    role: "",
    year: "",
    password: "",
    department: "",
    position: "",
  });

  const [imagePreview, setImagePreview] = useState("/img/default.png");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const adduserhandleSubmit = async e => {
    e.preventDefault();

    let imageUrl = "";

    // Upload profile image (optional)

    // Register user
    const res = await fetch("http://127.0.0.1:5000/register_user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, profile: imageUrl }),
    });

    const result = await res.json();
    if (result.success) {
      alert("User registered successfully!");
      onClose();
      window.location.reload();
    } else {
      alert(result.message || "Registration failed!");
    }
  };

  return (
    <>
      <div className={`modal fade ${show ? "show d-block visible" : ""}`} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content rounded-4 shadow">
            <div className="modal-header bg-success text-white">
              <h5 className="modal-title">Register New User</h5>
              <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
            </div>

            <div className="modal-body">
              <form onSubmit={adduserhandleSubmit}>
                <div className="row g-3">
                  {/* Profile Image */}
                  
                  {/* Form Fields */}
                  <div className="col-md-8">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <FormField label="LGID" name="lgid" value={formData.lgid} onChange={handleChange} />
                      </div>
                      <div className="col-md-6">
                        <FormField label="Name" name="name" value={formData.name} onChange={handleChange} />
                      </div>
                      <div className="col-md-6">
                        <FormField label="Email" name="email" value={formData.email} onChange={handleChange} type="email" />
                      </div>
                      <div className="col-md-6">
                        <FormField label="Password" name="password" value={formData.password} onChange={handleChange} type="password" />
                      </div>
                      <div className="col-md-6">
                        <FormField label="Department" name="department" value={formData.department} onChange={handleChange} />
                      </div>
                      <div className="col-md-6">
                        <FormField label="Position" name="position" value={formData.position} onChange={handleChange} />
                      </div>
                      <div className="col-md-6">
                        <FormField label="Role" name="role" value={formData.role} onChange={handleChange} />
                      </div>
                      <div className="col-md-6">
                        <FormField label="Year" name="year" value={formData.year} onChange={handleChange} />
                      </div>
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-success w-100 mt-4">
                  Register User
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Backdrop */}
      {show && <div className="modal-backdrop fade show custom-backdrop" onClick={onClose}></div>}
    </>
  );
}

const FormField = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label className="form-label fw-bold text-success">{label}</label>
    <input
      type={type}
      className="form-control"
      name={name}
      value={value}
      onChange={onChange}
      required
      style={{ borderRadius: "0.5rem", padding: "0.6rem" }}
    />
  </div>
);

export default AddUserModal;
