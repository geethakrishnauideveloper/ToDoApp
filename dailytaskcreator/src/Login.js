import React, { useState } from "react";
import { getUserByUsername } from "./db";

function Login({ onSignup, onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Enter username and password");
      return;
    }

    const user = await getUserByUsername(username);

    if (!user) {
      alert("User not found. Please sign up.");
      return;
    }

    if (user.password !== password) {
      alert("Incorrect password");
      return;
    }

    onLogin(user);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f2f2f7", // iOS gray background
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "30px 25px",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
          width: "320px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontWeight: 600,
            fontSize: "1.4rem",
            marginBottom: "20px",
            color: "#111",
          }}
        >
          Login
        </h2>

        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 15px",
            margin: "10px 0",
            border: "1px solid #e0e0e0",
            borderRadius: "12px",
            fontSize: "16px",
            backgroundColor: "#fafafa",
            outline: "none",
          }}
          onFocus={(e) =>
            (e.target.style.boxShadow = "0 0 0 3px rgba(0,122,255,0.2)")
          }
          onBlur={(e) => (e.target.style.boxShadow = "none")}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 15px",
            margin: "10px 0",
            border: "1px solid #e0e0e0",
            borderRadius: "12px",
            fontSize: "16px",
            backgroundColor: "#fafafa",
            outline: "none",
          }}
          onFocus={(e) =>
            (e.target.style.boxShadow = "0 0 0 3px rgba(0,122,255,0.2)")
          }
          onBlur={(e) => (e.target.style.boxShadow = "none")}
        />

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "15px",
            background: "#007aff",
            border: "none",
            borderRadius: "25px",
            color: "#fff",
            fontSize: "16px",
            fontWeight: 500,
            cursor: "pointer",
          }}
          onMouseOver={(e) => (e.target.style.background = "#0066d6")}
          onMouseOut={(e) => (e.target.style.background = "#007aff")}
        >
          Login
        </button>

        <p
          style={{
            marginTop: "15px",
            fontSize: "14px",
            color: "#555",
          }}
        >
          Don’t have an account?{" "}
          <span
            style={{ color: "#007aff", cursor: "pointer", fontWeight: 500 }}
            onClick={onSignup}
            onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
            onMouseOut={(e) => (e.target.style.textDecoration = "none")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
