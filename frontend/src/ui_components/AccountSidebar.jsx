import DashboardLink from "./DashoardLink";
import userImage from "../assets/images/user.png";
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";
import { Link } from "react-router-dom";

function AccountSidebar() {
    const { user,logout } = useContext(AuthContext);

    return (
        <>
            <div className="md:col-span-4 col-span-12 grid gird-cols-6 mt-10 md:mt-0">
                <div className="col-span-6 max-h-content rounded-md bg-white p-3 md:p-5">
                    <div className="flex flex-row-reverse items-center justify-between">
                        <img
                            src={userImage}
                            className="w-12"
                            alt={user.get_full_name}
                        />

                        <span className="text-lg">{user.get_full_name}</span>
                    </div>
                    <div className="flex justify-between items-center mt-5">
                        <span className="text-gray-400 text-sm">
                            {user.phone}
                        </span>
                        <span className="text-gray-700 text-sm" dir="rtl">
                            شماره تلفن :
                        </span>
                    </div>
                </div>
                <div className="col-span-6 max-h-content rounded-md bg-white p-3 md:p-5 mt-5">
                    <DashboardLink to={"/accounts"} text={"داشبورد"} />
                    <DashboardLink
                        to={"/accounts/orders"}
                        text={"سفارشات من"}
                    />
                    <DashboardLink
                        to={"/accounts/myAddresses"}
                        text={"آدرس های من"}
                    />
                    <DashboardLink
                        to={"/accounts/myTransactions"}
                        text={"تراکنش ها"}
                    />
                    <DashboardLink
                        to={"/accounts/myWallet"}
                        text={"کیف پول من"}
                    />
                    <DashboardLink
                        to={"/accounts/profile/edit"}
                        text={"ویرایش پروفایل"}
                    />
                    <Link
                        onClick={()=>{logout();}}
                        className="flex flex-row mb-5 hover:border-b-red-800 text-red-500 hover:text-red-800 transition-all duration-200 justify-between items-center border-b pb-2 border-b-red-500"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-chevron-left"
                            viewBox="0 0 16 16"
                        >
                            <path
                                fillRule="evenodd"
                                d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
                            />
                        </svg>
                        <span>خروج از حساب</span>{" "}
                    </Link>
                </div>
            </div>
        </>
    );
}

export default AccountSidebar;
