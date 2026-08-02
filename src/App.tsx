import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContext } from "./contexts/AuthContext";
import routes from "./routes";

const queryClient = new QueryClient();

const token = localStorage.getItem("token");

const App = () => {
  const [isAuth, setIsAuth] = useState(!!token);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setIsAuth(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
  };

  const router = createBrowserRouter(routes(isAuth));

  return (
    <AuthContext value={{ isAuth, login, logout }}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AuthContext>
  );
};

export default App;
