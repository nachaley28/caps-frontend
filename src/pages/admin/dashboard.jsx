import React, { useEffect, useState } from 'react';
import { FaLaptop, FaDesktop, FaChair, FaPlug, FaVideo, FaUsers, FaExclamationTriangle } from 'react-icons/fa';
import {
  PieChart, Pie, Cell, Legend, Tooltip,
  LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer,
  ScatterChart, Scatter, BarChart, Bar
} from 'recharts';

export default function Dashboard() {
  const [reports, setReports] = useState({
    totalSubmitted: 0,
    damaged: [],
    missing: [],
    labDamage: [],
    inventory: [],
    operational_stats: []
  });

  useEffect(() => {
    fetch("http://127.0.0.1:5000/dashboard_data")
      .then(res => res.json())
      .then(data => setReports(data))
      .catch(err => console.error("Error fetching dashboard data:", err));
  }, []);

  const PIE_COLORS = ['#4E79A7', '#A0CBE8', '#59A14F', '#8CD17D'];
  const LINE_COLOR = '#4374B3';
  const SCATTER_COLORS = { damaged: '#9C27B0', missing: '#4CAF50' };

  // Fallbacks to avoid undefined
  const totalDamaged = reports.damaged?.reduce((a, b) => a + (b.count || 0), 0) || 0;
  const totalMissing = reports.missing?.reduce((a, b) => a + (b.count || 0), 0) || 0;

  const operationalData = [
    {
      status: 'Operational',
      count: reports.inventory?.filter(item => item.status?.toLowerCase() === 'operational').length || 0
    },
    {
      status: 'Not Operational',
      count: reports.inventory?.filter(item => item.status?.toLowerCase() !== 'operational').length || 0
    }
  ];

  const renderIcon = (icon) => {
    switch (icon) {
      case 'laptop': return <FaLaptop color="#4374B3" size={18} />;
      case 'desktop': return <FaDesktop color="#4374B3" size={18} />;
      case 'chair': return <FaChair color="#4374B3" size={18} />;
      case 'plug': return <FaPlug color="#4374B3" size={18} />;
      case 'video': return <FaVideo color="#4374B3" size={18} />;
      default: return null;
    }
  };

  return (
    <div className="container-fluid mt-3">
      <h3 style={{ color: '#333', marginBottom: '15px' }}>Quick Overview</h3>

      <div className="row g-2 mb-3">
        {[
          { title: 'Total Reports Submitted', value: reports.totalSubmitted || 0, icon: <FaUsers size={22} /> },
          { title: 'Total Damaged Items', value: totalDamaged, icon: <FaExclamationTriangle size={22} /> },
          { title: 'Total Missing Items', value: totalMissing, icon: <FaPlug size={22} /> },
        ].map((card, i) => (
          <div key={i} className="col-12 col-md-4">
            <div
              className="card text-center shadow-sm position-relative"
              style={{
                borderRadius: '12px',
                padding: '1rem 0.5rem',
                color: '#fff',
                background: 'linear-gradient(135deg, #4E79A7, #59A14F)',
                fontSize: '0.9rem'
              }}
            >
              <div className="mb-1">{card.icon}</div>
              <h6 style={{ fontWeight: '600' }}>{card.title}</h6>
              <p className="fs-5 fw-bold mb-0">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="row g-3">
        {/* Damaged Items - Pie Chart */}
        <div className="col-md-6 col-sm-12">
          <h6 style={{ color: '#333', marginBottom: '8px' }}>Damaged Items Distribution</h6>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={reports.damaged || []}
                dataKey="count"
                nameKey="item"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
              >
                {(reports.damaged || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={30} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Missing Items - Line Chart */}
        <div className="col-md-6 col-sm-12">
          <h6 style={{ color: '#333', marginBottom: '8px' }}>Missing Items Trend</h6>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={reports.missing || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="item" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke={LINE_COLOR} strokeWidth={2} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Lab-wise Damage & Missing - Scatter Chart */}
        <div className="col-md-6 col-sm-12">
          <h6 style={{ color: '#333', marginBottom: '8px' }}>Lab-wise Damage & Missing</h6>
          <ResponsiveContainer width="100%" height={250}>
            <ScatterChart margin={{ top: 15, right: 15, left: 15, bottom: 15 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="category" dataKey="lab" name="Lab" />
              <YAxis type="number" name="Count" allowDecimals={false} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Damaged" data={reports.labDamage || []} dataKey="damaged" fill={SCATTER_COLORS.damaged} />
              <Scatter name="Missing" data={reports.labDamage || []} dataKey="missing" fill={SCATTER_COLORS.missing} />
              <Legend />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Operational vs Not Operational - Bar Chart */}
        <div className="col-md-6 col-sm-12">
          <h6 style={{ color: '#333', marginBottom: '8px' }}>Operational vs Not Operational Items</h6>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={operationalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="remarks" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count">
                {operationalData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.status === "Operational" ? "#4CAF50" : "#F44336"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="mt-4">
        <h5 style={{ color: '#333', marginBottom: '10px' }}>Inventory Details</h5>
        <div className="table-responsive">
          <table className="table table-striped table-hover" style={{ backgroundColor: '#E6F2FF', fontSize: '0.9rem' }}>
            <thead style={{ backgroundColor: '#4374B3', color: '#fff' }}>
              <tr>
                <th>Item</th>
                <th>Icon</th>
                <th>Quantity</th>
                <th>Location</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(reports.inventory || []).map((item, index) => (
                <tr key={index}>
                  <td>{item.title}</td>
                  <td>{renderIcon(item.icon)}</td>
                  <td>{item.count}</td>
                  <td>{item.location}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
