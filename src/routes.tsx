import { Navigate, type RouteObject } from "react-router";
import AppLayout from "./components/AppLayout";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

const routes = (isAuth: boolean): RouteObject[] => [
  {
    path: "/",
    element: isAuth ? <AppLayout /> : <Navigate to="/sign-in" />,
    children: [
      { index: true, element: <Home /> },
      { path: "/users/:userId", element: <Profile /> },
      { path: "/users/:userId/replies", element: <Profile /> },
      { path: "/users/:userId/reposts", element: <Profile /> },
    ],
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
