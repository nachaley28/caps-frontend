import React, { useState, useEffect } from "react";
import {
  Tab,
  Nav,
  Card,
  Row,
  Col,
  Container,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
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

  // Fetch users from backend
  useEffect(() => {
    fetch("http://127.0.0.1:5000/get_users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error(err));
  }, []);

  // Edit user button click
  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData(user);
    setPreview(
      user.profile
        ? `http://localhost:5000/uploads/${user.profile}`
        : "/default.png"
    );
    setShowEdit(true);
  };

  // Delete user button click
  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDelete(true);
  };

  const handleCloseEdit = () => setShowEdit(false);
  const handleCloseDelete = () => setShowDelete(false);

  // Handle profile image change
  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profile: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  // Update user
  const handleUpdate = async () => {
    if (!selectedUser) return;

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    const response = await fetch(
      `http://localhost:5000/users/${selectedUser.lgid}`,
      {
        method: "PUT",
        body: formDataToSend,
      }
    );

    const result = await response.json();
    console.log(result);
    setShowEdit(false);
    window.location.reload();
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!selectedUser) return;

    const response = await fetch(
      `http://localhost:5000/users/${selectedUser.lgid}`,
      { method: "DELETE" }
    );

    const result = await response.json();
    console.log(result);
    setShowDelete(false);
    window.location.reload();
  };

  // Render user cards
  const renderCards = (filterRole = null) => {
    const filteredUsers = filterRole
      ? users.filter((u) => u.role === filterRole)
      : users;

    return (
      <Row className="g-3">
        {filteredUsers.map((user) => {
          const imageSrc = user.profile
            ? `http://localhost:5000/uploads/${user.profile}`
            : "/default.png";

          return (
            <Col md={6} lg={4} xl={3} key={user.lgid}>
              <Card className="shadow-sm border-0 rounded-3 h-100 text-center">
                <Card.Body className="p-3">
                  <img
                    src={imageSrc}
                    alt="User"
                    className="rounded-circle border"
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      marginBottom: "10px",
                    }}
                  />

                  <Card.Title
                    className="fw-bold mb-1"
                    style={{ fontSize: "1rem" }}
                  >
                    {user.name}
                  </Card.Title>
                  <Card.Text className="text-muted small mb-2">
                    {user.role || ""}
                  </Card.Text>

                  <div className="small mb-3 text-start px-3">
                    <div>
                      <strong>ID:</strong> {user.lgid}
                    </div>
                    <div>
                      <strong>Email:</strong> {user.email}
                    </div>
                    <div>
                      <strong>Dept:</strong> {user.department}
                    </div>
                    <div>
                      <strong>Position:</strong> {user.position || "—"}
                    </div>
                    <div>
                      <strong>Year:</strong> {user.year || "—"}
                    </div>
                  </div>

                  <div className="d-flex justify-content-center gap-2">
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
          );
        })}
      </Row>
    );
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-center align-items-center flex-column mb-4">
        <h3 className="fw-bold text-success mb-3">User Management</h3>
        <Button
          variant="success"
          size="sm"
          className="rounded-pill shadow-sm px-3 py-2"
          onClick={() => setShowModal(true)}
        >
          + Add User
        </Button>
      </div>

      <AddUserModal show={showModal} onClose={() => setShowModal(false)} />

      <Tab.Container defaultActiveKey="all">
        <Nav variant="tabs" className="justify-content-center mb-4">
          {["all", "Admin", "Dean", "ITSD"].map((role) => (
            <Nav.Item key={role}>
              <Nav.Link eventKey={role} className="px-4 py-2 fw-semibold">
                {role === "all" ? "All Users" : role}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="all">{renderCards()}</Tab.Pane>
          <Tab.Pane eventKey="Admin">{renderCards("Admin")}</Tab.Pane>
          <Tab.Pane eventKey="Dean">{renderCards("Dean")}</Tab.Pane>
          <Tab.Pane eventKey="ITSD">{renderCards("ITSD")}</Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      {/* Edit Modal (only one) */}
      <Modal show={showEdit} onHide={handleCloseEdit} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <Form>
              <div className="text-center mb-3">
                <img
                  src={preview || "/default.png"}
                  alt="Profile Preview"
                  className="rounded-circle shadow-sm"
                  style={{ width: "120px", height: "120px", objectFit: "cover" }}
                />
                <Form.Group controlId="formFile" className="mt-3">
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleProfileChange}
                  />
                </Form.Group>
              </div>

              <Form.Group className="mb-2">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Role</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.role || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Department</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.department || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Position</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.position || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
          )}
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

      {/* Delete Modal (only one) */}
      <Modal show={showDelete} onHide={handleCloseDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete{" "}
          <strong>{selectedUser?.lgid}</strong>?
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
    </Container>
  );
}
