import api from "../service/api";
import AccountSidebar from "../ui_components/AccountSidebar";
import UpdateInput from "../ui_components/UpdateInput";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AlertContext } from "../contexts/AlertContext";
import VerifyResetOtp from "../ui_components/VerifyResetOtp";
import ResetPassword from "../ui_components/ResetPassword";

function ChangePassword() {
    const { user } = useContext(AuthContext);
    const { setAlert } = useContext(AlertContext);
    const [isLoading, setIsLoading] = useState(false);
    const [stateOfProgress, setStateOfProgress] = useState("sendOtp");

    useEffect(()=>{
        setStateOfProgress(()=>{
            if (localStorage.getItem("SOP")){
                setStateOfProgress(localStorage.getItem("SOP"));
            }else{
                localStorage.setItem("SOP","sendOtp");
            }
        })
    },[])

    const onClickSubmitSendOtp = () => {
        setIsLoading(true);
        api.post("/accounts/reset/send-otp/", { phone: user.phone })
            .then((res) => {
                console.log(res.data);
                setAlert(res.data.message);
                setStateOfProgress("verifyOtp");
                localStorage.setItem("SOP","verifyOtp");
            })
            .catch((error) => {
                console.log(error);
                setAlert(error.response.data?.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <>
            <Helmet>
                <title>ویرایش رمزعبور | fit bama</title>
            </Helmet>
            {stateOfProgress == "sendOtp" ? (
                <>
                    {isLoading ? (
                        <>
                            <div className="w-full top-0 bottom-0 absolute z-50 flex bg-gray-100 justify-center items-center">
                                <span class="loader"></span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="min-h-screen bg-gray-300 w-full px-7 sm:px-11 lg:px-20 md:gap-10 pb-5 mt-5 pt-8">
                                <div className="grid grid-cols-12 md:gap-5">
                                    <div
                                        className="md:col-span-8 col-span-12 max-h-content bg-gray-100 p-3 md:p-5 rounded-md grid grid-cols-6"
                                        dir="rtl"
                                    >
                                        <div className="col-span-6">
                                            <p className="text-center font-bold">
                                                ویرایش رمزعبور
                                            </p>
                                        </div>

                                        <div className="col-span-6 grid gap-5 grid-cols-6">
                                            <div className="col-span-6">
                                                <UpdateInput
                                                    name={"phone"}
                                                    label={"شماره تلفن"}
                                                    maxLength={"13"}
                                                    type={"text"}
                                                    value={user.phone}
                                                    onChange={() => {}}
                                                    isDisabled={true}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-span-6 flex justify-center mt-5">
                                            <button
                                                onClick={onClickSubmitSendOtp}
                                                className="rounded-md cursor-pointer bg-gray-900 text-white px-7 py-2"
                                            >
                                                ارسال کد
                                            </button>
                                        </div>
                                    </div>
                                    <AccountSidebar />
                                </div>
                            </div>
                        </>
                    )}
                </>
            ) : stateOfProgress == "verifyOtp" ? (<>
                <VerifyResetOtp setStateProgress={setStateOfProgress} />
            </>) : (<><ResetPassword setStateProgress={setStateOfProgress} /></>)}
        </>
    );
}

export default ChangePassword;
