import type { RouteObject } from "react-router";
import App from "./pages/App";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
];

export default routes;
