import { useState,useContext,useEffect } from "react";
import { useNavigate,Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";


function Account(){
    const {user} = useContext(AuthContext);
    const navigate = useNavigate()

    useEffect(()=>{
        if(user["is_validate"] != true){
            navigate("/accounts/validate");
        }
    },[])


    return <>
        <div className="h-screen">accounts</div>
    </>
};


export default Account;