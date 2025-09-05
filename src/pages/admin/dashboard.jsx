import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import {
  FaLaptop,
  FaCogs,
  FaExclamationTriangle,
  FaQuestionCircle,
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaFileAlt,
} from "react-icons/fa";
import {
  LineChart,
  PieChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  RadarChart,
  Pie,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBarChart,
  RadialBar,
  Cell,
} from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";

// Chart Colors
const COLORS = {
  primary: "#4e79a7",
  secondary: "#f28e2b",
  success: "#59a14f",
  danger: "#e15759",
  info: "#9c6ade",
  warning: "#ff9d76",
  light: "#f5f6fa",
};
const PIE_COLORS = [COLORS.primary, COLORS.danger];
const BAR_COLORS = [COLORS.secondary, COLORS.success];
const LINE_COLOR = COLORS.success;

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [reportsData, setReportsData] = useState([]);
  const [labEquipments, setLabEquipments] = useState([]);
  const [equipmentDamageStats, setEquipmentDamageStats] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/get_data")
      .then((res) => res.json())
      .then((data) => {
        setStats(data.stats);
        setReportsData(data.reportsData || []); // only if backend provides daily trend
        setLabEquipments(data.labEquipments || []);
        setEquipmentDamageStats(data.equipmentDamageStats || []);
      })
      .catch((err) => console.error("Error fetching dashboard data:", err));
  }, []);

  const summaryItems = [
    {
      title: "Total Labs",
      value: stats.totalLabs,
      icon: <FaLaptop size={30} />,
      color: COLORS.primary,
    },
    {
      title: "Total Equipments",
      value: stats.totalEquipments,
      icon: <FaCogs size={30} />,
      color: COLORS.secondary,
    },
    {
      title: "Damaged",
      value: stats.damaged,
      icon: <FaExclamationTriangle size={30} />,
      color: COLORS.warning,
    },
    {
      title: "Missing",
      value: stats.missing,
      icon: <FaQuestionCircle size={30} />,
      color: COLORS.info,
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <FaUsers size={30} />,
      color: COLORS.primary,
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: <FaUserCheck size={30} />,
      color: COLORS.success,
    },
    {
      title: "Inactive Users",
      value: stats.inactiveUsers,
      icon: <FaUserTimes size={30} />,
      color: COLORS.danger,
    },
    {
      title: "Reports Submitted",
      value: stats.reportsSubmitted,
      icon: <FaFileAlt size={30} />,
      color: COLORS.secondary,
    },
  ];

  // Radial Bar Chart data
  const userActivityData = [
    { name: "Active", value: stats.activeUsers, fill: COLORS.success },
    { name: "Inactive", value: stats.inactiveUsers, fill: COLORS.danger },
  ];

  return (
    <Container className="my-4">
      <style>{`
        .dashboard-title {
          font-weight: 800;
          letter-spacing: 1px;
          color: ${COLORS.primary};
          border-bottom: 3px solid ${COLORS.secondary};
          display: inline-block;
          padding-bottom: 6px;
          margin-bottom: 20px;
        }
        .summary-card {
          border: none;
          border-radius: 12px;
          transition: all 0.25s ease-in-out;
          background: ${COLORS.light};
        }
        .summary-card:hover {
          transform: translateY(-4px);
          box-shadow: 0px 6px 18px rgba(0,0,0,0.12);
        }
        .summary-value {
          font-size: 1.8rem;
          font-weight: 700;
          color: #2c3e50;
        }
        .chart-card {
          border: none;
          border-radius: 12px;
        }
        .chart-card .card-body {
          padding: 1rem 1.25rem;
        }
      `}</style>

      <h2 className="text-center dashboard-title">Admin Dashboard</h2>

      {/* Summary Cards */}
      <Row className="mb-4 g-4">
        {summaryItems.map((item, idx) => (
          <Col xs={12} sm={6} md={3} key={idx}>
            <Card
              className="summary-card h-100 text-center shadow-sm"
              style={{ borderTop: `5px solid ${item.color}` }}
            >
              <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                <div className="mb-2" style={{ color: item.color }}>
                  {item.icon}
                </div>
                <Card.Title>{item.title}</Card.Title>
                <div className="summary-value">{item.value}</div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts Grid */}
      <Row className="g-4">
        {/* Radial Bar Chart: User Activity */}
        <Col xs={12} md={6}>
          <Card className="chart-card shadow-sm h-100">
            <Card.Body>
              <Card.Title className="text-center mb-3">User Activity</Card.Title>
              <ResponsiveContainer width="100%" height={250}>
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="30%"
                  outerRadius="90%"
                  barSize={20}
                  data={userActivityData}
                  startAngle={180}
                  endAngle={-180}
                >
                  <RadialBar minAngle={15} background clockWise dataKey="value" />
                  <Legend iconSize={10} layout="horizontal" verticalAlign="bottom" />
                  <Tooltip />
                </RadialBarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        {/* Pie Chart: Equipment Status */}
        <Col xs={12} md={6}>
          <Card className="chart-card shadow-sm h-100">
            <Card.Body>
              <Card.Title className="text-center mb-3">Equipment Status</Card.Title>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Operational", value: stats.equipmentsOperation },
                      { name: "Not Operational", value: stats.equipmentsNotOperation },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {PIE_COLORS.map((color, idx) => (
                      <Cell key={idx} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        {/* Line Chart: Reports Submitted (only if backend provides it) */}
        <Col xs={12} md={6}>
          <Card className="chart-card shadow-sm h-100">
            <Card.Body>
              <Card.Title className="text-center mb-3">Reports Submitted Per Day</Card.Title>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={reportsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend verticalAlign="top" />
                  <Line type="monotone" dataKey="submitted" stroke={LINE_COLOR} strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        {/* Stacked Bar Chart: Damaged & Missing per Lab */}
        <Col xs={12} md={6}>
          <Card className="chart-card shadow-sm h-100">
            <Card.Body>
              <Card.Title className="text-center mb-3">Damaged & Missing per Lab</Card.Title>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={labEquipments}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="lab" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend verticalAlign="top" />
                  <Bar dataKey="damaged" stackId="a" fill={BAR_COLORS[0]} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="missing" stackId="a" fill={BAR_COLORS[1]} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        {/* Horizontal Bar Chart: Labs with Most Equipments */}
        <Col xs={12} md={6}>
          <Card className="chart-card shadow-sm h-100">
            <Card.Body>
              <Card.Title className="text-center mb-3">Labs with Most Equipments</Card.Title>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={labEquipments} layout="vertical" margin={{ left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis type="category" dataKey="lab" />
                  <Tooltip />
                  <Legend verticalAlign="top" />
                  <Bar dataKey="total" fill={COLORS.primary} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        {/* Radar Chart: Equipments Prone to Damage / Missing */}
        <Col xs={12} md={6}>
          <Card className="chart-card shadow-sm h-100">
            <Card.Body>
              <Card.Title className="text-center mb-3">Equipments Prone to Damage / Missing</Card.Title>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={equipmentDamageStats}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis />
                  <Tooltip />
                  <Radar
                    name="Damaged"
                    dataKey="damaged"
                    stroke={COLORS.danger}
                    fill={COLORS.danger}
                    fillOpacity={0.5}
                  />
                  <Radar
                    name="Missing"
                    dataKey="missing"
                    stroke={COLORS.info}
                    fill={COLORS.info}
                    fillOpacity={0.5}
                  />
                  <Legend verticalAlign="bottom" />
                </RadarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
