import { Link } from "react-router-dom";
import { useState, useRef, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function Nav() {
    const [openMenu, setOpenMenu] = useState(false);
    const menu = useRef();

    const onMenuAction = () => setOpenMenu(~openMenu);

    const { isLogin, logout } = useContext(AuthContext);

    const navigate = useNavigate();

    return (
        <>
            <div className="grid md:grid-cols-12 grid-cols-6 px-7 z-40 lg:px-12 py-4 fixed top-0 left-0 right-0 shadow shadow-gray-200 bg-white">
                <div className="col-span-4 lg:col-span-3 flex flex-row-reverse justify-end items-center">
                    <div
                        className="nav-btn w-7 h-7 text-black md:hidden"
                        onClick={onMenuAction}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="28"
                            height="28"
                            fill="currentColor"
                            class="bi bi-list"
                            viewBox="0 0 16 16"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
                            />
                        </svg>
                    </div>
                    <div className="flex-row hidden md:flex items-center">
                        <a
                            href="#"
                            className="rounded-md relative  bg-green-300 text-blue-950 p-2 md:p-1 lg:p-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="27"
                                height="27"
                                fill="currentColor"
                                className="bi bi-basket text-blue-950 font-bold"
                                viewBox="0 0 16 16"
                            >
                                <path d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1v4.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 13.5V9a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1.217L5.07 1.243a.5.5 0 0 1 .686-.172zM2 9v4.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V9zM1 7v1h14V7zm3 3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 4 10m2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 6 10m2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 8 10m2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5m2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5" />
                            </svg>
                            <div
                                className=" absolute right-0 rounded-xl font-bold bg-gray-400 px-2"
                                style={{ top: "-8px", fontSize: "11px" }}
                            >
                                0
                            </div>
                        </a>
                        {!isLogin ? (
                            <>
                                <Link
                                    to={"/accounts/login"}
                                    className="rounded-md ml-3 md:ml-2 lg:ml-3 bg-black text-white font-bold px-6 py-2 md:px-4 lg:px-6 md:py-1 lg:py-2"
                                >
                                    ثبت نام / ورود
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    to={"/accounts"}
                                    className="rounded-md ml-3 md:ml-2 lg:ml-3 text-black font-bold px-6 py-2 md:px-4 lg:px-6 md:py-1 lg:py-2"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="40"
                                        height="40"
                                        fill="currentColor"
                                        class="bi bi-person"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                                    </svg>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
                <div className="lg:col-span-9 md:col-span-8 col-span-2 flex flex-row-reverse justify-start items-center">
                    <a href="#" className="ml-3">
                        <img
                            src="https://getjoule.co/assets/desktop/images1/logo@2x.png"
                            className="w-30"
                            alt="logo"
                        />
                    </a>
                    <ul className="md:flex hidden flex-row-reverse items-center md:flex-wrap">
                        <li>
                            <Link
                                to={"/"}
                                className="ml-3 text-black hover:text-gray-400 font-bold text-sm"
                            >
                                خانه
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={"/packages"}
                                className="ml-3 text-black hover:text-gray-400 font-bold text-sm"
                            >
                                بسته هفتگی غذای رژیمی
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={"/products"}
                                className="ml-3 text-black hover:text-gray-400 font-bold text-sm"
                            >
                                سفارش روزانه غذای رژیمی
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={"/"}
                                className="ml-3 text-black hover:text-gray-400 font-bold text-sm"
                            >
                                مشاوره تغذیه رایگان
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={"/"}
                                className="ml-3 text-black hover:text-gray-400 font-bold text-sm"
                            >
                                کتابچه و برنامه غذایی
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={"/"}
                                className="ml-3 text-black hover:text-gray-400 font-bold text-sm"
                            >
                                بلاگ
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={"/"}
                                className="ml-3 text-black hover:text-gray-400 font-bold text-sm"
                            >
                                تماس با ما
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div
                ref={menu}
                className={`fixed z-50 top-0 right-0 h-full bg-gray-200 transition-all duration-500 ease-in-out overflow-hidden md:hidden ${
                    openMenu ? "w-3/4 opacity-100" : "w-0 opacity-0"
                }`}
            >
                <ul
                    className={`p-5 ${
                        openMenu ? "flex" : "hidden"
                    } flex-col items-end text-black text-right`}
                >
                    <li>
                        <Link
                            to="/"
                            onClick={onMenuAction}
                            className="block text-xl font-bold py-2"
                        >
                            خانه
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/packages"
                            onClick={onMenuAction}
                            className="block text-xl font-bold py-2"
                        >
                            بسته‌های رژیمی
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/products"
                            onClick={onMenuAction}
                            className="block text-xl font-bold py-2"
                        >
                            سفارش روزانه
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/"
                            onClick={onMenuAction}
                            className="block text-xl font-bold py-2"
                        >
                            تماس با ما
                        </Link>
                    </li>
                    <li>
                        <a
                            onClick={onMenuAction}
                            href="#"
                            className="rounded-md relative flex my-5 bg-green-300 text-blue-950 p-2 md:p-1 lg:p-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="27"
                                height="27"
                                fill="currentColor"
                                className="bi bi-basket text-blue-950 font-bold"
                                viewBox="0 0 16 16"
                            >
                                <path d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1v4.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 13.5V9a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1.217L5.07 1.243a.5.5 0 0 1 .686-.172zM2 9v4.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V9zM1 7v1h14V7zm3 3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 4 10m2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 6 10m2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 8 10m2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5m2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5" />
                            </svg>
                            <div
                                className=" absolute right-0 rounded-xl font-bold bg-gray-400 px-2"
                                style={{ top: "-8px", fontSize: "11px" }}
                            >
                                0
                            </div>
                        </a>
                    </li>
                    <li>
                        {!isLogin ? (
                            <>
                                <Link
                                    onClick={onMenuAction}
                                    to={"/accounts/login"}
                                    className="rounded-md ml-3 md:ml-2 lg:ml-3 bg-black text-white font-bold px-6 py-2 md:px-4 lg:px-6 md:py-1 lg:py-2"
                                >
                                    ثبت نام / ورود
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    onClick={onMenuAction}
                                    to={"/accounts"}
                                    className="rounded-md ml-3 md:ml-2 lg:ml-3 text-black font-bold px-6 py-2 md:px-4 lg:px-6 md:py-1 lg:py-2"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="40"
                                        height="40"
                                        fill="currentColor"
                                        class="bi bi-person"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                                    </svg>
                                </Link>
                            </>
                        )}
                    </li>
                </ul>
            </div>
        </>
    );
}

export default Nav;
