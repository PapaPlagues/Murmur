import { createBrowserRouter } from "react-router";
import Home from "./routes/Home.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
]);

export default router;