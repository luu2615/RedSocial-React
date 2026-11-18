import { useEffect, useState } from "react";
import { getPosts, getTags } from "../services/postService";
import PostCard from "../components/PostCard";
import type { Post, Tag } from "../types/Post";

export default function PaginaHome() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getPosts(), getTags()])
      .then(([postsData, tagsData]) => {
        setPosts(postsData);
        setTags(tagsData);
      })
      .catch(() => setError("No se pudieron cargar las publicaciones"))
      .finally(() => setCargando(false));
  }, []);

  return (
    <>
      <div className="bg-primary text-white py-5">
        <div className="container text-center">
          <h1 className="display-4 fw-bold">UnaHur Anti-Social Net</h1>
          <p className="lead">
            La red social donde nadie quiere hablar con nadie.
          </p>
        </div>
      </div>

      <div className="container py-4">
        <div className="row">
          <div className="col-lg-8">
            <h2 className="mb-3">📰 Publicaciones recientes</h2>

            {cargando && <p>Cargando publicaciones...</p>}
            {error && <div className="alert alert-danger">{error}</div>}

            {!cargando && !error && posts.length === 0 && (
              <div className="alert alert-info">
                No hay publicaciones todavía.
              </div>
            )}

            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          <div className="col-lg-4">
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h5 className="card-title">Sobre nosotros</h5>
                <p className="card-text">
                  <strong>UnaHur Anti-Social Net</strong> es la red social
                  oficial de la Universidad Nacional de Hurlingham para quienes
                  prefieren postear antes que socializar.
                </p>
                <p className="card-text text-muted">
                  Proyecto desarrollado para la materia Construcción de
                  Interfaces de Usuario.
                </p>
              </div>
            </div>
            {tags.length > 0 && (
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">🏷️ Etiquetas</h5>
                  <div className="d-flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span key={tag.id} className="badge bg-secondary">
                        #{tag.name}
                      </span>
                    ))}
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
