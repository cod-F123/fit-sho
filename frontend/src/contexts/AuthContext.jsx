import { createContext, useState, useEffect } from "react";
import api from "../service/api";

export const AuthContext = createContext();

export const AuthProvider = ({children})=>{
    const [user, setUser] = useState(null);
    const [isLogin, setIsLogin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(()=>{
        const token = localStorage.getItem("access");

        if(token){
            api.get("/accounts/",{
                headers : {
                    "Content-Type" : "application/json"
                },
            }).then((res)=>{

                setUser(res.data);
                setIsLogin(true);
                setIsLoading(false);
            }).catch((error)=>{
                setUser(null);
                setIsLogin(false);
                localStorage.removeItem("token");
                setIsLoading(false);

            })
        }else{
            setIsLoading(false);
        }
    }, []);

    const logout = ()=>{
        localStorage.removeItem("token");
        setUser(null);
        setIsLogin(false);
    }


    return <>
        <AuthContext.Provider value={{user,setUser,isLogin,setIsLogin,logout,isLoading}} >
            {/* {isLoading ? children : (
                <div className="w-full h-screen flex items-center justify-center" dir="rtl">
                    در حال بررسی ورود...
                </div>
            )} */}
            {children}
        </AuthContext.Provider>
    </>
}