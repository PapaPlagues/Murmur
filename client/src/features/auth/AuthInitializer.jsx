import { useEffect } from "react";
import useAuthStore from "@/stores/authStore";

const AuthInitializer = ({children}) => {
    const getCurrentUser = useAuthStore((state) => state.getCurrentUser);

    useEffect(() => {
        getCurrentUser();
    }, [getCurrentUser]);

    return children;
};


export default AuthInitializer;