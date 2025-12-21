import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { complaints } from "../api";

export default function ComplaintDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await complaints.details(id);
        setItem(res.data);
      } catch (err) {
        setError(err.error || err.message || JSON.stringify(err));
      }
    }
    load();
  }, [id]);

  if (error) return <div className="card error">{error}</div>;
  if (!item) return <div className="card">Loading...</div>;

  return (
    <div className="card">
      <h2>{item.title}</h2>
      <div className="meta">{item.category} — {item.location}</div>
      <p>{item.description}</p>
      <div className="images">
        {item.images && item.images.map((img, i) => (
          <img key={i} src={"http://localhost:3000" + img.url} alt="complaint" />
        ))}
      </div>
      <div>Status: {item.status || 'N/A'}</div>
    </div>
  );
}
