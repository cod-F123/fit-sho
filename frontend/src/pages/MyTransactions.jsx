import api from "../service/api";
import { useState, useEffect } from "react";
import AccountSidebar from "../ui_components/AccountSidebar";
import { Helmet } from "react-helmet-async";
import TransactionItem from "../ui_components/TransactionItem";

function MyTransactions() {
    const [isLoading, setISLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        api.get("/payment/transactions/").then((res)=>{
            setTransactions(res.data);
            console.log(res.data);
        }).catch((error)=>{
            console.log(error)
        }).finally(()=>{
            setISLoading(false);
        })
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
                <>
                    <Helmet>
                        <title>تراکنش ها | fit bama</title>
                    </Helmet>
                    <div className="min-h-screen w-full bg-gray-300 px-7 sm:px-11 lg:px-20 md:gap-10 pb-5 mt-5 pt-8">
                        <div className="grid grid-cols-12 gap-5">
                            <div className="md:col-span-8 col-span-12 max-h-conten">
                                <div className="flex flex-row-reverse w-full p-3 md:p-5 rounded-md bg-gray-800 max-h-content justify-center items-center">
                                    <h2 className="text-white font-bold text-lg text-center">تراکنش ها</h2>
                                </div>
                                {transactions.map((transaction)=>{
                                    return <TransactionItem key={transaction.id} transaction={transaction} />
                                })}
                            </div>
                            <AccountSidebar />
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default MyTransactions;
