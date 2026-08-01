import { createContext } from "react";

interface IContextProps {
  isAuth: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext({} as IContextProps);
