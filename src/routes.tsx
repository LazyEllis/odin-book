import { Navigate, type RouteObject } from "react-router";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import DashboardLayout from "./components/layout/DashboardLayout";
import Home from "./pages/Home";

const routes = (isAuth: boolean): RouteObject[] => [
  {
    path: "/",
    element: isAuth ? <DashboardLayout /> : <Navigate to="/sign-in" />,
    children: [{ index: true, element: <Home /> }],
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
