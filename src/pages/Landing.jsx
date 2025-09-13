import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function LandingPage() {
  const navigate = useNavigate();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: { email: loginEmail, password: loginPassword },
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        if (data.user.role === "Lab Assistant") {
          navigate("/assistants");
        } else if (data.user.role === "Admin") {
          navigate("/admin");
        }
      } else {
        alert(data.msg || "Login failed");
      }
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100 px-3"
      style={{ backgroundColor: "#FDF6F0", fontFamily: "Cambria, Georgia, serif" }}
    >
      <div
        className="row rounded-4 overflow-hidden bg-white"
        style={{
          maxWidth: "900px",
          width: "100%",
          boxShadow: "0 1rem 3rem rgba(0,0,0,0.175)",
          transition: "transform 0.3s, boxShadow 0.3s",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow =
            "0 0 10px #0A2E4D, 0 0 20px #1E4D75, 0 0 30px rgba(10,46,77,0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 1rem 3rem rgba(0,0,0,0.175)";
        }}
      >
        <div className="col-12 col-md-6 p-0">
          <img
            src="/img/image.png"
            alt="Welcome to LabGuard"
            className="w-100 h-100"
            style={{ objectFit: "fit" }}
          />
        </div>

        <div className="col-12 col-md-6 d-flex align-items-center p-4">
          <div className="w-100">
            <form onSubmit={handleLogin}>
              <h2
                className="mb-2 text-center"
                style={{
                  color: "#0A2E4D",
                  fontFamily: "'Share Tech Mono', monospace",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  fontWeight: "bolder",
                }}
              >
                CLAIMS
              </h2>
              <p className="mb-4 text-center text-muted">Log in to continue</p>

              <input
                type="email"
                className="form-control mb-3"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />

              <div className="position-relative mb-3">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
                <span
                  className="position-absolute end-0 top-50 translate-middle-y pe-3"
                  style={{ cursor: "pointer", color: "#1E4D75" }}
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                >
                  {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <button
                type="submit"
                className="btn w-100 mb-2"
                style={{
                  background: "linear-gradient(90deg, #0A2E4D, #1E4D75)",
                  color: "#fff",
                  fontWeight: "bold",
                }}
              >
                Login
              </button>

              <p
                className="mt-2 text-center"
                style={{
                  cursor: "pointer",
                  color: "#1E4D75",
                  textDecoration: "underline",
                }}
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
