import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../api";

export default function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Ask server for session status
    auth
      .status()
      .then((res) => {
        if (!mounted) return;
        setIsLoggedIn(Boolean(res && res.isLoggedIn));
      })
      .catch((err) => {
        if (!mounted) return;
        console.error("Status check failed", err);
        setIsLoggedIn(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = async () => {
    if (!isLoggedIn) {
      // If user isn't logged in, send them to login page
      navigate("/login", { replace: true });
      return;
    }

    try {
      await auth.logout();
    } catch (err) {
      console.error("Logout error", err);
    }
    setIsLoggedIn(false);
    navigate("/login", { replace: true });
  };

  return (
    <header className="header">
      <div className="brand">Citizen Complaint Portal</div>

      <nav className="nav">
        <div className="nav-center">
          <Link to="/">Dashboard</Link>
          <Link to="/new">New Complaint</Link>
          <Link to="/my">My Complaints</Link>
          {!isLoggedIn && <Link to="/login">Login</Link>}
          {!isLoggedIn && <Link to="/register">Register</Link>}
        </div>

        <div className="nav-right">
          <button type="button" onClick={handleLogout} className="logout">
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}
