import { createBrowserRouter } from "react-router";
import Layout from "./Layout.jsx";
import Home from "./routes/Home.jsx";
import Profile from "./routes/Profile.jsx";
import Login from "./routes/Login.jsx";
import Register from "./routes/Register.jsx";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
  {
    element: <Login />,
    path: "/login",
  },
  {
    element: <Register />,
    path: "/register",
  },
]);

export default router;
