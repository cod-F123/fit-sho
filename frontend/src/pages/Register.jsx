import api from "../service/api";
import { useNavigate, Link } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { AlertContext } from "../contexts/AlertContext";
import Input from "../ui_components/Input";
import { Helmet } from "react-helmet-async";

function Register() {
    const [formRegister, setFormRegister] = useState({
        phone: "",
        first_name: "",
        last_name: "",
        password: "",
    });

    const [isLoading, setIsLoading] = useState(false);

    const { setUser, setIsLogin } = useContext(AuthContext);

    const { setAlert } = useContext(AlertContext);

    const navigate = useNavigate();

    const onChangeInput = (e) => {
        setFormRegister((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const onClickSubmit = () => {
        setIsLoading(true);
        api.post("/accounts/register/", formRegister)
            .then((res) => {
                localStorage.setItem("access",res.data.token.access);
                localStorage.setItem("refresh",res.data.token.refresh)
                setUser(res.data.user);
                setIsLogin(true);
                navigate("/accounts/validate");
                setIsLoading(false);
                setAlert("ثبت نام با موفقیت انجام شد لطفا کد ارسال شده را وارد کنید");
            })
            .catch((error) => {
                setAlert("اطلاعات را به درستی وارد کنید");
                setIsLoading(false);
            });
    };

    return (
        <>
            <Helmet>ثبت نام | fit bama</Helmet>
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
                            ثبت نام در فیت شو
                        </p>
                        <Input
                            name={"first_name"}
                            onChange={onChangeInput}
                            label={"نام*"}
                            maxLength={100}
                            type={"text"}
                        />
                        <Input
                            name={"last_name"}
                            onChange={onChangeInput}
                            label={"نام خانوادگی*"}
                            maxLength={100}
                            type={"text"}
                        />
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

                        <button
                            onClick={onClickSubmit}
                            className="w-full cursor-pointer rounded-md flex items-center justify-center mt-4 py-2 bg-green-600 text-white"
                        >
                            ثبت نام
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
    );
}

export default Register;
