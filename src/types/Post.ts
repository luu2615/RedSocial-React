import type { User } from "./User";

export interface Tag {
  id: number;
  name: string;
}

export interface Post {
  id: number;
  description: string;
  UserId: number;
  User?: User;
  Tags?: Tag[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Comentario {
  id: number;
  content: string;
  UserId: number;
  PostId: number;
  User?: User;
  createdAt?: string;
  updatedAt?: string;
}

export interface PostImage {
  id: number;
  url: string;
  PostId: number;
}
