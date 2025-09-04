import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function LandingPage() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [signupApproved, setSignupApproved] = useState(false);
    const [assignedID, setAssignedID] = useState(""); 

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState(""); 
    const [showLoginPassword, setShowLoginPassword] = useState(false);

    const [signupName, setSignupName] = useState("");
    const [signupYear, setSignupYear] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupRole, setSignupRole] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [signupConfirm, setSignupConfirm] = useState("");
    const [showSignupPassword, setShowSignupPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("https://de0637a38bfe.ngrok-free.app/login", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: { email: loginEmail, password: loginPassword } })
            });

            const data = await res.json();

            console.log(data);

            if (res.ok) {
                localStorage.setItem('user', JSON.stringify(data.user));
                if (data.user.role === 'Lab Assistant') {
                    navigate('/assistants');
                } 
                else if(data.user.role === 'Admin') { 
                    navigate('/admin');
                
                }
            } else {
                alert(data.msg || "Login failed");
            }
        } catch (err) {
            alert("Login failed: " + err.message);
        }
    };

    const handleSignup = async(e)  => {
        e.preventDefault();
        if (signupPassword !== signupConfirm) {
            alert("Passwords do not match!");
            return;
        }
        await fetch("http://127.0.0.1:5000/signup",{
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                data: {
                    name: signupName,
                    email: signupEmail,
                    role: signupRole,
                    year: signupYear,
                    password: signupPassword,
                }
            })
        });

        const generatedID = "LG" + Math.floor(1000 + Math.random() * 9000); 
        setAssignedID(generatedID);
        setSignupApproved(true);
    };

    return (
        <div 
            className="d-flex align-items-center justify-content-center"
            style={{ width: '100vw', height: '100vh', background: '#FDF6F0', fontFamily: 'Cambria, Cochin, Georgia, Times, serif', overflow: 'hidden' }}
        >
            <div 
                className="d-flex flex-column flex-md-row p-4 rounded-4 shadow-lg position-relative"
                style={{ background: '#FFFFFF', border: '1px solid #D9E2E8', boxShadow: '0 0 25px rgba(14, 46, 77, 0.2)', maxWidth: '900px', width: '100%', transition: 'all 0.8s ease' }}
            >
                <div 
                    className="d-flex flex-column align-items-center justify-content-center text-center p-4 flex-fill position-relative"
                    style={{
                        transition: 'transform 0.8s ease',
                        transform: isLogin ? 'translateX(0%)' : 'translateX(100%)',
                        zIndex: isLogin ? 1 : 0,
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '50%',
                        background: '#FFFFFF'
                    }}
                >
                    <img 
                        src="/img/Inventory.png" 
                        alt="Logo" 
                        style={{ width: '650px', height: 'auto', marginBottom: '15px' }}
                    />
                </div>

                <div 
                    className="d-flex flex-column justify-content-center p-4 flex-fill position-relative"
                    style={{
                        transition: 'transform 0.8s ease',
                        transform: isLogin ? 'translateX(0%)' : 'translateX(-100%)',
                        zIndex: isLogin ? 0 : 1,
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        bottom: 0,
                        width: '50%',
                        background: '#FFFFFF'
                    }}
                >
                    {signupApproved ? (
                        <div className="text-center">
                            <h2 className="mb-3" style={{ color: '#0A2E4D' }}>Sign Up Approved!</h2>
                            <p>Your LabGuard ID: <strong>{assignedID}</strong></p>
                            <p>Use this ID to log in.</p>
                            <button 
                                className="btn mt-3"
                                style={{background: 'linear-gradient(90deg, #0A2E4D, #1E4D75)', color: '#fff', fontWeight: 'bold'}}
                                onClick={() => {
                                    setSignupApproved(false);
                                    setIsLogin(true);
                                    setSignupName("");
                                    setSignupYear("");
                                    setSignupEmail("");
                                    setSignupRole("");
                                    setSignupPassword("");
                                    setSignupConfirm("");
                                }}
                            >
                                Next
                            </button>
                        </div>
                    ) : isLogin ? (
                        // Login Form
                        <form onSubmit={handleLogin}>
                            <h2 className="mb-2 text-center" style={{ color: '#0A2E4D' }}>WELCOME</h2>
                            <p className="mb-4 text-center" style={{ color: '#1E4D75' }}>LOG IN TO CONTINUE</p>

                            <input 
                                type="text"
                                id="loginEmail"
                                className="form-control mb-3"
                                placeholder="Email"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                required
                                style={{ background: '#D9E2E8', color: '#333', border: '1px solid #0A2E4D' }}
                            />

                            <div className="position-relative mb-3">
                                <input 
                                    type={showLoginPassword ? 'text' : 'password'}
                                    id="loginPassword"
                                    className="form-control"
                                    placeholder="Password"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    required
                                    style={{ background: '#D9E2E8', color: '#333', border: '1px solid #0A2E4D' }}
                                />
                                <span 
                                    className="position-absolute end-0 top-50 translate-middle-y pe-3"
                                    style={{ cursor: 'pointer', color: '#1E4D75' }}
                                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                                >
                                    {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>

                            <button 
                                type="submit" 
                                className="btn w-100 mb-2"
                                style={{background: 'linear-gradient(90deg, #0A2E4D, #1E4D75)', color: '#fff', fontWeight: 'bold'}} 
                            >
                                LOGIN
                            </button>

                            <p 
                                className="mt-3 text-center"
                                style={{ cursor: 'pointer', textDecoration: 'underline', color: '#1E4D75' }}
                                onClick={() => setIsLogin(false)}
                            >
                                Don't have an account? Sign Up
                            </p>
                        </form>
                    ) : (
                        // Signup Form
                        <form onSubmit={handleSignup}>
                            <h2 className="mb-2 text-center" style={{ color: '#0A2E4D' }}>CREATE ACCOUNT</h2>
                            <p className="mb-4 text-center" style={{ color: '#1E4D75' }}>SIGN UP TO START</p>

                            <input 
                                type="text"
                                id="signupName"
                                className="form-control mb-3"
                                placeholder="Full Name"
                                value={signupName}
                                onChange={(e) => setSignupName(e.target.value)}
                                required
                                style={{ background: '#D9E2E8', color: '#333', border: '1px solid #0A2E4D' }}
                            />

                            <input 
                                type="email"
                                id="signupEmail"
                                className="form-control mb-3"
                                placeholder="Phinmaed Email"
                                value={signupEmail}
                                onChange={(e) => setSignupEmail(e.target.value)}
                                required
                                style={{ background: '#D9E2E8', color: '#333', border: '1px solid #0A2E4D' }}
                            />

                            <select
                                id="signupRole"
                                className="form-control mb-3"
                                value={signupRole}
                                onChange={(e) => setSignupRole(e.target.value)}
                                required
                                style={{ background: '#D9E2E8', color: '#333', border: '1px solid #0A2E4D' }}
                            >
                                <option value="">Select Role</option>
                                <option value="Lab Assistant">Lab Assistant</option>
                                <option value="Dean"> Cite Dean</option>
                                <option value="ITSD Staff">Admin</option>
                                <option value="Adviser">Lab Adviser</option>
                            </select>

                            {signupRole === "Lab Assistant" && (
                                <select
                                    id="signupYear"
                                    className="form-control mb-3"
                                    value={signupYear}
                                    onChange={(e) => setSignupYear(e.target.value)}
                                    required
                                    style={{ background: '#D9E2E8', color: '#333', border: '1px solid #0A2E4D' }}
                                >
                                    <option value="">Select Year</option>
                                    <option value="1st Year">1st Year</option>
                                    <option value="2nd Year">2nd Year</option>
                                    <option value="3rd Year">3rd Year</option>
                                    <option value="4th Year">4th Year</option>
                                </select>
                            )}

                            <div className="position-relative mb-3">
                                <input 
                                    type={showSignupPassword ? 'text' : 'password'}
                                    id="signupPassword"
                                    className="form-control"
                                    placeholder="Password"
                                    value={signupPassword}
                                    onChange={(e) => setSignupPassword(e.target.value)}
                                    required
                                    style={{ background: '#D9E2E8', color: '#333', border: '1px solid #0A2E4D' }}
                                />
                                <span 
                                    className="position-absolute end-0 top-50 translate-middle-y pe-3"
                                    style={{ cursor: 'pointer', color: '#1E4D75' }}
                                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                                >
                                    {showSignupPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>

                            <input 
                                type="password"
                                id="signupConfirm"
                                className="form-control mb-3"
                                placeholder="Confirm Password"
                                value={signupConfirm}
                                onChange={(e) => setSignupConfirm(e.target.value)}
                                required
                                style={{ background: '#D9E2E8', color: '#333', border: '1px solid #0A2E4D' }}
                            />

                            <button 
                                type="submit" 
                                className="btn w-100 mb-2"
                                style={{background: 'linear-gradient(90deg, #0A2E4D, #1E4D75)', color: '#fff', fontWeight: 'bold'}} 
                            >
                                SIGN UP
                            </button>

                            <p 
                                className="mt-3 text-center"
                                style={{ cursor: 'pointer', textDecoration: 'underline', color: '#1E4D75' }}
                                onClick={() => setIsLogin(true)}
                            >
                                Already have an account? Log In
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
