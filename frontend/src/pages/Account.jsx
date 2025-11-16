import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import AccountSidebar from "../ui_components/AccountSidebar";
import api from "../service/api";
import { Helmet } from "react-helmet-async";

function Account() {
    const { user } = useContext(AuthContext);
    const [userProfile, setUserProfile] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (user && !user["is_validate"]) {
            navigate("/accounts/validate");
        }else{
            api.get("/accounts/profile/").then((res)=>{
                setUserProfile(res.data);
            }).catch((error)=>{
                console.log(error);
            })
        }


    }, []);

    return (
        <>
        <Helmet>
            <title>اکانت من | fit bama</title>
        </Helmet>
            <div className="min-h-screen bg-gray-300 w-full px-7 sm:px-11 lg:px-20 md:gap-10 pb-5 mt-5 pt-8">
                <div className="grid grid-cols-12 md:gap-5">
                    <div className="md:col-span-8 col-span-12 grid grid-cols-6">
                        <div className="col-span-6 flex max-h-content md:flex-row-reverse flex-col justify-between items-center bg-gray-800 py-7 md:px-5 px-3 rounded-md">
                            <div className="">
                                <p className="text-lg font-bold text-right text-white">
                                    اعتبار حساب من{" "}
                                    <span className="text-yellow-400 mx-1">
                                        {user.wallet.amount}
                                    </span>{" "}
                                    تومان
                                </p>
                            </div>
                            <div className=" mt-10 md:mt-0">
                                <Link to={"/accounts/myWallet"} className="text-white px-7 cursor-pointers py-3 rounded-4xl text-center border-2 border-white">
                                    افزایش اعتبار
                                </Link>
                            </div>
                        </div>
                        <div className="col-span-6 max-h-content flex flex-col w-full mt-5 md:mt-0 sm:flex-row sm:justify-between bg-white md:gap-5 rounded-md p-3 md:p-5">
                            <div className="flex justify-center sm:justify-between " dir="rtl">
                                <span>شاخص BMI : </span> <span className="mr-1 font-bold"> {userProfile.bmi ? userProfile.bmi : "نامشخص"}</span>
                            </div>
                            <div className="text-black font-medium flex justify-center sm:justify-between " dir="rtl">
                                <span>وضعیت بدنی : </span> <span className="mr-1 font-bold"> {userProfile.body_category ? userProfile.body_category : "نامشخص"}</span>
                            </div>
                        </div>
                    </div>
                    <AccountSidebar />
                </div>
            </div>
        </>
    );
}

export default Account;
