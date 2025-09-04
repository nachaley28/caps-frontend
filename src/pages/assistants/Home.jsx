import { useEffect, useState } from "react";
import {FaLaptop,FaDesktop,FaPlug,FaUsers,FaExclamationTriangle,
} from "react-icons/fa";
import {PieChart,Pie,Cell,Legend,Tooltip,LineChart,Line,CartesianGrid,XAxis,YAxis,ResponsiveContainer,ScatterChart,Scatter,BarChart,Bar,
} from "recharts";

function StatCard({ title, value, icon, color }) {
  return (
    <div className="col">
      <div
        className="card text-center shadow-sm mb-3"
        style={{
          borderRadius: "10px",
          padding: "1.2rem",
          backgroundColor: "#fff",
          minHeight: "120px",
          borderTop: `4px solid ${color}`,
          transition: "all 0.3s ease-in-out",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.boxShadow =
            "0px 6px 18px rgba(90,141,238,0.3)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.boxShadow =
            "0px 4px 6px rgba(0,0,0,0.1)")
        }
      >
        <div className="mb-2" style={{ fontSize: "1.6rem", color: color }}>
          {icon}
        </div>
        <h6 className="fw-semibold text-dark">{title}</h6>
        <p className="fs-5 fw-bold mb-0 text-dark">{value}</p>
      </div>
    </div>
  );
}

function ChartCard({ title, color, children }) {
  return (
    <div className="card shadow-sm mb-3"
      style={{
        borderRadius: "10px",
        backgroundColor: "#fff",
        borderTop: `4px solid ${color}`,
      }}>
      <div className="card-body">
        <h6 className="text-dark mb-3 text-center">{title}</h6>
        {children}
      </div>
    </div>
  );
}

// ----- Inventory Table Component -----
function InventoryTable({ inventory }) {
  return (
    <ChartCard title="Reports Submitted" color="#5A8DEE">
      <div className="table-responsive">
        <table
          className="table table-striped table-hover"
          style={{ fontSize: "0.85rem" }}
        >
          <thead style={{ backgroundColor: "#5A8DEE", color: "#fff" }}>
            <tr>
              <th>Timestamp</th>
              <th>Item</th>
              <th>Lab</th>
              <th>Label</th>
              <th>Status</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item, index) => (
              <tr key={index}>
                <td>{item.timestamp}</td>
                <td>{item.item}</td>
                <td>{item.lab}</td>
                <td>{item.label}</td>
                <td>{item.status}</td>
                <td>{item.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartCard>
  );
}

export default function Home() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newReport, setNewReport] = useState({
    reportId: "",
    item: "",
    lab: "",
    label: "Operational",
    quantity: "",
    status: "Missing",
    notes: "",
    timestamp: new Date().toLocaleString(),
  });

  const PIE_COLORS = ["#4E79A7", "#A0CBE8", "#59A14F", "#8CD17D"];
  const LINE_COLOR = "#4374B3";
  const SCATTER_COLORS = { damaged: "#9C27B0", missing: "#4CAF50" };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReport((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddReport = (e) => {
    e.preventDefault();
    setReports((prev) => [...prev, newReport]);
    const user = getStoredUser();
    fetch("http://127.0.0.1:5000/add_report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-Email": user?.email || "",
        "X-User-Id": user?.lgid || "",
      },
      body: JSON.stringify({ data: newReport }),
    });
    setShowModal(false);
    setNewReport({
      reportId: "",
      item: "",
      lab: "",
      label: "Operational",
      quantity: "",
      status: "Missing",
      notes: "",
      timestamp: new Date().toLocaleString(),
    });
  };

  function getStoredUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  useEffect(() => {
    fetch("http://127.0.0.1:5000/get_reports")
      .then((res) => res.json())
      .then((data) => setReports(data))
      .catch((err) => setError(err.message));
  }, []);

  // Stats
  const totalReports = reports.length;
  const damagedItems = reports.filter((r) => r.status === "Damage");
  const missingItems = reports.filter((r) => r.status === "Missing");
  const operationalItems = reports.filter((r) => r.label === "Operational");
  const notOperationalItems = reports.filter((r) => r.label !== "Operational");

  // Charts
  const damagedChart = damagedItems.reduce((acc, r) => {
    const existing = acc.find((a) => a.item === r.item);
    if (existing) existing.count += 1;
    else acc.push({ item: r.item, count: 1 });
    return acc;
  }, []);

  const missingChart = missingItems.reduce((acc, r) => {
    const existing = acc.find((a) => a.item === r.item);
    if (existing) existing.count += 1;
    else acc.push({ item: r.item, count: 1 });
    return acc;
  }, []);

  const labData = reports.reduce((acc, r) => {
    let labEntry = acc.find((l) => l.lab === r.lab);
    if (!labEntry) {
      labEntry = { lab: r.lab, damaged: 0, missing: 0 };
      acc.push(labEntry);
    }
    if (r.status === "Damage") labEntry.damaged += 1;
    if (r.status === "Missing") labEntry.missing += 1;
    return acc;
  }, []);

  return (
    <div className="container-fluid mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="text-dark fw-bold">Lab Assistant Overview</h4>
        <button
          className="btn btn-primary px-3 py-2 rounded-2"
          onClick={() => setShowModal(true)}
        >
          + Add Report
        </button>
      </div>

      {/* ----- Add Report Modal ----- */}
      {showModal && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            className="modal-content p-4"
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              minWidth: "320px",
              maxWidth: "500px",
              width: "90%",
              boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
            }}
          >
            <h5 className="mb-3 text-center">Add New Report</h5>
            <form onSubmit={handleAddReport}>
              <input
                type="text"
                name="item"
                value={newReport.item}
                onChange={handleInputChange}
                className="form-control mb-2"
                placeholder="Item Name"
                required
              />
              <select
                name="lab"
                value={newReport.lab}
                onChange={handleInputChange}
                className="form-select mb-2"
                required
              >
                <option value="" defaultValue>
                  Select Computer Lab
                </option>
                {Array.from({ length: 7 }, (_, i) => (
                  <option key={i} value={`Computer Lab ${i + 1}`}>
                    Computer Lab {i + 1}
                  </option>
                ))}
              </select>
              <select
                name="label"
                value={newReport.label}
                onChange={handleInputChange}
                className="form-select mb-2"
              >
                <option value="Operational">Operational</option>
                <option value="Not Operational">Not Operational</option>
              </select>
              <input
                type="number"
                name="quantity"
                value={newReport.quantity}
                onChange={handleInputChange}
                className="form-control mb-2"
                placeholder="Quantity"
                required
              />
              <select
                name="status"
                value={newReport.status}
                onChange={handleInputChange}
                className="form-select mb-2"
              >
                <option value="Missing">Missing</option>
                <option value="Damage">Damage</option>
              </select>
              <textarea
                name="notes"
                value={newReport.notes}
                onChange={handleInputChange}
                className="form-control mb-2"
                placeholder="Notes"
                rows={3}
              ></textarea>
              <div className="d-flex justify-content-end gap-2 mt-3">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----- Stats Cards ----- */}
      <div className="row justify-content-center gx-2 gy-2 mb-4">
        <StatCard
          title="Total Reports"
          value={totalReports}
          icon={<FaUsers size={28} />}
          color="#4E79A7"
        />
        <StatCard
          title="Damaged Items"
          value={damagedItems.length}
          icon={<FaExclamationTriangle size={28} />}
          color="#E15759"
        />
        <StatCard
          title="Missing Items"
          value={missingItems.length}
          icon={<FaPlug size={28} />}
          color="#F28E2B"
        />
        <StatCard
          title="Operational"
          value={operationalItems.length}
          icon={<FaDesktop size={28} />}
          color="#59A14F"
        />
        <StatCard
          title="Not Operational"
          value={notOperationalItems.length}
          icon={<FaLaptop size={28} />}
          color="#9C27B0"
        />
      </div>

      {/* ----- Charts in Cards ----- */}
      <div className="row g-3">
        <div className="col-md-6 col-sm-12">
          <ChartCard title="Damaged Items Distribution" color="#E15759">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={damagedChart}
                  dataKey="count"
                  nameKey="item"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label
                >
                  {damagedChart.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={30} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="col-md-6 col-sm-12">
          <ChartCard title="Missing Items Trend" color="#F28E2B">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={missingChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="item" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke={LINE_COLOR}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="col-md-6 col-sm-12">
          <ChartCard title="Lab-wise Damage & Missing" color="#9C27B0">
            <ResponsiveContainer width="100%" height={220}>
              <ScatterChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="category" dataKey="lab" name="Lab" />
                <YAxis type="number" name="Count" allowDecimals={false} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter
                  name="Damaged"
                  data={labData}
                  dataKey="damaged"
                  fill={SCATTER_COLORS.damaged}
                />
                <Scatter
                  name="Missing"
                  data={labData}
                  dataKey="missing"
                  fill={SCATTER_COLORS.missing}
                />
                <Legend />
              </ScatterChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="col-md-6 col-sm-12">
          <ChartCard title="Operational vs Not Operational" color="#59A14F">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={[
                  { status: "Operational", count: operationalItems.length },
                  { status: "Not Operational", count: notOperationalItems.length },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count">
                  <Cell fill="#4CAF50" />
                  <Cell fill="#F44336" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      <InventoryTable inventory={reports} />
    </div>
  );
}
