import api from "../service/api";
import { useNavigate, Link } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { AlertContext } from "../ui_components/AppLayout";
import Input from "../ui_components/Input";

function ValidateUser() {
    const [formValidateUser, setFormValidateUser] = useState({
        otp_code: "",
    });

    const [isLoading, setIsLoading] = useState(false);

    const { setUser, setIsLogin, user } = useContext(AuthContext);

    const { setAlert } = useContext(AlertContext);

    const navigate = useNavigate();

    const onChangeInput = (e) => {
        setFormValidateUser((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const onClickSubmit = async () => {
        const token = localStorage.getItem("token");
        setIsLoading(true);

        try {
            const res = await api.post(
                "/accounts/validate/",
                formValidateUser,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setAlert(res.data.message || "شماره شما با موفقیت تأیید شد ✅");

            navigate("/");
        } catch (error) {
            console.log(error);

            const errMsg = error?.response?.data?.message || "مشکلی در اعتبارسنجی کد پیش آمد. لطفاً دوباره تلاش کنید." ;
            console.log(errMsg)
            setAlert(errMsg);
            alert(errMsg)
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user["is_validate"]) {
            navigate("/");
        }
    }, []);

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
                            تائید شماره موبایل {user["phone"]}
                        </p>

                        <p className="mb-12 text-right font-sm font-medium text-gray-400">
                            کد تایید، که به شماره موبایل شما ارسال شده است را
                            وارد نمایید. امکان دارد ارسال کد به موبایل شما با
                            توجه به شلوغی اپراتور تا چند دقیقه زمان ببرد.
                        </p>

                        <Input
                            name={"otp_code"}
                            onChange={onChangeInput}
                            label={"کد تائید ارسالی *"}
                            type={"text"}
                            maxLength={6}
                        />

                        <button
                            disabled
                            className="w-full disabled:bg-gray-700 disabled:cursor-none py-3 cursor-pointer bg-black rounded-md text-white mt-5"
                        >
                            دریافت مجدد کد
                        </button>

                        <button
                            onClick={onClickSubmit}
                            className="w-full cursor-pointer rounded-md flex items-center justify-center mt-4 py-2 bg-green-600 text-white"
                        >
                            تائید شماره
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default ValidateUser;
