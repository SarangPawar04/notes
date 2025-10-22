import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Signup from "./Signup";
import Login from "./Login";
import UploadNote from "./UploadNote";
import Dashboard from "./Dashboard";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Whenever token changes, update localStorage
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  // Logout handler
  const handleLogout = () => {
    setToken(null);
  };

  return (
    <Router>
      <div style={{ padding: "20px" }}>
        <h1>NoteGram Auth Test</h1>
        <nav style={{ marginBottom: "15px" }}>
          {!token ? (
            <>
              <Link to="/signup" style={{ marginRight: "10px" }}>Signup</Link>
              <Link to="/login">Login</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" style={{ marginRight: "10px" }}>Dashboard</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </nav>

        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/upload" element={ <UploadNote />} />
          <Route
            path="/dashboard"
            element={token ? <Dashboard token={token} /> : <Navigate to="/login" />}
          />
          <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
