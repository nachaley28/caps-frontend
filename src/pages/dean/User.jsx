import React, { useState, useEffect } from "react";
import { Tab, Nav, Card, Row, Col, Container, Button, Modal, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import AddUserModal from "./AddUserModal";
import "./dean.css";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [preview, setPreview] = useState(null);

  // ✅ Fetch users
  useEffect(() => {
    fetch("http://127.0.0.1:5000/get_users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error(err));
  }, []);

  // ✅ Handle Edit click
  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData(user);
    setPreview(user.profile || "default.png");
    setShowEdit(true);
  };

  // ✅ Handle Delete click
  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDelete(true);
  };

  const handleCloseEdit = () => setShowEdit(false);
  const handleCloseDelete = () => setShowDelete(false);

  // ✅ Update user (with profile picture)
  const handleUpdate = async () => {
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    const response = await fetch(`http://localhost:5000/users/${selectedUser.lgid}`, {
      method: "PUT",
      body: formDataToSend,
    });

    const result = await response.json();
    console.log(result);
    setShowEdit(false);
    window.location.reload();
  };

  // ❌ Delete user
  const confirmDelete = async () => {
    const response = await fetch(`http://localhost:5000/users/${selectedUser.lgid}`, {
      method: "DELETE",
    });
    const result = await response.json();
    console.log(result);
    setShowDelete(false);
    window.location.reload();
  };

  // ✅ Handle profile picture change
  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profile: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const renderCards = (filterRole = null) => {
    const filteredUsers = filterRole ? users.filter((u) => u.role === filterRole) : users;

    return (
      <>
        <Row className="g-4">
          {filteredUsers.map((user) => (
            <Col md={6} lg={4} xl={3} key={user.lgid}>
              <Card className="user-card shadow-sm border-0 rounded-4 h-100">
                <div className="card-img-top-container bg-success-subtle rounded-top-4">
                  <Card.Img
                    variant="top"
                    src={user.profile || "default.png"}
                    className="user-profile-img"
                    style={{ height: "200px", width: "100%", objectFit: "cover" }}
                  />
                </div>
                <Card.Body className="p-3 d-flex flex-column justify-content-between">
                  <div>
                    <Card.Title className="fw-semibold text-success">{user.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted small">
                      {user.position || "Not specified"}
                    </Card.Subtitle>
                    <Card.Text className="small text-secondary mb-1">
                      <strong>ID:</strong> {user.lgid}
                    </Card.Text>
                    <Card.Text className="small text-secondary mb-1">
                      <strong>Email:</strong> {user.email}
                    </Card.Text>
                    <Card.Text className="small text-secondary mb-1">
                      <strong>Role:</strong> {user.role}
                    </Card.Text>
                    <Card.Text className="small text-secondary mb-1">
                      <strong>Department:</strong> {user.department}
                    </Card.Text>
                    <Card.Text className="small text-secondary">
                      <strong>Year:</strong> {user.year || "Not specified"}
                    </Card.Text>
                  </div>

                  <div className="d-flex justify-content-between mt-3">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(user)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* ✏️ Edit Modal */}
        <Modal show={showEdit} onHide={handleCloseEdit} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <div className="text-center mb-3">
                <img
                  src={preview || "default.png"}
                  alt="Profile Preview"
                  className="rounded-circle shadow-sm"
                  style={{ width: "120px", height: "120px", objectFit: "cover" }}
                />
                <Form.Group controlId="formFile" className="mt-3">
                  <Form.Control type="file" accept="image/*" onChange={handleProfileChange} />
                </Form.Group>
              </div>

              <Form.Group className="mb-2">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Role</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.role || ""}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Department</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.department || ""}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Position</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.position || ""}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEdit}>
              Cancel
            </Button>
            <Button variant="success" onClick={handleUpdate}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        {/* ❌ Delete Confirmation Modal */}
        <Modal show={showDelete} onHide={handleCloseDelete} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete <strong>{selectedUser?.name}</strong>?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDelete}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Yes, Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-center align-items-center flex-column mb-4">
        <h3 className="fw-bold text-success mb-3">User Management</h3>
        <button
          className="btn btn-success btn-sm px-3 py-2 rounded-pill shadow-sm"
          onClick={() => setShowModal(true)}
        >
          + Add User
        </button>
      </div>

      <AddUserModal show={showModal} onClose={() => setShowModal(false)} />

      <Tab.Container defaultActiveKey="all">
        <Nav variant="tabs" className="justify-content-center mb-4 custom-tabs">
          <Nav.Item>
            <Nav.Link eventKey="all" className="px-4 py-2 fw-semibold">All Users</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="Admin" className="px-4 py-2 fw-semibold">Admin</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="Dean" className="px-4 py-2 fw-semibold">Dean</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="ITSD" className="px-4 py-2 fw-semibold">ITSD</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="all">{renderCards()}</Tab.Pane>
          <Tab.Pane eventKey="Admin">{renderCards("Admin")}</Tab.Pane>
          <Tab.Pane eventKey="Dean">{renderCards("Dean")}</Tab.Pane>
          <Tab.Pane eventKey="ITSD">{renderCards("ITSD")}</Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
}
