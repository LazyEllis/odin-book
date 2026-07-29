import type { RouteObject } from "react-router";
import App from "./pages/App";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
  },
];

export default routes;
