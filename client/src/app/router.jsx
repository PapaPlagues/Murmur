import { createBrowserRouter } from "react-router";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import PublicRoute from "./routes/PublicRoute.jsx";
import Layout from "./Layout.jsx";
import Home from "./routes/Home.jsx";
import Profile from "./routes/Profile.jsx";
import { EditProfile } from "./routes/EditProfile.jsx";
import Login from "./routes/Login.jsx";
import Register from "./routes/Register.jsx";
import NotFound from "./routes/NotFound.jsx";

const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: "/", element: <Home /> },
          { path: "/conversations/:conversationId", element: <Home /> },
          { path: "/profile", element: <Profile /> },
          { path: "/profile/:userId", element: <Profile /> },
          { path: "/profile/edit", element: <EditProfile /> },
        ],
      },
    ],
  },

  {
    element: <PublicRoute />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

export default router;
