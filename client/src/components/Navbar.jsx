import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isHod, setIsHod] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // Check user role and details on component mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        // Decode the JWT payload
        const payload = JSON.parse(atob(token.split(".")[1]));

        // Safely check if the user has HOD privileges
        setIsHod(payload.isHod === true || payload.role === "admin");

        // Extract the user's email (or name) to display in the navbar
        setUserEmail(payload.email || "Active User");
      } catch (err) {
        console.error("Failed to decode token", err);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout", {});
      localStorage.removeItem("accessToken");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top">
      <div className="container">
        {/* Update this block in Navbar.jsx */}
        <Link
          className="navbar-brand fw-bold d-flex align-items-center gap-2"
          to="/dashboard"
        >
          <i className="bi bi-box-seam"></i> Inventory Manager
        </Link>

        <button
          className="navbar-toggler border-0 focus-ring"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#topNavBar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="topNavBar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
            <li className="nav-item">
              <Link
                className={`nav-link fw-medium px-3 ${
                  location.pathname === "/inward-register"
                    ? "active bg-white bg-opacity-10 rounded"
                    : ""
                }`}
                to="/inward-register"
              >
                Inward Register
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link fw-medium px-3 ${
                  location.pathname === "/spp-master"
                    ? "active bg-white bg-opacity-10 rounded"
                    : ""
                }`}
                to="/spp-master"
              >
                SPP Master
              </Link>
            </li>

            {/* Conditionally render the HOD Approvals tab */}
            {isHod && (
              <li className="nav-item">
                <Link
                  className={`nav-link fw-medium px-3 ${
                    location.pathname === "/hod-dashboard"
                      ? "active bg-white bg-opacity-10 rounded"
                      : ""
                  }`}
                  to="/hod-dashboard"
                >
                  HOD Approvals
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
            {/* Dynamically display the logged-in user's email */}
            <span className="text-white-50 small fw-medium">{userEmail}</span>
            <button
              onClick={handleLogout}
              className="btn btn-light btn-sm fw-bold text-primary px-3 shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
