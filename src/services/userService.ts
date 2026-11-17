const API_BASE = "http://localhost:3001";

import type { User } from "../types/User";

export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${API_BASE}/users`);
  if (!response.ok) {
    throw new Error("Error al obtener los usuarios");
  }
  return response.json();
}

export async function getUserByNickName(
  nickName: string
): Promise<User | undefined> {
  const users = await getUsers();
  return users.find(
    (u) => u.nickName.toLowerCase() === nickName.toLowerCase()
  );
}

export async function createUser(data: {
  nickName: string;
  email: string;
}): Promise<User> {
  const response = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || "Error al crear el usuario");
  }
  return response.json();
}
