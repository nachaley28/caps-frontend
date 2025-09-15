import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import {
  FaLaptop,
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaExclamationTriangle,
  FaQuestionCircle,
  FaFileAlt,
  FaCogs,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";
import "./dashboard.css";

const COLORS = {
  primary: "#4e79a7",
  secondary: "#f28e2b",
  success: "#59a14f",
  danger: "#e15759",
  info: "#9c6ade",
  warning: "#ff9d76",
  light: "#f5f6fa",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [topUsers, setTopUsers] = useState([]);
  const [labsComputers, setLabsComputers] = useState([]);
  const [damageMissing, setDamageMissing] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/get_data")
      .then((res) => res.json())
      .then((data) => {
        setStats(data.stats || {});
        setTopUsers(data.topUsers || []);
        setLabsComputers(data.labsComputers || []);
        setDamageMissing(data.damageMissingPerLab || []);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const summaryItems = [
    { title: "Total Labs", value: stats.totalLabs, icon: <FaLaptop size={30} />, color: COLORS.primary },
    { title: "Total Computers", value: stats.totalComputers, icon: <FaCogs size={30} />, color: COLORS.secondary },
    { title: "Operational", value: stats.operational, icon: <FaUserCheck size={30} />, color: COLORS.success },
    { title: "Not Operational", value: stats.notOperational, icon: <FaUserTimes size={30} />, color: COLORS.danger },
    { title: "Total Users", value: stats.totalUsers, icon: <FaUsers size={30} />, color: COLORS.primary },
    { title: "Reports Submitted", value: stats.reportsSubmitted, icon: <FaFileAlt size={30} />, color: COLORS.info },
    { title: "Damaged Equipments", value: stats.damaged, icon: <FaExclamationTriangle size={30} />, color: COLORS.warning },
    { title: "Missing Equipments", value: stats.missing, icon: <FaQuestionCircle size={30} />, color: COLORS.danger },
  ];

  return (
    <Container className="my-4">
      <h2 className="text-center dashboard-title">Admin Dashboard</h2>

      <Row className="mb-4 g-4">
        {summaryItems.map((item, idx) => (
          <Col xs={12} sm={6} md={3} key={idx}>
            <Card
              className="summary-card h-100 text-center shadow-sm"
              style={{ borderTop: `5px solid ${item.color}` }}
            >
              <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                <div className="mb-2" style={{ color: item.color }}>{item.icon}</div>
                <Card.Title>{item.title}</Card.Title>
                <div className="summary-value">{item.value}</div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-4">
        {/* Computer Status */}
        <Col xs={12} md={6}>
          <Card className="chart-card shadow-sm h-100">
            <Card.Body>
              <Card.Title className="text-center mb-3">Computer Status</Card.Title>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Operational", value: stats.operational },
                      { name: "Not Operational", value: stats.notOperational },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    <Cell fill={COLORS.success} />
                    <Cell fill={COLORS.danger} />
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        {/* Top Users (Reports) */}
        <Col xs={12} md={6}>
          <Card className="chart-card shadow-sm h-100">
            <Card.Body>
              <Card.Title className="text-center mb-3">Top Users (Reports Sent)</Card.Title>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={topUsers} layout="vertical" margin={{ left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Bar dataKey="reports" fill={COLORS.primary} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <Card className="chart-card shadow-sm h-100">
            <Card.Body>
              <Card.Title className="text-center mb-3">Labs & Number of Computers</Card.Title>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={labsComputers} layout="vertical" margin={{ left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis dataKey="lab" type="category" />
                  <Tooltip />
                  <Bar dataKey="computers" fill={COLORS.secondary} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <Card className="chart-card shadow-sm h-100">
            <Card.Body>
              <Card.Title className="text-center mb-3">Damage vs Missing per Lab</Card.Title>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={damageMissing}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="lab" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="damaged" fill={COLORS.danger} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="missing" fill={COLORS.info} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
