import type {
  Credentials,
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
