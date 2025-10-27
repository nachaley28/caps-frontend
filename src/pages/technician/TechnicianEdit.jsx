import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function TechnicianEdit() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    position: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [imagePreview, setImagePreview] = useState("/img/default.png");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/get_user", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setUser(data);
          setFormData(prev => ({
            ...prev,
            name: data.name || "",
            email: data.email || "",
            department: data.department || "",
            position: data.position || "",
          }));
          setImagePreview(data.image || "/img/default.png");
        }
      })
      .catch(err => console.error(err));
  }, []);

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

  const handleSubmit = async e => {
    e.preventDefault();
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }

    let imageUrl = user.image;

    if (selectedFile) {
      const imgData = new FormData();
      imgData.append("image", selectedFile);
      const imgRes = await fetch("http://127.0.0.1:5000/upload_profile_image", {
        method: "POST",
        credentials: "include",
        body: imgData,
      });
      const imgResult = await imgRes.json();
      if (imgResult.success) imageUrl = imgResult.image_url;
    }

    const res = await fetch("http://127.0.0.1:5000/update_profile", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, image: imageUrl }),
    });

    const result = await res.json();
    if (result.success) {
      alert("Profile updated successfully!");
      window.location.reload();
    } else {
      alert(result.message || "Update failed!");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center g-4">
        {/* Image Card */}
        <div className="col-12 col-md-4">
          <div className="card shadow-sm p-4 text-center h-100">
            <img
              src={imagePreview}
              alt="Profile"
              className="rounded-circle mb-3 mx-auto"
              style={{
                width: "180px",
                height: "180px",
                objectFit: "cover",
                cursor: "pointer",
                border: "3px solid #36A420",
              }}
              onClick={() => document.getElementById("profilePicInput").click()}
            />
            <input
              id="profilePicInput"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <p className="text-muted small">Click image to update</p>
          </div>
        </div>

        {/* Profile Info */}
        <div className="col-12 col-md-4">
          <div className="card shadow-sm p-4 h-100">
            <h4 className="text-center text-success mb-4">Profile Info</h4>
            <FormField label="Name" name="name" value={formData.name} onChange={handleChange} />
            <FormField label="Email" name="email" value={formData.email} onChange={handleChange} />
            <FormField label="Department" name="department" value={formData.department} onChange={handleChange} />
            <FormField label="Position" name="position" value={formData.position} onChange={handleChange} />
          </div>
        </div>

        {/* Change Password */}
        <div className="col-12 col-md-4">
          <div className="card shadow-sm p-4 h-100">
            <h4 className="text-center text-success mb-4">Change Password</h4>
            <FormField type="password" label="Current Password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} />
            <FormField type="password" label="New Password" name="newPassword" value={formData.newPassword} onChange={handleChange} />
            <FormField type="password" label="Confirm New Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
            <button className="btn btn-success w-100 mt-3" onClick={handleSubmit}>Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const FormField = ({ label, name, value, onChange, type = "text" }) => (
  <div className="mb-3">
    <label className="form-label text-success fw-bold">{label}</label>
    <input
      type={type}
      className="form-control"
      name={name}
      value={value}
      onChange={onChange}
      style={{ borderRadius: "0.5rem", padding: "0.6rem" }}
    />
  </div>
);

export default TechnicianEdit;
