import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import MetricsTable from "./components/MetricsTable";
import MetricsCharts from "./components/MetricsCharts";
import LoginPage from "./components/LoginPage";
import ParticipantsCRUD from "./components/ParticipantsCRUD";
import ProgramCostCRUD from "./components/ProgramCostCRUD";
import CrimeDataCRUD from "./components/CrimeDataCRUD";
import "./styles.css";

const App = () => {
  const [metrics, setMetrics] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("authToken") || null);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Token ${token}`;
    }

    axios
      .get("http://127.0.0.1:8000/api/metrics/")
      .then((response) => {
        setMetrics(response.data);
      })
      .catch((error) => {
        console.error("Error fetching metrics:", error);
      });
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setToken(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <Router>
      <div>
        {/* Top Navigation Bar */}
        <nav
          style={{
            position: "fixed",
            top: 0,
            width: "100%",
            padding: "20px 10px",
            backgroundColor: "#282c34",
            color: "white",
            zIndex: 1000,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <Link
              to="/visualizations"
              style={{
                marginRight: "20px",
                color: "white",
                textDecoration: "none",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              Dashboard
            </Link>
            <Link
              to="/"
              style={{
                marginRight: "20px",
                color: "white",
                textDecoration: "none",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              Overview
            </Link>
            {token && (
              <>
                <Link
                  to="/participants"
                  style={{
                    marginRight: "20px",
                    color: "white",
                    textDecoration: "none",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  Participants
                </Link>
                <Link
                  to="/program-costs"
                  style={{
                    marginRight: "20px",
                    color: "white",
                    textDecoration: "none",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  Program Costs
                </Link>
                <Link
                  to="/crime-data"
                  style={{
                    color: "white",
                    textDecoration: "none",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  Crime Data
                </Link>
              </>
            )}
          </div>
          <div>
            {token ? (
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                style={{
                  color: "white",
                  textDecoration: "none",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                Login
              </Link>
            )}
          </div>
        </nav>

        {/* Define Routes for Navigation */}
        <div style={{ paddingTop: "80px" }}>
          <Routes>
            <Route
              path="/login"
              element={<LoginPage setToken={setToken} />}
            />
            <Route
              path="/visualizations"
              element={<MetricsCharts metrics={metrics} />}
            />
            <Route
              path="/"
              element={<MetricsTable metrics={metrics} />}
            />
            <Route
              path="/participants"
              element={token ? <ParticipantsCRUD token={token} /> : <Navigate to="/login" />}
            />
            <Route
              path="/program-costs"
              element={token ? <ProgramCostCRUD token={token} /> : <Navigate to="/login" />}
            />
            <Route
              path="/crime-data"
              element={token ? <CrimeDataCRUD token={token} /> : <Navigate to="/login" />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
