import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../api";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.logout();
    } catch (err) {
      console.error("Logout error", err);
    }
    navigate("/login", { replace: true });
  };

  return (
    <header className="header">
      <div className="brand">Citizen Complaint Portal</div>
      <nav className="nav">
        <Link to="/">Dashboard</Link>
        <Link to="/new">New Complaint</Link>
        <Link to="/my">My Complaints</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <button type="button" onClick={handleLogout}>Logout</button>
      </nav>
    </header>
  );
}
