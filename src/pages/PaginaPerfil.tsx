import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getPostsByUserId, getCommentsByPostId } from "../services/postService";
import type { Post } from "../types/Post";

function PostUsuarioItem({ post }: { post: Post }) {
  const [cantidadComentarios, setCantidadComentarios] = useState(0);

  useEffect(() => {
    getCommentsByPostId(post.id)
      .then((comentarios) => setCantidadComentarios(comentarios.length))
      .catch(() => { });
  }, [post.id]);

  return (
    <div className="card mb-3 shadow-sm card-hover">
      <div className="card-body">
        <p className="card-text fs-5">{post.description}</p>
        <p className="text-muted mb-3">
          <i className="bi bi-chat-dots-fill me-1"></i> {cantidadComentarios} comentario{cantidadComentarios !== 1 ? "s" : ""}
        </p>
        <Link to={`/post/${post.id}`} className="btn btn-outline-primary btn-sm">
          Ver más
        </Link>
      </div>
    </div>
  );
}

export default function PaginaPerfil() {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    getPostsByUserId(user.id)
      .then((data) => setPosts(data))
      .catch(() => setError("No se pudieron cargar tus publicaciones"))
      .finally(() => setCargando(false));
  }, [user]);

  return (
    <div className="container py-4 fade-in">
      <div className="card shadow-sm mb-4 card-hover">
        <div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h2 className="card-title mb-1">Perfil de Usuario</h2>
            <p className="text-muted fs-5 mb-0">
              Nickname: <strong className="text-primary">@{user?.nickName}</strong>
            </p>
            {user?.email && (
              <p className="text-muted mb-0">Email: {user.email}</p>
            )}
          </div>
          <button className="btn btn-danger" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h3 className="mb-3">Mis publicaciones</h3>

          {cargando && (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status" />
              <p className="mt-2 text-muted">Cargando publicaciones...</p>
            </div>
          )}

          {error && <div className="alert alert-danger fade-in">{error}</div>}

          {!cargando && !error && posts.length === 0 && (
            <div className="alert alert-info fade-in">
              Todavía no realizaste ninguna publicación.
            </div>
          )}

          <div className="fade-in">
            {posts.map((post) => (
              <PostUsuarioItem key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
