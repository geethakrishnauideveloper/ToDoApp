import React, { useState } from "react";
import { Link, Routes, Route, Navigate } from "react-router-dom";
import DayPlannerLandingPage from "./Dayplannerlandingpage";
import "./Welcome.css";

function Welcome({ users , onLogout }) {
  const sections = [
    "Day Planner",
    "Section 2",
    "Section 3",
    "Section 4",
    "Section 5",
    "Section 6",
    "Section 7",
  ];

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="page">
      {/* Toggle Button */}
      <button className="toggle-btn" onClick={toggleSidebar}>☰</button>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
       <h2 style={{ marginLeft: "20px" }}>
  Welcome {users?.username || "Guest"}
</h2>

        <ul>
          {sections.map((sec, index) => (
            <li key={sec}>
              <Link to={`/welcome/section${index + 1}`} onClick={() => setSidebarOpen(false)}>
                {sec}
              </Link>
            </li>
          ))}
        </ul>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>

      {/* Overlay */}
      <div className={`overlay ${sidebarOpen ? "show" : ""}`} onClick={toggleSidebar}></div>

      {/* Main Content */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<div className="placeholder">Select a section</div>} />
          {sections.map((sec, index) => (
            <Route
              key={sec}
              path={`section${index + 1}`}
              element={<DayPlannerLandingPage section={sec} />}
            />
          ))}
          <Route path="*" element={<Navigate to="/welcome" />} />
        </Routes>
      </div>
    </div>
  );
}

export default Welcome;
