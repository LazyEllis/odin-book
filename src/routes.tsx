import { Navigate, type RouteObject } from "react-router";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";

const routes = (isAuth: boolean): RouteObject[] => [
  {
    path: "/",
    element: isAuth ? <Home /> : <Navigate to="/sign-in" />,
  },
  {
    path: "/sign-up",
    element: !isAuth ? <SignUp /> : <Navigate to="/" />,
  },
  {
    path: "/sign-in",
    element: !isAuth ? <SignIn /> : <Navigate to="/" />,
  },
];

export default routes;
