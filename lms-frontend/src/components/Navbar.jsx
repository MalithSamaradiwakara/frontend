import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Navbar() {
  const navigate = useNavigate();
  const userType = localStorage.getItem('userType');
  const userId = localStorage.getItem('userId');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const navLinks = {
    "My Profile": `/myprofile/${userId}`,
    "Courses": "/courses",
    "Tutors": "/tutors",
    "My Courses": "/my-courses",
    "Support": "/support"
  };

  return (
    <nav className="bg-white navbar navbar-expand-lg navbar-light shadow-sm">
      <div className="container-fluid">
        <Link
          className="navbar-brand text-primary"
          to="/"
          style={{ fontSize: "2rem", fontWeight: "bold" }}
        >
          Brightway
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="mx-auto mb-2 navbar-nav mb-lg-0">
            {Object.keys(navLinks).map((item, index) => (
              <li className="nav-item" key={index}>
                <Link
                  className="nav-link text-primary"
                  to={navLinks[item]}
                  style={{
                    fontWeight: "bold",
                    transition: "font-size 0.2s ease-in-out",
                  }}
                  onMouseEnter={(e) => (e.target.style.fontSize = "1.2rem")}
                  onMouseLeave={(e) => (e.target.style.fontSize = "1rem")}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
          <div className="d-flex align-items-center">
            {!userType ? (
              <>
                <Link className="btn btn-outline-primary fw-bold me-3" to="/login">
                  Log In
                </Link>
                <Link className="btn btn-primary fw-bold me-3" to="/register">
                  Get Started
                </Link>
              </>
            ) : (
              <button
                className="btn btn-outline-danger fw-bold"
                onClick={handleLogout}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
