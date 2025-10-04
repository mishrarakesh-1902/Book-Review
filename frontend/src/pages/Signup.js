import React, { useState } from "react";
import axios from "axios";
import { API_BASE } from "../config";
import { setToken } from "../utils";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const res = await axios.post(`${API_BASE}/auth/signup`, form);
      setToken(res.data.token);
      navigate("/");
    } catch (e) {
      setErr(e.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow-lg p-4 rounded-4" style={{ width: "400px" }}>
        <div className="text-center mb-4">
          <h3 className="fw-bold">Create an Account</h3>
          <p className="text-muted">Join us and start exploring books 📚</p>
        </div>

        {err && <div className="alert alert-danger">{err}</div>}

        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              className="form-control rounded-3"
              placeholder="Enter your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

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
            className="btn btn-primary w-100 py-2 rounded-3 fw-bold shadow-sm"
            type="submit"
          >
            Sign Up
          </button>
        </form>

        <div className="text-center mt-3">
          <small className="text-muted">
            Already have an account?{" "}
            <Link to="/login" className="text-decoration-none fw-semibold">
              Login here
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}
