import { createContext } from "react";

interface Props {
  isAuth: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext({} as Props);
