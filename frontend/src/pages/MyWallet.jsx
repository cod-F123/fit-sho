import api from "../service/api";
import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AlertContext } from "../contexts/AlertContext";
import AccountSidebar from "../ui_components/AccountSidebar";
import Input from "../ui_components/Input";
import { Helmet } from "react-helmet-async";

function MyWallet() {
    const [wallet, setWallet] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { setAlert } = useContext(AlertContext);

    const [amount, setAmount] = useState(null);

    useEffect(() => {
        api.get("/wallet/")
            .then((res) => {
                setWallet(res.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
                navigate("/");
                setIsLoading(false);
                setAlert("مشکلی در پردازش به وجود آمده دقیقی دیگر تلاش کنید");
            });
    }, []);



    const amounInputOnChange = (e)=>{
        if (e.target.value > 90_000_000){
            setAmount(90_000_000);

        }else{
            setAmount(e.target.value);
        }
    }
    return (
        <>
            <Helmet><title>کیف پول | fit bama</title></Helmet>
            {isLoading ? (
                <>
                    <div className="w-full top-0 bottom-0 absolute z-50 flex bg-gray-100 justify-center items-center">
                        <span class="loader"></span>
                    </div>
                </>
            ) : (
                <>
                    {" "}
                    <div className="min-h-screen bg-gray-300 w-full px-7 sm:px-11 lg:px-20 md:gap-10 pb-5 mt-5 pt-8">
                        <div className="grid grid-cols-12 md:gap-5">
                            <div className="md:col-span-8 col-span-12 grid grid-cols-6">
                                <div className="col-span-6 flex max-h-content mb-0 flex-col justify-between items-center bg-gray-800 py-7 md:px-5 px-3 rounded-md">
                                    <div className="">
                                        <p className="text-lg font-bold text-right text-white">
                                            اعتبار حساب من{" "}
                                            <span className="text-yellow-400 mx-1">
                                                {wallet.amount}
                                            </span>{" "}
                                            تومان
                                        </p>
                                    </div>
                                    <div className="mt-10 w-full flex justify-between items-center">
                                        <button className="px-3 py-2 rounded-xl border-2 border-white cursor-pointer text-white">
                                            شارژ کیف پول
                                        </button>
                                        <div className="flex md:w-3/4 w-1/2 rounded-lg h-10 md:h-11 border-2 border-box my-3 border-gray-300 relative">
                                            <span
                                                className="absolute text-white text-sm  -top-3 bg-gray-800 right-1.5"
                                                dir="rtl"
                                            >
                                                مبلغ شارژ کیف پول
                                            </span>
                                            <input
                                                type={"number"}
                                                name="ammount"
                                                id={"22"}
                                                value={amount}
                                                onChange={amounInputOnChange}
                                                className="border-0 text-white pl-3 w-full outline-0"
                                                placeholder="تومان"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-6 flex max-h-content mt-5 flex-col items-center">
                                    <p className="text-right w-full text-sm font-bold">
                                        تراکنش ها
                                    </p>
                                    {wallet.transactions.map((transaction) => {
                                        return (
                                            <div key={transaction.id} dir="rtl" className={`col-span-6 w-full relative flex max-h-content mb-0 flex-col md:flex-row items-center justify-between  mt-3 py-7 text-white md:px-5 px-3 rounded-md ${transaction.transaction_type == "deposit" ? 'bg-green-400' : 'bg-red-400'}`}>
                                                <span>مبلغ : {transaction.amount} تومان</span>
                                                <span className="mt-1 md:mt-0">نوع تراکنش : {transaction.transaction_type == "deposit" ? <span className="px-3 py-1 rounded-2xl font-sm bg-green-800 text-white">واریز</span> : <span className="bg-red-600 px-2 font-sm py-1 rounded-2xl text-white font-bold">برداشت</span>}</span>
                                                <span dir="rtl" className="text-center mt-1 md:mt-0">کد پیگیری : {transaction.ref_id}</span>
                                                <span className="absolute text-sm top-0.5 left-1 text-gray-900" dir="ltr">{transaction.created_at}</span>
                                                <span className="absolute text-sm bottom-0.5 right-1 text-gray-900" dir="rtl">توضیحات : {transaction.description}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <AccountSidebar />
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default MyWallet;
