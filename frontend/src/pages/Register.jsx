import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../api";
 
export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "citizen",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await auth.signup(form);
      navigate("/my");
    } catch (err) {
      setError((err.errors && err.errors.map((x) => x.msg).join(", ")) || err.error || err.message);
    }
  };

  return (
    <div className="card">
      <h2>Register</h2>
      <p className="meta">Create your account to submit and track complaints.</p>
      <form onSubmit={submit}>
        <label>First Name</label>
        <input name="firstName" value={form.firstName} onChange={handle} />
        <label>Last Name</label>
        <input name="lastName" value={form.lastName} onChange={handle} />
        <label>Email</label>
        <input name="email" value={form.email} onChange={handle} />
        <label>Password</label>
        <input type="password" name="password" value={form.password} onChange={handle} />
        <label>Confirm Password</label>
        <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handle} />
        <label>Role</label>
        <select name="role" value={form.role} onChange={handle}>
          <option value="citizen">Citizen</option>
          <option value="administration">Administration</option>
        </select>
        {error && <div className="error">{error}</div>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
