import React, { useState, useEffect } from "react";
import { Tab, Nav, Card, Row, Col, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import AddUserModal from "./AddUserModal";
import "./dean.css"; 

export default function Users() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error(err));
  }, []);

  const renderCards = (filterRole = null) => {
    const filteredUsers = filterRole ? users.filter((u) => u.role === filterRole) : users;

    return (
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
              <Card.Body className="p-3">
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
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
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
