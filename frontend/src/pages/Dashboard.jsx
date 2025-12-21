import React, { useEffect, useState } from "react";
import { complaints } from "../api";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await complaints.pending();
        setItems(res.data || []);
      } catch (err) {
        setError(err?.error || err?.message || JSON.stringify(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="card">
      <h2>Pending Complaints</h2>
      <p className="meta">Open issues awaiting action. Click to view details.</p>
      {loading && <div>Loading…</div>}
      {error && <div className="error">{error}</div>}
      {!loading && items.length === 0 && <div>No pending complaints.</div>}
      <ul className="list">
        {items.map((c) => (
          <li key={c._id}>
            <div className="inline-actions" style={{ justifyContent: "space-between", gap: 8, alignItems: "center" }}>
              <div>
                <Link to={`/complaint/${c._id}`}>{c.title}</Link>
                <div className="meta">{c.description?.slice(0, 120) || "No description"}</div>
              </div>
              <div className="inline-actions">
                <span className="tag">{c.category || "General"}</span>
                <span className="tag">{c.location || "Unknown"}</span>
                <span className="tag">Status: {c.status || "Pending"}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
