import DashboardLink from "./DashoardLink";
import userImage from "../assets/images/user.png";
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";

function AccountSidebar() {

    const {user} = useContext(AuthContext);

    return (
        <>
            <div className="md:col-span-4 col-span-12 grid gird-cols-6 mt-10 md:mt-0">
                <div className="col-span-6 rounded-md bg-white p-3 md:p-5">
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
                <div className="col-span-6 rounded-md bg-white p-3 md:p-5 mt-5">
                    <DashboardLink to={"/accounts"} text={"داشبورد"} />
                    <DashboardLink
                        to={"/accounts/orders"}
                        text={"سفارشات من"}
                    />
                    <DashboardLink
                        to={"/accounts/myAddress"}
                        text={"آدرس های من"}
                    />
                    <DashboardLink
                        to={"/accounts/mytransactions"}
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
                </div>
            </div>
        </>
    );
};

export default AccountSidebar;
