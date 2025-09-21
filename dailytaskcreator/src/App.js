import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Welcome from "./Welcome";

function App() {
  const [currentUser, setCurrentUser] = React.useState(
    () => JSON.parse(localStorage.getItem("currentUser")) || null
  );

  const handleSetUser = (user) => {
    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginWrapper setCurrentUser={handleSetUser} />} />
        <Route path="/signup" element={<SignupWrapper />} />
        <Route
          path="/welcome/*"
          element={<Welcome users={currentUser} onLogout={handleLogout} />}
        />
      </Routes>
    </Router>
  );
}

const LoginWrapper = ({ setCurrentUser }) => {
  const navigate = useNavigate();

  const handleLogin = (user) => {
   
    setCurrentUser(user);
    navigate("/welcome"); // ✅ use navigate, no page reload
  };

  return (
    <Login
      onLogin={handleLogin}
      onSignup={() => navigate("/signup")}
    />
  );
};

const SignupWrapper = () => {
  const navigate = useNavigate();
  return <Signup onBackToLogin={() => navigate("/")} />;
};

export default App;
