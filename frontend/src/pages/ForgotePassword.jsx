import api from "../service/api";
import { useState, useEffect, useContext } from "react";
import { AlertContext } from "../contexts/AlertContext";
import Input from "../ui_components/Input";
import { Link } from "react-router-dom";
import ResetPassword from "../ui_components/ResetPassword";
import VerifyResetOtp from "../ui_components/VerifyResetOtp";
import { Helmet } from "react-helmet-async";

function ForgotePassword() {
    const [isLoading, setIsLoading] = useState(false);
    const [phone, setPhone] = useState("");
    const [stateOfProgress, setStateOfProgress] = useState("sendOtp");
    const { setAlert } = useContext(AlertContext);

    useEffect(() => {
        setStateOfProgress(() => {
            if (localStorage.getItem("SOP")) {
                setStateOfProgress(localStorage.getItem("SOP"));
            } else {
                localStorage.setItem("SOP", "sendOtp");
            }
        });
    }, []);

    const onClickSubmitSendOtp = () => {
        setIsLoading(true);
        api.post("/accounts/reset/send-otp/", { phone: phone })
            .then((res) => {
                localStorage.setItem("phone",phone);
                setAlert(res.data.message);
                setStateOfProgress("verifyOtp");
                localStorage.setItem("SOP", "verifyOtp");
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
            <Helmet ><title>فراموشی رمزعبور | fit bama</title></Helmet>
            {stateOfProgress == "sendOtp" ? (
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
                                    className="text-center text-md  font-bold mb-24"
                                    dir="rtl"
                                >
                                    فراموشی رمز عبور
                                </p>

                                <Input
                                    name={"phone"}
                                    onChange={(e) => {
                                        setPhone(e.target.value);
                                    }}
                                    label={"تلفن*"}
                                    maxLength={11}
                                    type={"tel"}
                                />

                                <button onClick={onClickSubmitSendOtp} className="w-full cursor-pointer rounded-md flex items-center justify-center mt-4 py-2 bg-green-600 text-white">
                                    ارسال کد
                                </button>
                                <Link
                                    to="/accounts/login"
                                    className="w-full rounded-md cursor-pointer flex py-2 mt-2 transition-all duration-150  items-center hover:outline hover:outline-blue-600 hover:bg-white hover:text-blue-600 justify-center bg-blue-600 text-white "
                                >
                                    ورود
                                </Link>
                            </div>
                        </div>
                    )}
                </>
            ) : stateOfProgress == "verifyOtp" ? (
                <>
                    <VerifyResetOtp setStateProgress={setStateOfProgress} />
                </>
            ) : (
                <>
                    <ResetPassword setStateProgress={setStateOfProgress} />
                </>
            )}
        </>
    );
}

export default ForgotePassword;
