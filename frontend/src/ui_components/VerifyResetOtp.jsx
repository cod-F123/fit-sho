import api from "../service/api";
import { useContext,useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { AlertContext } from "../contexts/AlertContext";
import Input from "../ui_components/Input";
import { useNavigate } from "react-router-dom";

function VerifyResetOtp({setStateProgress}) {
    const [isLoading,setIsLoading] = useState(false);

    const {user} = useContext(AuthContext);
    const {setAlert} = useContext(AlertContext);

    const navigate = useNavigate();

    const [text,setText] = useState("");

    const submitOnClick = ()=>{
        setIsLoading(true);
        api.post("/accounts/reset/verify-otp/",{code:text,phone:user ? user.phone : localStorage.getItem("phone")}).then((res)=>{
            setAlert(res.data.message);
            localStorage.setItem("SOP","cPass");
            setStateProgress("cPass");
        }).catch((error)=>{
            setAlert(error.response.data.message ? error.response.data.message : "کد اشتباه است");
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
                    <div className="w-6/7 md:w-2/5 lg:w-1/4 p-4 pt-22 rounded-lg rounded-t-full border border-gray-300 bg-gray-100 shadow">
                        <p
                            className="text-center text-md  font-bold mb-16"
                            dir="rtl"
                        >
                            ویرایش رمزعبور
                        </p>

                        <p className="mb-12 text-right font-sm font-medium text-gray-400">
                            کد تایید، که به شماره موبایل شما ارسال شده است را
                            وارد نمایید. امکان دارد ارسال کد به موبایل شما با
                            توجه به شلوغی اپراتور تا چند دقیقه زمان ببرد.
                        </p>

                        <Input
                            name={"code"}
                            label={"کد تائید ارسالی *"}
                            type={"text"}
                            onChange={(e)=>{
                                setText(e.target.value);
                            }}
                            maxLength={6}
                        />

                        <button
                            onClick={()=>{localStorage.setItem("SOP","sendOtp");navigate("/accounts")}}
                            className="w-full disabled:cursor-none py-3 cursor-pointer bg-black rounded-md text-white mt-5"
                        >
                           بازگشت
                        </button>

                        <button
                            onClick={submitOnClick}
                            className="w-full cursor-pointer rounded-md flex items-center justify-center mt-4 py-2 bg-green-600 text-white"
                        >
                            تائید
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default VerifyResetOtp;
