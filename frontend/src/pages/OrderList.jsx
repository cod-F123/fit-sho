import { Helmet } from "react-helmet-async";
import api from "../service/api";
import { useState, useEffect } from "react";
import AccountSidebar from "../ui_components/AccountSidebar";
import OrderItem from "../ui_components/OrderItem";

function ListOrder() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState("pending");

    useEffect(()=>{
        api.get(`/payment/orders/?f_status=${filter}`).then((res)=>{
            setOrders(res.data);
            setIsLoading(false);
        }).catch((error)=>{
            setIsLoading(false);
        })
    },[filter])


    return (
        <>
            <Helmet>
                <title>سفارشات | fit bama</title>
            </Helmet>
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
                        <div className="grid grid-cols-12 md:gap-5 ">
                            <div className="md:col-span-8 col-span-12 grid grid-cols-6">
                                <div className="col-span-6 mb-24 grid grid-cols-6 max-h-content bg-gray-800  rounded-md">
                                    <div onClick={()=>{setFilter("processing")}} className={`col-span-2 py-6 flex justify-center items-center text-white rounded-bl-md rounded-tl-md cursor-pointer hover:bg-gray-500 transition-colors duration-200 ${filter === "processing" ? "bg-gray-500" :"" }`}>جاری</div>
                                    <div onClick={()=>{setFilter("completed")}} className={`col-span-2 py-6 flex justify-center items-center text-white cursor-pointer hover:bg-gray-500 transition-colors duration-200 ${filter === "completed" ? "bg-gray-500" :"" }`}>تکمیل شده</div>
                                    <div onClick={()=>{setFilter("pending")}} className={`col-span-2 py-6 flex justify-center items-center text-white rounded-br-md rounded-tr-md cursor-pointer hover:bg-gray-500 transition-colors duration-200 ${filter === "pending" ? "bg-gray-500" :"" }`}>درانتظار پرداخت</div>
                                </div>
                                <div className="col-span-6 grid grid-cols-6 gap-5 max-h-content md:-mt-20 mt-5">
                                    {orders.length == 0 ? (<>
                                        <div className="col-span-6">
                                            <p className="text-center text-lg text-gray-500">سفارشی برای نمایش وجود ندارد</p>
                                        </div>
                                    </>) : (<>
                                        {orders.map((order)=>{
                                            return <OrderItem key={order.order_id} order={order} />
                                        })}
                                    </>)}
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

export default ListOrder;
