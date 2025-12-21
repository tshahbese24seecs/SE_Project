import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="header">
      <div className="brand">Citizen Complaint Portal</div>
      <nav>
        <Link to="/new">New Complaint</Link>
        <Link to="/my">My Complaints</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </nav>
    </header>
  );
}
