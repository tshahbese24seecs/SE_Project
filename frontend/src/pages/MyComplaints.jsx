import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { complaints } from "../api";

export default function MyComplaints() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await complaints.my();
        setItems(res.data || []);
      } catch (err) {
        setError(err.error || err.message || JSON.stringify(err));
      }
    }
    load();
  }, []);

  return (
    <div className="card">
      <h2>My Complaints</h2>
      {error && <div className="error">{error}</div>}
      {items.length === 0 && <div>No complaints found.</div>}
      <ul className="list">
        {items.map((c) => (
          <li key={c._id}>
            <Link to={`/complaint/${c._id}`}>{c.title}</Link>
            <div className="meta">{c.category} — {c.location} — {c.status || 'N/A'}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
