import React, { useState } from "react";
import { addUser, getUserByUsername, getUserByMobile } from "./db";

function Signup({ onBackToLogin }) {
  const [mobile, setMobile] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    if (!mobile || !username || !password) {
      alert("Fill all fields");
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      alert("Mobile number must be exactly 10 digits");
      return;
    }

    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      alert("Username already exists. Choose another.");
      return;
    }

    const existingMobile = await getUserByMobile(mobile);
    if (existingMobile) {
      alert("Mobile number already used. Try another.");
      return;
    }

    await addUser({ username, password, mobile });
    alert("Account created successfully! Please login.");
    onBackToLogin();
  };

  return (
    <>
      <style>
        {`
          .card {
            background: #fff;
            padding: 20px;
            max-width: 350px;
            margin: 50px auto;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            text-align: center;
          }
          .card h2 {
            margin-bottom: 20px;
            color: #333;
          }
          .card input {
            display: block;
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 14px;
          }
          .card button {
            padding: 10px 15px;
            background: #0078d7;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            margin-top: 10px;
            width: 100%;
            font-size: 14px;
          }
          .card button:hover {
            background: #005ea6;
          }
          .card p {
            margin-top: 15px;
            font-size: 14px;
            color: #555;
          }
          .link {
            color: #0078d7;
            cursor: pointer;
            text-decoration: underline;
          }
        `}
      </style>

      <div className="card">
        <h2>Sign Up</h2>
        <input
          type="text"
          placeholder="Enter Mobile (10 digits)"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
        <input
          type="text"
          placeholder="Choose Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSignup}>Create Account</button>
        <p>
          Already have an account?{" "}
          <span className="link" onClick={onBackToLogin}>
            Login
          </span>
        </p>
      </div>
    </>
  );
}

export default Signup;
