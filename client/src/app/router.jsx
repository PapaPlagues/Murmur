import { createBrowserRouter } from "react-router";
import Layout from "./Layout.jsx";
import Home from "./routes/Home.jsx";
import Profile from "./routes/Profile.jsx";


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
                element: <Profile />
            }
        ]
    }
]);

export default router;