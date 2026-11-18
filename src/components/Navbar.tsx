import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark border-bottom border-secondary border-opacity-25 py-2 mb-0">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold d-flex align-items-center gap-2">
          <i className="bi bi-globe2 fs-5"></i>
          <span>Anti-Social Net</span>
        </Link>

        <div className="d-flex align-items-center gap-3">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-link d-flex align-items-center gap-1 px-2 ${
                isActive ? "text-white fw-semibold" : "text-white-50"
              }`
            }
          >
            <i className="bi bi-house-door"></i>
            <span>Inicio</span>
          </NavLink>

          <Link
            to="/create-post"
            className="btn btn-primary btn-sm rounded-pill px-3 d-flex align-items-center gap-1 shadow-sm"
          >
            <i className="bi bi-plus-lg"></i>
            <span>Nuevo Post</span>
          </Link>

          <Link
            to="/profile"
            className="btn btn-outline-light btn-sm rounded-pill px-3 d-flex align-items-center gap-2"
          >
            <i className="bi bi-person-circle"></i>
            <span>@{user?.nickName}</span>
          </Link>

          <button
            type="button"
            className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
            onClick={logout}
          >
            <i className="bi bi-box-arrow-right"></i>
            <span>Salir</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
