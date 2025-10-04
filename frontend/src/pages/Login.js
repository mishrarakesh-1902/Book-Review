import React, { useState } from "react";
import axios from "axios";
import { API_BASE } from "../config";
import { setToken } from "../utils";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, form);
      setToken(res.data.token);
      navigate("/");
    } catch (e) {
      setErr(e.response?.data?.message || "Invalid credentials!");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow-lg p-4 rounded-4" style={{ width: "400px" }}>
        <div className="text-center mb-4">
          <h3 className="fw-bold">Welcome Back 👋</h3>
          <p className="text-muted">Login to continue exploring books 📚</p>
        </div>

        {err && <div className="alert alert-danger">{err}</div>}

        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control rounded-3"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control rounded-3"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button
            className="btn btn-success w-100 py-2 rounded-3 fw-bold shadow-sm"
            type="submit"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-3">
          <small className="text-muted">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-decoration-none fw-semibold">
              Sign up here
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}
