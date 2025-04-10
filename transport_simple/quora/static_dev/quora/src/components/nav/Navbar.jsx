import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="bg-white border-bottom shadow-sm mb-5">
      <nav className="container navbar navbar-expand-lg">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold text-primary" to="/">
            Quora
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div id="navbar" className="collapse navbar-collapse">
            <ul className="navbar-nav gap-3 ms-auto mb-2 mb-lg-0 mt-4 mt-md-0">
              <li className="nav-item">
                <Link className="btn btn-outline-primary" to="/login">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-primary" to="/signup">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
