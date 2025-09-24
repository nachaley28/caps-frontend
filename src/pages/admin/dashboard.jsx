import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import {FaLaptop,FaUsers,FaUserCheck,FaUserTimes,FaExclamationTriangle,FaQuestionCircle,FaFileAlt,FaCogs,} from "react-icons/fa";
import {PieChart,Pie,Cell,Tooltip,Legend,BarChart,Bar,XAxis,YAxis,CartesianGrid,ResponsiveContainer,AreaChart,Area,
} from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";
import "./dashboard.css";

const COLORS = {
  primary: "#006633",
  secondary: "#4e79a7",
  success: "#59a14f",
  danger: "#e15759",
  info: "#9c6ade",
  warning: "#ff9d76",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [computerPartStatus, setcomputerPartStatus] = useState([]);
  const [labsComputers, setLabsComputers] = useState([]);
  const [damageMissing, setDamageMissing] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/get_data")
      .then((res) => res.json())
      .then((data) => {
        setStats(data.stats || {});
        setcomputerPartStatus(data.computerPartStatus || []);
        setLabsComputers(
          data.labEquipments.map((lab) => ({
            lab: lab.lab,
            computers: lab.total,
          }))
        );
        setDamageMissing(
          data.labEquipments.map((lab) => ({
            lab: lab.lab,
            damaged: lab.damaged,
            missing: lab.missing,
          }))
        );
      });
  }, []);

  const summaryItems = [
    { title: "Total Labs", value: stats.totalLabs, icon: <FaLaptop />, color: "#0D6EFD", bg: "#eaf2ff" },
    { title: "Total Computers", value: stats.totalComputers, icon: <FaCogs />, color: "#4e79a7", bg: "#edf2f9" },
    { title: "Operational Parts", value: stats.operational, icon: <FaUserCheck />, color: "#59a14f", bg: "#eaf7ef" },
    { title: "Not Operational", value: stats.notOperational, icon: <FaUserTimes />, color: "#e15759", bg: "#fdecec" },
    { title: "Total Users", value: stats.totalUsers, icon: <FaUsers />, color: "#0D6EFD", bg: "#eaf2ff" },
    { title: "Reports Submitted", value: stats.reportsSubmitted, icon: <FaFileAlt />, color: "#9c6ade", bg: "#f4ecfb" },
    { title: "Damaged Equipments", value: stats.damaged, icon: <FaExclamationTriangle />, color: "#ff9d76", bg: "#fff2eb" },
    { title: "Missing Equipments", value: stats.missing, icon: <FaQuestionCircle />, color: "#e15759", bg: "#fdecec" },
  ];

  return (
    <Container fluid className="my-4">
      <div className="kpi-row mb-4">
        {summaryItems.map((item, idx) => (
          <Card
            key={idx}
            className="kpi-card shadow-sm"
            style={{ backgroundColor: item.bg }}
          >
            <Card.Body>
              <div className="kpi-icon" style={{ color: item.color }}>
                {item.icon}
              </div>
              <h6 className="kpi-title">{item.title}</h6>
              <div className="kpi-value">{item.value ?? 0}</div>
            </Card.Body>
          </Card>
        ))}
      </div>

      
      <Row className="g-4">
       
      <Col xs={12} md={6} lg={6}>
        <Card className="chart-card shadow-sm">
            <Card.Body>
              <Card.Title  className="fw-bold text-center mb-3">Computer Status</Card.Title>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Operational", value: stats.operational },
                      { name: "Not Operational", value: stats.notOperational },
                    ]}
                    margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110} 
                    label
                  >
                    <Cell fill={COLORS.success} />
                    <Cell fill={COLORS.danger} />
                  </Pie>
                  <Tooltip />
                  <Legend layout="vertical" verticalAlign="middle" align="right" />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
        </Card>
      </Col>

      <Col xs={12} md={6} lg={6}>
        <Card className="chart-card shadow-sm">
          <Card.Body>
            <Card.Title  className="fw-bold text-center mb-3">Computer Parts Status</Card.Title>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={computerPartStatus}
                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                barCategoryGap="30%"  
                barGap={8}             
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis
                    allowDecimals={false}   
                    domain={[0, 'auto']}     
                    tickCount={Math.max(
                      2,
                      Math.ceil(
                        Math.max(...computerPartStatus.map(d =>
                          Math.max(d.operational, d.notOperational, d.missing, d.damaged)
                        )) + 1
                      )
                    )}
                    interval={0}             
                  />
                <Tooltip />
                <Legend verticalAlign="top" align="center" />
                <Bar dataKey="operational"    fill="green"   barSize={20} />
                <Bar dataKey="notOperational" fill="#FFC107" barSize={20} />
                <Bar dataKey="missing"        fill="#DC3545" barSize={20} />
                <Bar dataKey="damaged"        fill="#6C757D" barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </Card.Body>
        </Card>
      </Col>



    {/* Labs & Computers */}
        <Col xs={12} md={6} lg={6}>
        <Card className="chart-card shadow-lg rounded-3">
          <Card.Body>
            <Card.Title className="fw-bold text-center mb-3">
              Labs & Computers
            </Card.Title>
            <ResponsiveContainer width="100%" height={340}>
              <BarChart
                data={labsComputers}
                layout="vertical"
                margin={{ top: 30, right: 30, left: 60, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="2 4" stroke="#d6d6d6" />
                <YAxis
                  dataKey="lab"
                  type="category"
                  interval={0}
                  width={120}
                  tick={{ fill: "#333", fontSize: 14 }}
                />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  tick={{ fill: "#333", fontSize: 14 }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(0,0,0,0.05)" }}
                  contentStyle={{
                    backgroundColor: "#f9f9f9",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    fontSize: 14
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="center"
                  wrapperStyle={{ fontSize: 14, marginBottom: 10 }}
                />
                <Bar
                  dataKey="computers"
                  fill="#36A420"         
                  barSize={28}          
                  radius={[6, 6, 6, 6]}   
                />
              </BarChart>
            </ResponsiveContainer>
          </Card.Body>
        </Card>
      </Col>


      {/* Damage vs Missing */}
      <Col xs={12} md={6} lg={6}>
        <Card className="chart-card shadow-sm">
          <Card.Body>
            <Card.Title className="fw-bold text-center mb-3">Damage vs Missing per Lab</Card.Title>
            <ResponsiveContainer width="100%" height={340}>
              <AreaChart
                data={damageMissing}
                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="damagedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e15759" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#e15759" stopOpacity={0.2} />
                  </linearGradient>
                  <linearGradient id="missingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0D6EFD" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#0D6EFD" stopOpacity={0.2} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  dataKey="lab"
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={60}
                />
                <YAxis allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", borderRadius: "6px" }}
                />
                <Legend verticalAlign="top" align="center" />

                <Area
                  type="monotone"
                  dataKey="damaged"
                  stroke="#e15759"
                  fill="url(#damagedGradient)"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
                <Area
                  type="monotone"
                  dataKey="missing"
                  stroke="#0D6EFD"
                  fill="url(#missingGradient)"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card.Body>
        </Card>
      </Col>

      </Row>
    </Container>
  );
}
