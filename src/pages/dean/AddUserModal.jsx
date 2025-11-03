import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function AddUserModal({ show, onClose }) {
  const [formData, setFormData] = useState({
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
            <div className="modal-header bg-success text-white position-relative">
              <h5 className="modal-title">Register New User</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
                style={{
                  position: "absolute",
                  top: "15px",
                  right: "15px",
                  filter: "invert(0)", // makes 'X' icon black
                  opacity: 1,
                }}
              ></button>
            </div>

            <div className="modal-body">
              <form onSubmit={adduserhandleSubmit}>
                <div className="row g-4">
                  <div className="col-md-4 text-center">
                    <img
                      src={imagePreview}
                      alt="Profile Preview"
                      className="img-thumbnail rounded-circle mb-3"
                      style={{ width: "150px", height: "150px", objectFit: "cover" }}
                    />
                    <input type="file" className="form-control" onChange={handleFileChange} />
                  </div>

                  <div className="col-md-8">
                    <div className="row g-3">
                      {["name", "email", "password", "department", "position", "role", "year"].map(field => (
                        <div className="col-md-6" key={field}>
                          <FormField
                            label={field.charAt(0).toUpperCase() + field.slice(1)}
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            type={field === "password" ? "password" : field === "email" ? "email" : "text"}
                          />
                        </div>
                      ))}
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

      {show && <div className="modal-backdrop fade show custom-backdrop" onClick={onClose}></div>}
    </>
  );
}

const FormField = ({ label, name, value, onChange, type }) => (
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
