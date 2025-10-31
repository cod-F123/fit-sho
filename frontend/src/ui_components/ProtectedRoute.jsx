import { useContext } from "react";
import { Navigate, Outlet, replace } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const ProtectedRoute = () => {
    const { isLogin, isLoading } = useContext(AuthContext);

    if (isLoading) {
        return (
            <>
                <div
                    className="w-full h-screen flex items-center justify-center"
                    dir="rtl"
                >
                    در حال بررسی ورود...
                </div>
            </>
        );
    };


    if (!isLogin){
        return <Navigate to={"/accounts/login"} replace  />
    }


    return <Outlet />
};


export default ProtectedRoute;
