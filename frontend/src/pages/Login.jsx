import api from "../service/api";
import Input from "../ui_components/Input";
import { Link } from "react-router-dom";
import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { AlertContext } from "../contexts/AlertContext";

import { useNavigate } from "react-router-dom";

import { animate } from "animejs";

import { Helmet } from "react-helmet-async";

function Login() {
    const [formLogin, setFormLogin] = useState({
        phone: "",
        password: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const onChangeInput = (e) => {
        setFormLogin((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const { setAlert } = useContext(AlertContext);
    const { user, setUser, setIsLogin } = useContext(AuthContext);

    const onClickButton = (e) => {
        setIsLoading(true);
        api.post("/accounts/token/", formLogin)
            .then((res) => {
                setIsLoading(false);
                localStorage.setItem("access", res.data.access);
                localStorage.setItem("refresh", res.data.refresh);
                api.get("/accounts/", {
                    headers: {
                        Authorization: `Bearer ${res.data.access}`,
                        "Content-Type": "application/json",
                    },
                })
                    .then((res) => {
                        setUser(res.data);
                        setAlert("شما با موفقیت وارد شدید");
                        setIsLogin(true);
                        navigate("/");
                    })
                    .catch((error) => {
                        setUser(null);
                        localStorage.removeItem("token");
                        setAlert("دریافت اطلاعات کاربر با خطا مواجه شد");
                        setIsLogin(false);
                    });
            })
            .catch((error) => {
                setIsLoading(false);
                setAlert("شماره موبایل یا رمز نادرست است");
            });
    };

    return (
        <>
        <Helmet >
            <title >ورود | fit bama</title>
        </Helmet>
            {isLoading ? (
                <>
                    <div className="w-full top-0 bottom-0 absolute z-50 flex bg-gray-100 justify-center items-center">
                        <span class="loader"></span>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-screen mx-3 my-4">
                    <div
                        className="w-6/7 login-form md:w-2/5 lg:w-1/4 p-4 pt-22 rounded-lg rounded-t-full border border-gray-300 bg-gray-100 shadow"
                    >
                        <p
                            className="text-center text-md  font-bold mb-24"
                            dir="rtl"
                        >
                            ورود به فیت شو
                        </p>
                        <Input
                            name={"phone"}
                            onChange={onChangeInput}
                            label={"تلفن*"}
                            maxLength={11}
                            type={"tel"}
                        />
                        <Input
                            name={"password"}
                            onChange={onChangeInput}
                            label={"رمزعبور*"}
                            type={"password"}
                        />
                        <Link className="block text-right text-sm font-bold text-black">
                            فراموشی رمز عبور
                        </Link>
                        <button
                            onClick={onClickButton}
                            className="w-full rounded-md cursor-pointer flex py-2 mt-4 transition-all duration-150  items-center hover:outline hover:outline-blue-600 hover:bg-white hover:text-blue-600 justify-center bg-blue-600 text-white "
                        >
                            ورود
                        </button>
                        <Link
                            to="/accounts/register"
                            className="w-full cursor-pointer rounded-md flex items-center justify-center mt-2 py-2 bg-green-600 text-white"
                        >
                            ثبت نام
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
}

export default Login;
