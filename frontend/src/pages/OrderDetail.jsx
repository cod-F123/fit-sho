import api, { BASEURL } from "../service/api";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AuthContext } from "../contexts/AuthContext";

function OrderDetail() {
    const [order, setOrder] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [userAddresses, setUserAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState({});

    const params = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        api.get(`/payment/orders/${params.id}/`)

            .then((res) => {
                setOrder(res.data);

                api.get("/accounts/addresses/")
                    .then((res) => {
                        setUserAddresses(res.data);
                    })
                    .catch((error) => {});

                setIsLoading(false);
            })
            .catch((error) => {
                setIsLoading(false);
                navigate("404");
            });
    }, []);

    const startPay = () => {
        setIsLoading(true);
        let address = `${selectedAddress.address} \n کدپستی :${selectedAddress.zip_code}`;

        api.post("/payment/startPayment/", {
            order_id: order.order_id,
            address: address,
        })
            .then((res) => {
                window.location.href = res.data.pay_url;
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
            });
    };

    const payWithWallet = () => {
        setIsLoading(true);
        let address = `${selectedAddress.address} \n کدپستی :${selectedAddress.zip_code}`;

        api.post("/payment/payWithWallet/", {
            order_id: order.order_id,
            address: address,
        })
            .then((res) => {
                setOrder(res.data.order);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
            });
    };

    return (
        <>
            {isLoading ? (
                <>
                    <div className="w-full top-0 bottom-0 bg-gray-300 absolute z-50 flex justify-center items-center">
                        <span class="loader"></span>
                    </div>
                </>
            ) : (
                <>
                    <Helmet>
                        <title>
                            سفارش شماره {order.order_number} | fit bama
                        </title>
                    </Helmet>
                    <div className="title w-full px-7 sm:px-11 lg:px-20 pb-5 mt-5 pt-8">
                        <h1 className="w-full text-right text-lg font-bold">
                            سفارش شماره {order.order_number}
                        </h1>
                    </div>

                    <div className=" bg-gray-300 w-full px-7 sm:px-11 lg:px-20 py-8 min-h-screen">
                        <div
                            className="grid grid-cols-12 md:gap-5 place-content-between"
                            dir="rtl"
                        >
                            <div className="md:col-span-7 mb-5 col-span-12 gap-5 grid grid-cols-6">
                                {order.order_items.map((item) => {
                                    return (
                                        <div
                                            key={item.id}
                                            className="col-span-6 max-h-content rounded-md mb-5  bg-white p-2 md:p-5 "
                                        >
                                            <div className="flex flex-col mb-2 md:mb-5 md:flex-row">
                                                <div className="md:w-3/4 w-full">
                                                    <img
                                                        src={`${BASEURL}/${item.package.image}`}
                                                        className="rounded-lg max-h-40 w-full object-cover object-cente"
                                                        alt={item.package.name}
                                                    />
                                                </div>
                                                <div className="md:w-1/4 w-full flex justify-center items-center flex-col text-center">
                                                    <h2 className="font-bold">
                                                        بسته {item.package.name}
                                                    </h2>

                                                    <p
                                                        dir="rtl"
                                                        className="font-medium"
                                                    >
                                                        قیمت بسته:
                                                        {item.amount} تومان
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex w-full flex-col gap-3">
                                                <div className="flex border-b border-gray-400 pb-3 flex-row justify-between">
                                                    {" "}
                                                    <span>
                                                        مخلفاتی که به آن آلرژی
                                                        دارید :{" "}
                                                        {item.alergies
                                                            ? item.alergies
                                                            : "' ' "}
                                                    </span>{" "}
                                                    <span>
                                                        تعداد هفته :{" "}
                                                        {
                                                            item.meal_pricing
                                                                .week_duration
                                                        }
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-between text-sm font-bold">
                                                    <span>آپشن های اضافی</span>
                                                </div>
                                                {item.extra_options.map(
                                                    (option) => {
                                                        return (
                                                            <div
                                                                key={option.id}
                                                                className="flex justify-between flex-row-reverse"
                                                            >
                                                                <span>
                                                                    {
                                                                        option
                                                                            .option
                                                                            .option
                                                                    }
                                                                </span>{" "}
                                                                <span>
                                                                    {
                                                                        option
                                                                            .option
                                                                            .price
                                                                    }{" "}
                                                                    تومان
                                                                </span>
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                                {order.product_order_items.map((item) => {
                                    return (
                                        <div
                                            key={item.id}
                                            className="col-span-6 max-h-content rounded-md mb-5  bg-white p-2 md:p-5 "
                                        >
                                            <div className="flex flex-col mb-2 md:mb-5 md:flex-row">
                                                <div className="md:w-3/4 w-full">
                                                    <img
                                                        src={`${BASEURL}/${item.product.image}`}
                                                        className="rounded-lg max-h-40 w-full object-cover object-cente"
                                                        alt={item.product.name}
                                                    />
                                                </div>
                                                <div className="md:w-1/4 w-full flex justify-center items-center flex-col text-center">
                                                    <h2 className="font-bold">
                                                        بسته {item.product.name}
                                                    </h2>

                                                    <p
                                                        dir="rtl"
                                                        className="font-medium"
                                                    >
                                                        قیمت بسته:
                                                        {item.amount} تومان
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex w-full flex-col gap-3">
                                                <div className="flex border-b border-gray-400 pb-3 flex-row justify-between">
                                                    {" "}
                                                    <span>
                                                        {" "}
                                                        تعداد : {
                                                            item.quantity
                                                        }{" "}
                                                        عدد
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-between text-sm font-bold">
                                                    <span>آپشن های اضافی</span>
                                                </div>
                                                {item.extra_options.map(
                                                    (option) => {
                                                        return (
                                                            <div
                                                                key={option.id}
                                                                className="flex justify-between flex-row-reverse"
                                                            >
                                                                <span>
                                                                    {
                                                                        option
                                                                            .option
                                                                            .option
                                                                    }
                                                                </span>{" "}
                                                                <span>
                                                                    {
                                                                        option
                                                                            .option
                                                                            .price
                                                                    }{" "}
                                                                    تومان
                                                                </span>
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}

                                {order.salads_order?.salad_items.map((item) => {
                                    return (
                                        <div
                                            key={item.id}
                                            className="col-span-6 sm:col-span-3 max-h-content rounded-md mb-5  bg-gray-100 p-2 md:p-5 "
                                        >
                                            <div className="flex flex-col mb-2 md:mb-5 ">
                                                <div className=" w-full">
                                                    <img
                                                        src={`${BASEURL}/${item.item.image}`}
                                                        className="rounded-lg object-center max-h-40 w-full object-cover object-cente"
                                                        alt={item.item.name}
                                                    />
                                                </div>
                                                <div className="w-full flex justify-between mt-5 items-center flex-row text-center">
                                                    <h2 className="font-bold">
                                                        آیتم {item.item.name}
                                                    </h2>

                                                    <p
                                                        dir="rtl"
                                                        className="font-medium"
                                                    >
                                                        قیمت :{item.item.price}{" "}
                                                        تومان
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="md:col-span-5 col-span-12">
                                <div className="flex flex-row  items-center justify-between p-3 md:p-5 rounded-md bg-white">
                                    <span className="font-bold">
                                        تاریخ سفارش :
                                    </span>
                                    <span className=" font-bold" dir="ltr">
                                        {order.create_at}
                                    </span>
                                </div>
                                <div className="flex flex-row  items-center mt-5 justify-between p-3 md:p-5 rounded-md bg-white">
                                    <span className="font-bold">
                                        وضعیت سفارش :
                                    </span>
                                    <span className=" font-bold">
                                        {order.status == "pending" ? (
                                            <span className="text-red-600">
                                                {" "}
                                                در انتظار پرداخت
                                            </span>
                                        ) : (order.status == "processing") |
                                          (order.status == "payed") ? (
                                            <span className="text-green-500">
                                                جاری
                                            </span>
                                        ) : (
                                            <span className="text-green-800">
                                                تکمیل شده
                                            </span>
                                        )}
                                    </span>
                                </div>
                                <div className="flex flex-row  items-center mt-5 justify-between p-3 md:p-5 rounded-md bg-white">
                                    <span className="font-bold">
                                        جمع مبلغ پرداختی
                                    </span>
                                    <span className=" font-bold">
                                        {order.amount} تومان
                                    </span>
                                </div>
                                {order.status == "pending" ? (
                                    <>
                                        <div className="flex flex-col mt-5 pb-1">
                                            <p className="text-right font-bold">
                                                آدرس خودرا انتخاب کنید
                                            </p>
                                            {userAddresses.map((address) => {
                                                return (
                                                    <div
                                                        key={address.id}
                                                        className="flex mt-5 flex-col p-2 md:p-5 rounded-md bg-white"
                                                    >
                                                        <div className="flex items-center justify-between text-sm font-bold">
                                                            <span>
                                                                {address.title}
                                                            </span>
                                                        </div>
                                                        <div className="grid grid-cols-12 gap-1 md:gap-3 mt-2 md:mt-5">
                                                            <div
                                                                onClick={() => {
                                                                    setSelectedAddress(
                                                                        address
                                                                    );
                                                                }}
                                                                className={`col-span-12 cursor-pointer rounded-md border-2 flex flex-col justify-center items-center py-6 font-medium text-sm transition-all ${
                                                                    address.id ===
                                                                    selectedAddress.id
                                                                        ? "bg-gray-400 border-amber-100 text-black shadow-md"
                                                                        : " bg-gray-200 border-amber-50 hover:border-amber-200"
                                                                }`}
                                                            >
                                                                {
                                                                    address.address
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="flex flex-col mt-5 p-2 md:p-5 rounded-md bg-white">
                                            {selectedAddress.id ? (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            startPay();
                                                        }}
                                                        className="bg-green-500 mb-2 w-full text-white px-4 py-4 rounded-md cursor-pointer transition-all ease-in border-2 duration-150 hover:shadow-md border-green-500 hover:bg-white hover:text-green-500"
                                                    >
                                                        پرداخت
                                                    </button>
                                                    {user.wallet.amount >=
                                                    order.amount ? (
                                                        <>
                                                            <button
                                                                onClick={() => {payWithWallet()}}
                                                                className="bg-blue-500 mb-2 w-full text-white px-4 py-4 rounded-md cursor-pointer transition-all ease-in border-2 duration-150 hover:shadow-md border-blue-500 hover:bg-white hover:text-blue-500"
                                                            >
                                                                پرداخت با کیف
                                                                پول
                                                            </button>
                                                        </>
                                                    ) : null}
                                                </>
                                            ) : (
                                                <>
                                                    <h3 className="text font-bold text-center">
                                                        ابتدا آدرس خود را انتخاب
                                                        کنید
                                                    </h3>
                                                </>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    ""
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default OrderDetail;
