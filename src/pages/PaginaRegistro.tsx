import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createUser, getUserByNickName } from "../services/userService";

export default function PaginaRegistro() {
  const [nickName, setNickName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const nickLimpio = nickName.trim();
    const emailLimpio = email.trim();

    if (!nickLimpio || !emailLimpio || !password) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (password !== "123456") {
      setError("La contraseña debe ser 123456 (simulación del sistema)");
      return;
    }

    setCargando(true);
    try {
      const existe = await getUserByNickName(nickLimpio);
      if (existe) {
        setError("El nickname ya está en uso, por favor elige otro");
        setCargando(false);
        return;
      }

      const nuevoUsuario = await createUser({
        nickName: nickLimpio,
        email: emailLimpio,
      });

      login(nuevoUsuario);
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al registrar el usuario");
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 450, marginTop: 60, marginBottom: 60 }}>
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <h1 className="h3 fw-bold">UnaHur Anti-Social Net</h1>
            <p className="text-muted">Crear nueva cuenta</p>
          </div>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
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
                placeholder="Ej: juan_perez"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">
                Correo electrónico <span className="text-danger">*</span>
              </label>
              <input
                id="email"
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
                placeholder="nombre@ejemplo.com"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-semibold">
                Contraseña fija <span className="text-danger">*</span>
              </label>
              <input
                id="password"
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresá 123456"
                required
              />
              <div className="form-text">
                Contraseña del sistema para todos los usuarios: <code>123456</code>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 mt-2"
              disabled={cargando}
            >
              {cargando ? "Registrando..." : "Registrarse"}
            </button>
          </form>

          <hr className="my-4" />

          <div className="text-center">
            <span className="text-muted me-2">¿Ya tenés cuenta?</span>
            <Link to="/login" className="text-decoration-none fw-semibold">
              Iniciá sesión aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
