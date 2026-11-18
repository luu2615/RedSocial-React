import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getTags, createPost, createPostImage } from "../services/postService";
import type { Tag } from "../types/Post";

export default function PaginaCrearPost() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [imagenesUrls, setImagenesUrls] = useState<string[]>([""]);
  const [tagsDisponibles, setTagsDisponibles] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTags()
      .then(setTagsDisponibles)
      .catch(() => { });
  }, []);

  const handleImageUrlChange = (index: number, valor: string) => {
    const copia = [...imagenesUrls];
    copia[index] = valor;
    setImagenesUrls(copia);
  };

  const handleAgregarCampoImagen = () => {
    setImagenesUrls([...imagenesUrls, ""]);
  };

  const handleEliminarCampoImagen = (index: number) => {
    if (imagenesUrls.length === 1) {
      setImagenesUrls([""]);
      return;
    }
    setImagenesUrls(imagenesUrls.filter((_, i) => i !== index));
  };

  const handleTagToggle = (tagId: number) => {
    if (selectedTagIds.includes(tagId)) {
      setSelectedTagIds(selectedTagIds.filter((id) => id !== tagId));
    } else {
      setSelectedTagIds([...selectedTagIds, tagId]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!description.trim()) {
      setError("La descripción es obligatoria");
      return;
    }

    if (!user) {
      setError("Debes iniciar sesión");
      return;
    }

    setEnviando(true);

    try {
      const nuevoPost = await createPost({
        description: description.trim(),
        userId: user.id,
        tagIds: selectedTagIds,
      });

      const urlsValidas = imagenesUrls
        .map((u) => u.trim())
        .filter((u) => u.length > 0);

      if (urlsValidas.length > 0) {
        await Promise.all(
          urlsValidas.map((url) =>
            createPostImage({
              url,
              postId: nuevoPost.id,
            })
          )
        );
      }

      navigate("/profile");
    } catch {
      setError("Ocurrió un error al crear la publicación");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="card-title mb-4">Crear Nueva Publicación</h2>

              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label fw-bold">
                    Descripción <span className="text-danger">*</span>
                  </label>
                  <textarea
                    id="description"
                    className="form-control"
                    rows={4}
                    placeholder="¿Qué estás pensando?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold d-flex justify-content-between align-items-center">
                    <span>URLs de imágenes (opcional)</span>
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={handleAgregarCampoImagen}
                    >
                      + Agregar otra imagen
                    </button>
                  </label>

                  {imagenesUrls.map((url, index) => (
                    <div key={index} className="input-group mb-2">
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://ejemplo.com/imagen.jpg"
                        value={url}
                        onChange={(e) =>
                          handleImageUrlChange(index, e.target.value)
                        }
                      />
                      {imagenesUrls.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => handleEliminarCampoImagen(index)}
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold">Etiquetas</label>
                  {tagsDisponibles.length === 0 ? (
                    <p className="text-muted small">
                      No hay etiquetas disponibles.
                    </p>
                  ) : (
                    <div className="d-flex flex-wrap gap-2">
                      {tagsDisponibles.map((tag) => {
                        const seleccionada = selectedTagIds.includes(tag.id);
                        return (
                          <button
                            type="button"
                            key={tag.id}
                            className={`btn btn-sm ${seleccionada
                                ? "btn-primary"
                                : "btn-outline-secondary"
                              }`}
                            onClick={() => handleTagToggle(tag.id)}
                          >
                            #{tag.name} {seleccionada && "✓"}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate(-1)}
                    disabled={enviando}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={enviando || !description.trim()}
                  >
                    {enviando ? "Publicando..." : "Publicar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
