import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-0">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold">
          🌐 Anti-Social Net
        </Link>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <Link to="/" className="btn btn-outline-light btn-sm">
            Inicio
          </Link>
          <Link to="/create-post" className="btn btn-success btn-sm">
            + Crear publicación
          </Link>
          <Link to="/profile" className="text-light text-decoration-none ms-2">
            <strong>@{user?.nickName}</strong>
          </Link>
          <Link to="/profile" className="btn btn-outline-info btn-sm">
            Mi Perfil
          </Link>
          <button className="btn btn-outline-danger btn-sm" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
}
