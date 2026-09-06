import type {
  Credentials,
  PostPublic,
  Token,
  UserCreate,
  UserPublic,
} from "../interfaces/api";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const request = async (endpoint: string, options: RequestInit = {}) => {
  const url = baseURL + endpoint;

  options.headers = {
    "Content-Type": "application/json",
  };

  const token = localStorage.getItem("token");
  if (token) {
    options.headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  const response = await fetch(url, options);

  if (response.status === 204) return;

  const data = await response.json();

  if (!response.ok) throw data.errors ?? data;

  return data;
};

export const generateToken = (credentials: Credentials): Promise<Token> =>
  request("/auth/token", { method: "POST", body: JSON.stringify(credentials) });

export const createUser = (userData: UserCreate): Promise<UserPublic> =>
  request("/users", { method: "POST", body: JSON.stringify(userData) });

export const getUserById = (userId: number): Promise<UserPublic> =>
  request(`/users/${userId}`);

export const getCurrentUser = (): Promise<UserPublic> => request("/users/me");

export const listPosts = (): Promise<PostPublic[]> => request("/posts");

export const repostPost = (postId: number): Promise<void> =>
  request(`/users/me/reposts/${postId}`, { method: "PUT" });

export const unrepostPost = (postId: number): Promise<void> =>
  request(`/users/me/reposts/${postId}`, { method: "DELETE" });

export const likePost = (postId: number): Promise<void> =>
  request(`/users/me/likes/${postId}`, { method: "PUT" });

export const unlikePost = (postId: number): Promise<void> =>
  request(`/users/me/likes/${postId}`, { method: "DELETE" });

export const bookmarkPost = (postId: number): Promise<void> =>
  request(`/users/me/bookmarks/${postId}`, { method: "PUT" });

export const removePostBookmark = (postId: number): Promise<void> =>
  request(`/users/me/bookmarks/${postId}`, { method: "DELETE" });

export const getUserPosts = (userId: number): Promise<PostPublic[]> =>
  request(`/users/${userId}/posts`);
