import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PaginaLogin from "./pages/PaginaLogin";
import PaginaRegistro from "./pages/PaginaRegistro";
import PaginaHome from "./pages/PaginaHome";
import PaginaDetallePost from "./pages/PaginaDetallePost";
import PaginaPerfil from "./pages/PaginaPerfil";
import PaginaCrearPost from "./pages/PaginaCrearPost";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<PaginaLogin />} />
          <Route path="/register" element={<PaginaRegistro />} />
          <Route path="/registro" element={<Navigate to="/register" replace />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<PaginaHome />} />
            <Route path="/post/:id" element={<PaginaDetallePost />} />
            <Route path="/profile" element={<PaginaPerfil />} />
            <Route path="/perfil" element={<Navigate to="/profile" replace />} />
            <Route path="/create-post" element={<PaginaCrearPost />} />
            <Route path="/nuevo-post" element={<Navigate to="/create-post" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
