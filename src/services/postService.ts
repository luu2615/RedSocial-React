import type { Post, Comentario, PostImage, Tag } from "../types/Post";

const API_BASE = "http://localhost:3001";

export async function getPosts(): Promise<Post[]> {
  const res = await fetch(`${API_BASE}/posts`);
  if (!res.ok) throw new Error("Error al obtener publicaciones");
  return res.json();
}

export async function getPostById(id: number): Promise<Post> {
  const res = await fetch(`${API_BASE}/posts/${id}`);
  if (!res.ok) throw new Error("Error al obtener la publicación");
  return res.json();
}

export async function getPostsByUserId(userId: number): Promise<Post[]> {
  const res = await fetch(`${API_BASE}/posts?userId=${userId}`);
  if (!res.ok) throw new Error("Error al obtener publicaciones del usuario");
  return res.json();
}

export async function createPost(post: {
  description: string;
  userId: number;
  tagIds?: number[];
  tags?: number[];
}): Promise<Post> {
  const payload = {
    ...post,
    tags: post.tags ?? post.tagIds,
    tagIds: post.tagIds ?? post.tags,
  };
  const res = await fetch(`${API_BASE}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Error al crear la publicación");
  return res.json();
}

export async function getCommentsByPostId(postId: number): Promise<Comentario[]> {
  const res = await fetch(`${API_BASE}/comments/post/${postId}`);
  if (!res.ok) throw new Error("Error al obtener comentarios");
  return res.json();
}

export async function createComment(comment: {
  content: string;
  userId: number;
  postId: number;
}): Promise<Comentario> {
  const res = await fetch(`${API_BASE}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(comment),
  });
  if (!res.ok) throw new Error("Error al crear el comentario");
  return res.json();
}

export async function getImagesByPostId(postId: number): Promise<PostImage[]> {
  const res = await fetch(`${API_BASE}/postimages/post/${postId}`);
  if (!res.ok) throw new Error("Error al obtener imágenes");
  return res.json();
}

export async function createPostImage(image: {
  url: string;
  postId: number;
}): Promise<PostImage> {
  const res = await fetch(`${API_BASE}/postimages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(image),
  });
  if (!res.ok) throw new Error("Error al asociar la imagen");
  return res.json();
}

export async function getTags(): Promise<Tag[]> {
  const res = await fetch(`${API_BASE}/tags`);
  if (!res.ok) throw new Error("Error al obtener etiquetas");
  return res.json();
}
