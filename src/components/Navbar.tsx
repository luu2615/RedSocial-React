import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary border-opacity-25 py-2 mb-0">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold d-flex align-items-center gap-2" onClick={closeMenu}>
          <i className="bi bi-globe2 fs-5"></i>
          <span>Anti-Social Net</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarContent"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="navbarContent">
          <div className="navbar-nav ms-auto d-flex align-items-lg-center gap-2 mt-3 mt-lg-0">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-1 px-2 ${isActive ? "text-white fw-semibold" : "text-white-50"}`
              }
              onClick={closeMenu}
            >
              <i className="bi bi-house-door"></i>
              <span>Inicio</span>
            </NavLink>

            <Link
              to="/create-post"
              className="btn btn-primary btn-sm rounded-pill px-3 d-flex align-items-center gap-1 shadow-sm"
              onClick={closeMenu}
            >
              <i className="bi bi-plus-lg"></i>
              <span>Nuevo Post</span>
            </Link>

            <Link
              to="/profile"
              className="btn btn-outline-light btn-sm rounded-pill px-3 d-flex align-items-center gap-2"
              onClick={closeMenu}
            >
              <i className="bi bi-person-circle"></i>
              <span>{user?.nickName}</span>
            </Link>

            <button
              type="button"
              className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
              onClick={() => { closeMenu(); logout(); }}
            >
              <i className="bi bi-box-arrow-right"></i>
              <span>Salir</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
