import { CartContext } from "../contexts/CartContext";
import { useState, useContext } from "react";
import { BASEURL } from "../service/api";
import { Helmet } from "react-helmet-async";

function Cart() {
    const [isLoading, setIsLoading] = useState(false);
    const { cartItems, removeFromCart, totalPrice, clearCart } = useContext(CartContext);

    return (
        <>
            <Helmet><title>سبد خرید | fit bama</title></Helmet>
            {isLoading ? (
                <>
                    <div className="w-full top-0 bottom-0 bg-gray-300 absolute z-50 flex justify-center items-center">
                        <span class="loader"></span>
                    </div>
                </>
            ) : (
                <>
                    <div className="title w-full px-7 sm:px-11 lg:px-20 pb-5 mt-5 pt-8">
                        <h1 className="w-full text-right text-lg font-bold">
                            سبد خرید
                        </h1>
                    </div>

                    {cartItems.length == 0 ? (
                        <>
                            <div className="flex h-screen justify-center items-center">
                                <p className="inline text-lg text-gray-500">
                                    سبد خرید شما خالی است
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className=" bg-gray-300 w-full px-7 sm:px-11 lg:px-20 py-8 min-h-screen">
                                <div
                                    className="grid grid-cols-12 md:gap-5 place-content-between"
                                    dir="rtl"
                                >
                                    <div className="md:col-span-7 mb-5 col-span-12 grid grid-cols-6">
                                        {cartItems.map((item) => {
                                            return (
                                                
                                                    <div key={item.id} className="col-span-6 rounded-md mb-5  bg-white p-2 md:p-5 ">
                                                        <div className="flex flex-col mb-2 md:mb-5 md:flex-row">
                                                            <div className="md:w-3/4 w-full">
                                                                <img
                                                                    src={`${BASEURL}/${item.image}`}
                                                                    className="rounded-lg max-h-40 w-full object-cover object-cente"
                                                                    alt={
                                                                        item.name
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="md:w-1/4 w-full flex justify-center items-center flex-col text-center">
                                                                <h2 className="font-bold">
                                                                    بسته{" "}
                                                                    {item.name}
                                                                </h2>
                                                                <p
                                                                    dir="rtl"
                                                                    className="font-medium"
                                                                >
                                                                    قیمت بسته:
                                                                    {
                                                                        item.total_price
                                                                    }{" "}
                                                                    تومان
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <button
                                                            onClick={() => {
                                                                removeFromCart(
                                                                    item.slug
                                                                );
                                                            }}
                                                            className="bg-red-500 w-full text-white px-4 py-4 rounded-md cursor-pointer transition-all ease-in border-2 duration-150 hover:shadow-md border-red-500 hover:bg-white hover:text-red-500"
                                                        >
                                                            حذف از سبد خرید
                                                        </button>
                                                    </div>
                                                
                                            );
                                        })}
                                    </div>
                                    <div className="md:col-span-5 col-span-12">
                                        <div className="flex flex-row  items-center justify-between p-2 md:p-5 rounded-md bg-white">
                                            <span className="font-bold">
                                                جمع مبلغ پرداختی
                                            </span>
                                            <span className=" font-bold">
                                                {totalPrice()} تومان
                                            </span>
                                        </div>
                                        <div className="flex flex-col mt-5 p-2 md:p-5 rounded-md bg-white">
                                            <button className="bg-green-500 mb-2 w-full text-white px-4 py-4 rounded-md cursor-pointer transition-all ease-in border-2 duration-150 hover:shadow-md border-green-500 hover:bg-white hover:text-green-500">
                                                شروع پرداخت
                                            </button>
                                            <button
                                                onClick={()=>{clearCart()}}
                                                className="bg-red-500 w-full text-white px-4 py-4 rounded-md cursor-pointer transition-all ease-in border-2 duration-150 hover:shadow-md border-red-500 hover:bg-white hover:text-red-500"
                                            >
                                                خالی کردن سبد خرید
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
        </>
    );
}

export default Cart;
