import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getPostById,
  getImagesByPostId,
  getCommentsByPostId,
  createComment,
} from "../services/postService";
import type { Post, PostImage, Comentario } from "../types/Post";

export default function PaginaDetallePost() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [imagenes, setImagenes] = useState<PostImage[]>([]);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [errorComentario, setErrorComentario] = useState<string | null>(null);
  const [exitoComentario, setExitoComentario] = useState(false);

  const postId = Number(id);

  useEffect(() => {
    if (isNaN(postId)) {
      setError("ID de publicación inválido");
      setCargando(false);
      return;
    }

    Promise.all([
      getPostById(postId),
      getImagesByPostId(postId),
      getCommentsByPostId(postId),
    ])
      .then(([postData, imagenesData, comentariosData]) => {
        setPost(postData);
        setImagenes(imagenesData);
        setComentarios(comentariosData);
      })
      .catch(() => setError("No se pudo cargar la publicación"))
      .finally(() => setCargando(false));
  }, [postId]);

  const handleSubmitComentario = async (e: FormEvent) => {
    e.preventDefault();
    setErrorComentario(null);
    setExitoComentario(false);

    const textoLimpio = nuevoComentario.trim();
    if (!textoLimpio) return;
    if (!user) return;

    setEnviando(true);
    try {
      const comentarioCreado = await createComment({
        content: textoLimpio,
        userId: user.id,
        postId,
      });

      const comentarioCompleto: Comentario = {
        ...comentarioCreado,
        User: user,
      };

      setComentarios((prev) => [...prev, comentarioCompleto]);
      setNuevoComentario("");
      setExitoComentario(true);
      setTimeout(() => setExitoComentario(false), 3500);
    } catch {
      setErrorComentario("Error al enviar el comentario");
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-2 text-muted">Cargando publicación...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger fade-in">{error ?? "Publicación no encontrada"}</div>
        <Link to="/" className="btn btn-secondary">
          ← Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4 fade-in">
      <Link to="/" className="btn btn-outline-secondary btn-sm mb-3">
        ← Volver al inicio
      </Link>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm mb-4 card-hover">
            {imagenes.length > 0 && (
              <div className="d-flex flex-column gap-2 p-2">
                {imagenes.map((img) => (
                  <img
                    key={img.id}
                    src={img.url}
                    className="img-fluid rounded"
                    alt="Imagen de la publicación"
                    style={{ maxHeight: 450, objectFit: "contain", width: "100%" }}
                  />
                ))}
              </div>
            )}

            <div className="card-body">
              {post.User && (
                <h6 className="card-subtitle mb-2 text-muted">
                  Publicado por @{post.User.nickName}
                </h6>
              )}

              <p className="card-text fs-5">{post.description}</p>

              {post.Tags && post.Tags.length > 0 && (
                <div className="mt-3">
                  {post.Tags.map((tag) => (
                    <span key={tag.id} className="badge bg-secondary me-1">
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="card shadow-sm card-hover">
            <div className="card-body">
              <h5 className="card-title mb-3">
                <i className="bi bi-chat-dots-fill me-1"></i> Comentarios ({comentarios.length})
              </h5>

              {comentarios.length === 0 ? (
                <p className="text-muted">
                  No hay comentarios visibles todavía. ¡Sé el primero!
                </p>
              ) : (
                <ul className="list-group list-group-flush mb-3">
                  {comentarios.map((c) => (
                    <li key={c.id} className="list-group-item">
                      <strong>@{c.User?.nickName ?? user?.nickName ?? "anónimo"}</strong>
                      <p className="mb-0 mt-1">{c.content}</p>
                    </li>
                  ))}
                </ul>
              )}

              <hr />
              <h6>Agregar un comentario</h6>

              {exitoComentario && (
                <div className="alert alert-success alert-dismissible fade-in py-2">
                  <span><i className="bi bi-check-circle-fill me-2"></i> ¡Comentario publicado con éxito!</span>
                  <button
                    type="button"
                    className="btn-close py-2"
                    onClick={() => setExitoComentario(false)}
                  />
                </div>
              )}

              {errorComentario && (
                <div className="alert alert-danger fade-in py-2">
                  {errorComentario}
                </div>
              )}

                  {user ? (
                    <form onSubmit={handleSubmitComentario}>
                      <div className="mb-2">
                        <textarea
                          className="form-control"
                          rows={3}
                          placeholder="Escribí tu comentario..."
                          value={nuevoComentario}
                          onChange={(e) => setNuevoComentario(e.target.value)}
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary btn-sm"
                        disabled={enviando || !nuevoComentario.trim()}
                      >
                        {enviando ? "Enviando..." : "Comentar"}
                      </button>
                    </form>
                  ) : (
                <div className="alert alert-light border mt-2 py-2">
                  <span className="text-muted">
                    Debés <Link to="/login" className="fw-semibold text-primary">iniciar sesión</Link> para dejar un comentario.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
