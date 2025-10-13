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
      className="min-vh-100 d-flex align-items-center justify-content-center position-relative"
      style={{
        fontFamily: "Cambria, Georgia, serif",
        backgroundColor: "#001a0d",
        overflow: "hidden",
      }}
    >
   
     

  
      <div
        style={{
          backgroundImage: "url('/img/uibg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "blur(6px) brightness(0.5)",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      ></div>

      
      <div
        style={{
          backgroundColor: "rgba(0, 30, 10, 0.55)", 
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0.5,
        }}
      ></div>

      {/* Login Box */}
      <div
        className="card shadow-lg text-center p-4 p-md-5"
        style={{
          maxWidth: "400px",
          width: "100%",
          borderRadius: "18px",
          background: "rgba(0, 40, 20, 0.92)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 204, 0, 0.25)",
          zIndex: 1,
          color: "#fff",
        }}
      >
        <div className="d-flex justify-content-center mb-3">
          <img
            src="/img/black.png"
            alt="Claims Logo"
            style={{
              width: "150px",
              borderRadius: "8px",
            }}
          />
        </div>
        <h2
          className="fw-bold mb-2"
          style={{
            color: "white",
            letterSpacing: "2px",
            textShadow: "1px 1px 3px rgba(0,0,0,0.3)",
          }}
        >
          CLAIMS
        </h2>

        <p
          style={{
            color: "#ffffffcc",
            fontSize: "0.95rem",
            marginBottom: "1.5rem",
          }}
        >
          Please log in to continue.
        </p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            required
            style={{
              borderColor: "#FFCC00",
              backgroundColor: "#002912",
              color: "#fff",
              borderRadius: "10px",
              padding: "10px",
            }}
            onFocus={(e) => (e.target.style.boxShadow = "0 0 6px #FFCC00")}
            onBlur={(e) => (e.target.style.boxShadow = "none")}
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
                borderColor: "#FFCC00",
                backgroundColor: "#002912",
                color: "#fff",
                borderRadius: "10px",
                padding: "10px",
              }}
              onFocus={(e) => (e.target.style.boxShadow = "0 0 6px #FFCC00")}
              onBlur={(e) => (e.target.style.boxShadow = "none")}
            />
            <span
              className="position-absolute end-0 top-50 translate-middle-y pe-3"
              style={{ cursor: "pointer", color: "#FFCC00" }}
              onClick={() => setShowLoginPassword(!showLoginPassword)}
            >
              {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            type="submit"
            className="btn w-100 mb-3"
            style={{
              backgroundColor: "#FFCC00",
              color: "#003319",
              fontWeight: "bold",
              border: "none",
              borderRadius: "10px",
              transition: "0.3s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#e6b800")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#FFCC00")
            }
          >
            Login
          </button>

          <p
            className="mt-2"
            style={{
              cursor: "pointer",
              color: "white",
              textDecoration: "underline",
              fontSize: "0.9rem",
            }}
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </p>
        </form>
      </div>

      
      <style>{`
        input::placeholder {
          color: #FFCC00 !important;
          opacity: 0.85;
        }
      `}</style>
    </div>
  );
}

export default LandingPage;
