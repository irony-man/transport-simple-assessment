import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const isLogged = localStorage.getItem('isLogged') === 'true';

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
            <ul className="navbar-nav align-items-center gap-3 ms-auto mb-2 mb-lg-0 mt-4 mt-md-0">
              <li className="nav-item">
                <Link className="fw-medium" to="/your-questions">
                  Your Questions
                </Link>
              </li>
              <li className="nav-item">
                <Link className="fw-medium" to="/your-answers">
                  Your Answers
                </Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-outline-primary" to="/new">
                  Ask Question
                </Link>
              </li>
              <li className="nav-item">
                <a className="btn btn-primary" href="/logout/">
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
