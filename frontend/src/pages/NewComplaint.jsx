import React, { useState } from "react";
import { complaints } from "../api";

export default function NewComplaint() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [files, setFiles] = useState(null);
  const [message, setMessage] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("description", description);
      fd.append("category", category);
      fd.append("location", location);
      if (files) {
        Array.from(files).forEach((f) => fd.append("images", f));
      }
      await complaints.register(fd);
      setMessage("Complaint submitted successfully");
      setTitle("");
      setDescription("");
      setCategory("");
      setLocation("");
      setFiles(null);
    } catch (err) {
      setMessage(err.error || err.message || JSON.stringify(err));
    }
  };

  return (
    <div className="card">
      <h2>New Complaint</h2>
      <form onSubmit={submit}>
        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
        <label>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        <label>Category</label>
        <input value={category} onChange={(e) => setCategory(e.target.value)} />
        <label>Location</label>
        <input value={location} onChange={(e) => setLocation(e.target.value)} />
        <label>Images</label>
        <input type="file" multiple onChange={(e) => setFiles(e.target.files)} />
        {message && <div className="message">{message}</div>}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
