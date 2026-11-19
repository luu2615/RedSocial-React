import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Post, PostImage, Comentario } from "../types/Post";
import { getImagesByPostId, getCommentsByPostId } from "../services/postService";

interface Props {
  post: Post;
}

export default function PostCard({ post }: Props) {
  const [imagenes, setImagenes] = useState<PostImage[]>([]);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);

  useEffect(() => {
    getImagesByPostId(post.id)
      .then(setImagenes)
      .catch(() => { });

    getCommentsByPostId(post.id)
      .then(setComentarios)
      .catch(() => { });
  }, [post.id]);

  return (
    <div className="card mb-4 shadow-sm card-hover">
      {imagenes.length > 0 && (
        <img
          src={imagenes[0].url}
          className="card-img-top"
          alt="Imagen de la publicación"
          style={{ maxHeight: 300, objectFit: "cover" }}
        />
      )}

      <div className="card-body">
        {post.User && (
          <h6 className="card-subtitle mb-2 text-muted">@{post.User.nickName}</h6>
        )}

        <p className="card-text">{post.description}</p>

        {post.Tags && post.Tags.length > 0 && (
          <div className="mb-2">
            {post.Tags.map((tag) => (
              <span key={tag.id} className="badge bg-secondary me-1">
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        <p className="text-muted mb-2">
          <i className="bi bi-chat-dots-fill me-1"></i> {comentarios.length} comentario{comentarios.length !== 1 ? "s" : ""}
        </p>

        <Link to={`/post/${post.id}`} className="btn btn-outline-primary btn-sm">
          Ver más
        </Link>
      </div>
    </div>
  );
}
