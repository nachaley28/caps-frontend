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
        if (data.user.role !== "Admin") {
          alert("Only Admins can log in.");
          return;
        }
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/admin");
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
      style={{
        backgroundColor: "#f8f9f5", 
        fontFamily: "Cambria, Georgia, serif",
      }}
    >
      <div
        className="row rounded-4 overflow-hidden bg-white"
        style={{
          backgroundColor:"#3a4f26",
          maxWidth: "900px",
          width: "100%",
          boxShadow: "0 1rem 3rem rgba(0,0,0,0.15)",
          transition: "all 0.3s ease",
        }}
      >
      
        <div className="col-12 col-md-6 p-0">
          <img
            src="/img/image.png"
           
            className="w-100 h-100"
            style={{ objectFit: "fit" }}
          />
        </div>

      
        <div className="col-12 col-md-6 d-flex align-items-center p-4">
          <div className="w-100">
            <form onSubmit={handleLogin}>
              <h2
                className="mb-3 text-center"
                style={{
                  color: "#006633", 
                  fontFamily: "'Share Tech Mono', monospace",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  fontWeight: "bolder",
                }}
              >
                CLAIMS
              </h2>

              <p
                className="mb-4 text-center fw-semibold"
                style={{ color: "#FFCC00" }} 
              >
                Log in to continue
              </p>

              
              <input
                type="email"
                className="form-control mb-3"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                style={{
                  borderColor: "#006633",
                  boxShadow: "0 0 4px rgba(0,102,51,0.15)",
                  transition: "box-shadow 0.2s",
                }}
                onFocus={(e) =>
                  (e.target.style.boxShadow = "0 0 6px #FFCC00AA")
                }
                onBlur={(e) =>
                  (e.target.style.boxShadow = "0 0 4px rgba(0,102,51,0.15)")
                }
              />

           
              <div className="position-relative mb-3">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  style={{
                    borderColor: "#006633",
                    boxShadow: "0 0 4px rgba(0,102,51,0.15)",
                    transition: "box-shadow 0.2s",
                  }}
                  onFocus={(e) =>
                    (e.target.style.boxShadow = "0 0 6px #FFCC00AA")
                  }
                  onBlur={(e) =>
                    (e.target.style.boxShadow = "0 0 4px rgba(0,102,51,0.15)")
                  }
                />
                <span
                  className="position-absolute end-0 top-50 translate-middle-y pe-3"
                  style={{ cursor: "pointer", color: "#006633" }}
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                >
                  {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

            
              <button
                type="submit"
                className="btn w-100 mb-3"
                style={{
                  backgroundColor: "#006633",
                  color: "#ffffff",
                  fontWeight: "bold",
                  transition: "background-color 0.3s, box-shadow 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#004d26";
                  e.currentTarget.style.boxShadow = "0 0 10px #FFCC00AA";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#006633";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Login
              </button>

              
              <p
                className="mt-2 text-center"
                style={{
                  cursor: "pointer",
                  color: "#FFCC00",
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
