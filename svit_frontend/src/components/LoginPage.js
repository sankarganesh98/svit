import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    axios
      .post("http://127.0.0.1:8000/api/token-login/", { username, password })
      .then((response) => {
        const token = response.data.token;
        localStorage.setItem("authToken", token);
        setToken(token);
        navigate("/participants");
      })
      .catch(() => {
        setError("Invalid credentials. Please try again.");
      });
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Admin Login</h2>
      <div style={{ margin: "10px 0" }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            width: "300px",
            marginBottom: "10px",
          }}
        />
      </div>
      <div style={{ margin: "10px 0" }}>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            width: "300px",
            marginBottom: "10px",
          }}
        />
      </div>
      <button
        onClick={handleLogin}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#4caf50",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Login
      </button>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
};

export default LoginPage;
