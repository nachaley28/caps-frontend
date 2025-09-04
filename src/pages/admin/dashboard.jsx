import React from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { FaLaptop, FaCogs, FaExclamationTriangle, FaQuestionCircle, FaUsers, FaUserCheck, FaUserTimes, FaFileAlt } from 'react-icons/fa';
import {
  LineChart, PieChart,Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer,
  BarChart, Bar, RadarChart,Pie, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  RadialBarChart,RadialBar,Cell
} from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';

// ----- Dummy Data -----
const reportsData = [
  { date: '2025-08-01', submitted: 5 },
  { date: '2025-08-02', submitted: 3 },
  { date: '2025-08-03', submitted: 6 },
  { date: '2025-08-04', submitted: 2 },
  { date: '2025-08-05', submitted: 8 },
  { date: '2025-08-06', submitted: 7 },
  { date: '2025-08-07', submitted: 4 },
];

const stats = {
  totalLabs: 3,
  totalEquipments: 60,
  equipmentsOperation: 50,
  equipmentsNotOperation: 10,
  totalUsers: 50,
  activeUsers: 42,
  inactiveUsers: 8,
  reportsSubmitted: 35,
  damaged: 9,
  missing: 4,
};

const labEquipments = [
  { lab: 'Lab A', total: 25, damaged: 4, missing: 1 },
  { lab: 'Lab B', total: 20, damaged: 3, missing: 2 },
  { lab: 'Lab C', total: 15, damaged: 2, missing: 1 },
];

const equipmentDamageStats = [
  { name: 'PC', damaged: 5, missing: 2 },
  { name: 'Printer', damaged: 2, missing: 1 },
  { name: 'Projector', damaged: 2, missing: 1 },
  { name: 'Monitor', damaged: 3, missing: 1 },
];

// Chart Colors
const PIE_COLORS = ['#4e79a7', '#f28e2b'];
const BAR_COLORS = ['#76b7b2', '#e15759'];
const LINE_COLOR = '#59a14f';
const RADAR_COLORS = { damaged: '#ff9d76', missing: '#76baff' };
const RADIAL_COLORS = ['#00C49a', '#FF8042'];

const summaryItems = [
  { title: 'Total Labs', value: stats.totalLabs, icon: <FaLaptop size={30} color="#4e79a7" /> },
  { title: 'Total Equipments', value: stats.totalEquipments, icon: <FaCogs size={30} color="#e15759" /> },
  { title: 'Damaged', value: stats.damaged, icon: <FaExclamationTriangle size={30} color="#ff9d76" /> },
  { title: 'Missing', value: stats.missing, icon: <FaQuestionCircle size={30} color="#f28e2b" /> },
  { title: 'Total Users', value: stats.totalUsers, icon: <FaUsers size={30} color="#76b7b2" /> },
  { title: 'Active Users', value: stats.activeUsers, icon: <FaUserCheck size={30} color="#59a14f" /> },
  { title: 'Inactive Users', value: stats.inactiveUsers, icon: <FaUserTimes size={30} color="#e15759" /> },
  { title: 'Reports Submitted', value: stats.reportsSubmitted, icon: <FaFileAlt size={30} color="#4e79a7" /> },
];

// Prepare data for Radial Bar Chart
const userActivityData = [
  { name: 'Active', value: stats.activeUsers, fill: RADIAL_COLORS[0] },
  { name: 'Inactive', value: stats.inactiveUsers, fill: RADIAL_COLORS[1] },
];

export default function AdminDashboard() {
  return (
    <Container className="my-4">
      <h2 className="mb-4 text-center" style={{ fontWeight: '700' }}>Admin Dashboard</h2>

      {/* ----- Quick Summary Cards with Icons ----- */}
      <Row className="mb-4 g-4">
        {summaryItems.map((item, idx) => (
          <Col xs={12} sm={6} md={3} key={idx}>
            <Card
              className="shadow-sm h-100 text-center"
              style={{
                background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
                border: '2px solid #d1d9e6',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                <div className="mb-2">{item.icon}</div>
                <Card.Title style={{ fontWeight: '600' }}>{item.title}</Card.Title>
                <h3>{item.value}</h3>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ----- Charts Grid ----- */}
      <Row className="g-4">
        {/* Radial Bar Chart: User Activity */}
        <Col xs={12} md={6}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title className="text-center">User Activity</Card.Title>
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
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title className="text-center">Equipment Status</Card.Title>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Operational', value: stats.equipmentsOperation },
                      { name: 'Not Operational', value: stats.equipmentsNotOperation },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    <Cell fill={PIE_COLORS[0]} />
                    <Cell fill={PIE_COLORS[1]} />
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        {/* Line Chart: Reports Submitted */}
        <Col xs={12} md={6}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title className="text-center">Reports Submitted Per Day</Card.Title>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={reportsData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="4 4" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend verticalAlign="top" />
                  <Line type="monotone" dataKey="submitted" stroke={LINE_COLOR} strokeWidth={3} name="Reports Submitted" />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        {/* Stacked Bar Chart: Damaged & Missing per Lab */}
        <Col xs={12} md={6}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title className="text-center">Damaged & Missing per Lab</Card.Title>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={labEquipments} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="4 4" />
                  <XAxis dataKey="lab" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend verticalAlign="top" />
                  <Bar dataKey="damaged" stackId="a" fill={BAR_COLORS[1]} />
                  <Bar dataKey="missing" stackId="a" fill={BAR_COLORS[0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        {/* Horizontal Bar Chart: Labs with Most Equipments */}
        <Col xs={12} md={6}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title className="text-center">Labs with Most Equipments</Card.Title>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={labEquipments} layout="vertical" margin={{ top: 20, right: 20, left: 50, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="4 4" />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis type="category" dataKey="lab" />
                  <Tooltip />
                  <Legend verticalAlign="top" />
                  <Bar dataKey="total" fill="#4e79a7" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        {/* Radar Chart: Equipments Prone to Damage / Missing */}
        <Col xs={12} md={6}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title className="text-center">Equipments Prone to Damage / Missing</Card.Title>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={equipmentDamageStats}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis />
                  <Tooltip />
                  <Radar name="Damaged" dataKey="damaged" stroke={RADAR_COLORS.damaged} fill={RADAR_COLORS.damaged} fillOpacity={0.5} />
                  <Radar name="Missing" dataKey="missing" stroke={RADAR_COLORS.missing} fill={RADAR_COLORS.missing} fillOpacity={0.5} />
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
