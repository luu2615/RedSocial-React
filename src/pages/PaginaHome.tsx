import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPosts, getTags } from "../services/postService";
import PostCard from "../components/PostCard";
import type { Post, Tag } from "../types/Post";

export default function PaginaHome() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [tagSeleccionada, setTagSeleccionada] = useState<Tag | null>(null);
  const [postAleatorio, setPostAleatorio] = useState<Post | null>(null);
  const [mostrarAleatorio, setMostrarAleatorio] = useState(false);

  useEffect(() => {
    Promise.all([getPosts(), getTags()])
      .then(([postsData, tagsData]) => {
        setPosts(postsData);
        setTags(tagsData);
        if (postsData.length > 0) {
          const randomIndex = Math.floor(Math.random() * postsData.length);
          setPostAleatorio(postsData[randomIndex]);
        }
      })
      .catch(() => setError("No se pudieron cargar las publicaciones"))
      .finally(() => setCargando(false));
  }, []);

  const handleSeleccionarAleatorio = () => {
    if (posts.length === 0) return;
    const randomIndex = Math.floor(Math.random() * posts.length);
    setPostAleatorio(posts[randomIndex]);
    setMostrarAleatorio(true);
  };

  const postsFiltrados = tagSeleccionada
    ? posts.filter((p) => p.Tags?.some((t) => t.id === tagSeleccionada.id))
    : posts;

  return (
    <>
      <div className="bg-primary text-white py-5">
        <div className="container text-center fade-in">
          <h1 className="display-4 fw-bold">UnaHur Anti-Social Net</h1>
          <p className="lead mb-4">
            La red social donde nadie quiere hablar.
          </p>
          {posts.length > 0 && (
            <button
              className="btn btn-warning fw-semibold shadow-sm"
              onClick={handleSeleccionarAleatorio}
            >
              <i className="bi bi-arrow-clockwise"></i> Ver publicación aleatoria
            </button>
          )}
        </div>
      </div>

      <div className="container py-4">
        {mostrarAleatorio && postAleatorio && (
          <div className="alert alert-warning alert-dismissible fade-in shadow-sm mb-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <h5 className="alert-heading mb-1"><i className="bi bi-stars me-2"></i> Publicación destacada / aleatoria</h5>
                <p className="mb-0">
                  <strong>@{postAleatorio.User?.nickName ?? "usuario"}</strong>: &ldquo;{postAleatorio.description}&rdquo;
                </p>
              </div>
              <div className="d-flex gap-2">
                <Link
                  to={`/post/${postAleatorio.id}`}
                  className="btn btn-sm btn-dark"
                >
                  Ver detalle
                </Link>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-dark"
                  onClick={handleSeleccionarAleatorio}
                >
                  <i className="bi bi-dice-5-fill"></i>
                </button>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setMostrarAleatorio(false)}
                />
              </div>
            </div>
          </div>
        )}

        <div className="row">
          <div className="col-lg-8">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
              <h2 className="h4 mb-0"><i className="bi bi-newspaper me-2"></i> Publicaciones recientes</h2>
              {tagSeleccionada && (
                <span className="badge bg-primary fs-6 p-2 fade-in">
                  Filtrado por: #{tagSeleccionada.name}{" "}
                  <button
                    className="btn-close btn-close-white ms-2"
                    style={{ fontSize: "0.65rem" }}
                    onClick={() => setTagSeleccionada(null)}
                  />
                </span>
              )}
            </div>

            {tagSeleccionada && (
              <div className="alert alert-info py-2 d-flex justify-content-between align-items-center fade-in mb-3">
                <span>
                  Mostrando publicaciones con etiqueta <strong>#{tagSeleccionada.name}</strong> ({postsFiltrados.length})
                </span>
                <button
                  className="btn btn-outline-primary btn-sm py-0"
                  onClick={() => setTagSeleccionada(null)}
                >
                  Limpiar filtro
                </button>
              </div>
            )}

            {cargando && (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status" />
                <p className="mt-2 text-muted">Cargando publicaciones...</p>
              </div>
            )}

            {error && <div className="alert alert-danger fade-in">{error}</div>}

            {!cargando && !error && postsFiltrados.length === 0 && (
              <div className="alert alert-secondary text-center py-4 fade-in">
                <p className="mb-2">No se encontraron publicaciones con los filtros seleccionados.</p>
                {tagSeleccionada && (
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setTagSeleccionada(null)}
                  >
                    Ver todas las publicaciones
                  </button>
                )}
              </div>
            )}

            <div className="fade-in">
              {postsFiltrados.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card shadow-sm mb-4 card-hover">
              <div className="card-body">
                <h5 className="card-title">Sobre nosotros</h5>
                <p className="card-text">
                  <strong>UnaHur Anti-Social Net</strong> es la red social
                  oficial de la Universidad Nacional de Hurlingham.
                </p>
                <p className="card-text text-muted small">
                  Proyecto desarrollado para la materia Construcción de
                  Interfaces de Usuario.
                </p>
              </div>
            </div>

            {tags.length > 0 && (
              <div className="card shadow-sm card-hover">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="card-title mb-0"><i className="bi bi-tags-fill text-dark me-2"></i> Filtrar por etiquetas</h5>
                    {tagSeleccionada && (
                      <button
                        className="btn btn-link btn-sm text-decoration-none p-0"
                        onClick={() => setTagSeleccionada(null)}
                      >
                        Ver todas
                      </button>
                    )}
                  </div>
                  <p className="text-muted small mb-3">
                    Hacé clic en una etiqueta para filtrar el feed:
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    {tags.map((tag) => {
                      const activa = tagSeleccionada?.id === tag.id;
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          className={`btn btn-sm tag-badge ${activa ? "btn-primary" : "btn-outline-secondary"
                            }`}
                          onClick={() =>
                            setTagSeleccionada(activa ? null : tag)
                          }
                        >
                          #{tag.name} {activa && "✓"}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
