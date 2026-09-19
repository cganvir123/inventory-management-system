import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Cleaned up the API call since baseURL is handled by axiosInstance
      await axiosInstance.post("/auth/register", {
        name,
        email,
        password,
      });
      // On success, redirect back to the shiny new login page
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow-lg border-0 rounded-lg"
        style={{ width: "420px" }}
      >
        <div className="card-header bg-white text-center border-0 pt-5 pb-2">
          <h3 className="fw-bold text-primary mb-1">Create Account</h3>
          <p className="text-muted small">
            Register to access the management system
          </p>
        </div>
        <div className="card-body p-4 pt-2">
          {error && (
            <div className="alert alert-danger py-2 small">{error}</div>
          )}
          <form onSubmit={handleRegister}>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="nameInput"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <label htmlFor="nameInput">Full Name</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="emailInput"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="emailInput">Email address</label>
            </div>
            <div className="form-floating mb-4">
              <input
                type="password"
                className="form-control"
                id="passwordInput"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="passwordInput">Password</label>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-bold shadow-sm"
            >
              Register
            </button>
          </form>
          <div className="text-center mt-4">
            <span className="text-muted small">Already have an account? </span>
            <Link
              to="/login"
              className="text-decoration-none fw-semibold small"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
