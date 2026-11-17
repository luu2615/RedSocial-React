import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserByNickName } from "../services/userService";

const PASSWORD = "123456";

export default function PaginaLogin() {
  const [nickName, setNickName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const nickLimpio = nickName.trim();
    if (!nickLimpio) {
      setError("Por favor ingresa tu nickname");
      return;
    }

    if (password !== PASSWORD) {
      setError("Contraseña incorrecta (recuerda que es 123456)");
      return;
    }

    setCargando(true);
    try {
      const user = await getUserByNickName(nickLimpio);
      if (!user) {
        setError("El usuario no existe. ¿Deseas registrarte?");
        return;
      }

      login(user);
      navigate("/");
    } catch {
      setError("Error al conectar con el servidor");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 450, marginTop: 80, marginBottom: 80 }}>
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <h1 className="h3 fw-bold">UnaHur Anti-Social Net</h1>
            <p className="text-muted">Iniciar sesión</p>
          </div>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="nickName" className="form-label fw-semibold">
                Nickname <span className="text-danger">*</span>
              </label>
              <input
                id="nickName"
                type="text"
                className="form-control"
                value={nickName}
                onChange={(e) => setNickName(e.target.value)}
                autoComplete="off"
                placeholder="Ingresá tu nickname"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-semibold">
                Contraseña <span className="text-danger">*</span>
              </label>
              <input
                id="password"
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresá tu contraseña"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 mt-2"
              disabled={cargando}
            >
              {cargando ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          <hr className="my-4" />

          <div className="text-center">
            <span className="text-muted me-2">¿No tenés una cuenta?</span>
            <Link to="/register" className="text-decoration-none fw-semibold">
              Registrate aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
