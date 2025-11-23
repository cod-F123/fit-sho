import api from "../service/api";
import Input from "./Input";
import { useState,useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { AlertContext } from "./AppLayout";
import { useNavigate } from "react-router-dom";

function ResetPassword({setStateProgress}) {

    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState("");
    const {user} = useContext(AuthContext);
    const {setAlert} = useContext(AlertContext);
    const navigate = useNavigate();

    const onChangeInput = (e)=>{
        setPassword(e.target.value);
    }

    const onClickButton = ()=>{
        setIsLoading(true);
        api.post("/accounts/reset/set-new-pass/",{new_password:password,phone:user ? user.phone : localStorage.getItem("phone")}).then((res)=>{
            setStateProgress("sendOtp");
            localStorage.setItem("SOP","sendOtp");
            navigate("/accounts");
            setAlert(res.data.message);
        }).catch((error)=>{
            setAlert(error.response.data.message ? error.response.data.message : "کد نامعتبر است")
        }).finally(()=>{
            setIsLoading(false);
        })
    }

    return (
        <>
            {isLoading ? (
                <>
                    <div className="w-full top-0 bottom-0 absolute z-50 flex bg-gray-100 justify-center items-center">
                        <span class="loader"></span>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-screen mx-3 my-4">
                    <div className="w-6/7 login-form md:w-2/5 lg:w-1/4 p-4 pt-22 rounded-lg rounded-t-full border border-gray-300 bg-gray-100 shadow">
                        <p
                            className="text-center text-md  font-bold mb-24"
                            dir="rtl"
                        >
                            ویرایش رمز عبور
                        </p>
                        
                        <Input
                            name={"new_password"}
                            onChange={onChangeInput}
                            label={"رمزعبورجدید*"}
                            type={"password"}
                        />
                        
                        <button
                            onClick={()=>{localStorage.setItem("SOP","sendOtp");setStateProgress("sendOtp")}}
                            className="w-full rounded-md cursor-pointer flex py-2 mt-4 transition-all duration-150  items-center hover:outline hover:outline-red-600 hover:bg-white hover:text-red-600 justify-center bg-red-600 text-white "
                        >
                           لغو
                        </button>
                        <button
                            onClick={onClickButton}
                            className="w-full rounded-md cursor-pointer flex py-2 mt-4 transition-all duration-150  items-center hover:outline hover:outline-blue-600 hover:bg-white hover:text-blue-600 justify-center bg-blue-600 text-white "
                        >
                           ویرایش
                        </button>
                        
                    </div>
                </div>
            )}
        </>
    );
};

export default ResetPassword;
