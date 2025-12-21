import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await auth.login({ email, password });
      navigate("/my");
    } catch (err) {
      setError(err.error || err.message || JSON.stringify(err));
    }
  };

  return (
    <div className="card">
      <h2>Login</h2>
      <form onSubmit={submit}>
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div className="error">{error}</div>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
