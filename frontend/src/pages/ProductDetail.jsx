import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api, { BASEURL } from "../service/api";
import CommentCard from "../ui_components/CommentCard";

function ProductDetail() {
    const [isLoading, setIsLoading] = useState(true);
    const params = useParams();
    const [productData, setProductData] = useState({});
    const [price, setPrice] = useState(0);

    const [extraOptions, setExtraOptions] = useState([]);

    useEffect(() => {
        api.get(`/shop/getProduct/${params.id}/`)
            .then((res) => {
                setProductData(res.data);
                setPrice(res.data.price);
                setIsLoading(false);
            })
            .catch((err) => {
                setIsLoading(true);
            });
    }, []);

    const setExtraOption = (id, price) => {
        if (!extraOptions.includes(id)) {
            setPrice((prevPrice) => Number(prevPrice) + Number(price));

            setExtraOptions((prev) => [...prev, id]);
        }
    };

    const removeExtraOption = (id, price) => {
        if (extraOptions.includes(id)) {
            setPrice((prevPrice) => Number(prevPrice) - Number(price));

            setExtraOptions((prev) => prev.filter((item) => item !== id));
        }
    };

    const setTotalPrice = (id, price) => {
        setSelectedWeek(id);
        let total = 0;
        // for (let i of packageData.extra_options) {
        //     if (extraOptions.includes(i.id)) {
        //         total += Number(i.price);
        //     }
        // }

        total += Number(price);

        setPrice(total);
    };

    return (
        <>
            {isLoading ? (
                <div className="w-full top-0 bottom-0 bg-gray-300 absolute z-50 flex justify-center items-center">
                    <span class="loader"></span>
                </div>
            ) : (
                <>
                    <div className="title w-full px-7 sm:px-11 lg:px-20 pb-5 pt-8">
                        <h1 className="w-full text-right text-lg font-bold">
                            {productData.name} -
                            غذای رژیمی و سلامت ژول
                        </h1>
                    </div>
                    <div className=" bg-gray-300 w-full px-7 sm:px-11 lg:px-20 py-8 min-h-4/5">
                        <h4 className="w-full flex justify-end pb-5 font-medium">
                            <Link
                                className="text-black w-max flex"
                                to={"/products"}
                            >
                                <span className="w-max flex items-center justify-end">
                                    بازگشت
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        class="bi bi-chevron-right"
                                        viewBox="0 0 16 16"
                                    >
                                        <path
                                            fill-rule="evenodd"
                                            d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
                                        />
                                    </svg>
                                </span>
                            </Link>
                        </h4>
                        <div
                            className="grid grid-cols-12 md:gap-5 place-content-between"
                            dir="rtl"
                        >
                            <div className="md:col-span-7 mb-5 col-span-12 grid grid-cols-6">
                                <div className="p-2 md:p-5 rounded-md bg-white col-span-6">
                                    <div className="">
                                        <img
                                            src={
                                                "https://getjoule.co/assets/images/product_image/809356bd946b55a72a28338b42d528cc.jpg"
                                            }
                                            alt={productData.name}
                                            loading="lazy"
                                            className="rounded-lg w-full object-cover object-center"
                                        />
                                    </div>
                                    <div className="product-info pt-5">
                                        <table
                                            className="border-collapse border border-gray-400 w-full table"
                                            dir="ltr"
                                        >
                                            <thead>
                                                <tr>
                                                    <th
                                                        colSpan={6}
                                                        className="border text-center border-gray-300 py-3 text-gray-800 font-bold text-md"
                                                        scope="col"
                                                    >
                                                        
                                                        {productData.name}
                                                    </th>
                                                </tr>

                                                <tr className="table-row">
                                                    <th className="border border-gray-300 py-2 text-center text-gray-800 font-medium text-sm">
                                                        کالری
                                                    </th>
                                                    <th className="border border-gray-300 py-2 text-center text-gray-800 font-medium text-sm">
                                                        گرم کربوهیدرات
                                                    </th>
                                                    <th className="border border-gray-300 py-2 text-center text-gray-800 font-medium text-sm">
                                                        گرم پروتئین
                                                    </th>
                                                    <th className="border border-gray-300 py-2 text-center text-gray-800 font-medium text-sm">
                                                        گرم چربی
                                                    </th>
                                                    <th className="border border-gray-300 py-2 text-center text-gray-800 font-medium text-sm">
                                                        گرم فیبر
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                <tr>
                                                    <td className="border border-gray-300 py-2 text-center text-gray-800 font-light">
                                                        {productData.calories}
                                                    </td>
                                                    <td className="border border-gray-300 py-2 text-center text-gray-800 font-light">
                                                        {productData.carbs}
                                                    </td>
                                                    <td className="border border-gray-300 py-2 text-center text-gray-800 font-light">
                                                        {productData.protein}
                                                    </td>
                                                    <td className="border border-gray-300 py-2 text-center text-gray-800 font-light">
                                                        {productData.fat}
                                                    </td>
                                                    <td className="border border-gray-300 py-2 text-center text-gray-800 font-light">
                                                        {productData.fiber}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        <table className="w-full mt-5">
                                            <thead>
                                                <tr className="w-full">
                                                    <th
                                                        scope="row"
                                                        className="border border-gray-300 py-2 text-center text-gray-800 font-medium md:font-bold text-sm"
                                                    >
                                                        محتویات
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="w-full">
                                                    <td
                                                        scope="row"
                                                        className="border border-b-0 border-gray-300 py-2 text-center w-full text-gray-800 font-light md:font-medium text-sm"
                                                    >
                                                        {productData.ingredients}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table
                                            className="border-collapse border border-gray-300 w-full table"
                                            dir="ltr"
                                        >
                                            <thead>
                                                <tr className="table-row">
                                                    <th
                                                        className="border border-gray-300 py-2 text-center text-gray-800 font-medium md:font-bold text-sm"
                                                        scope="col"
                                                    >
                                                        موارد مصرف
                                                    </th>
                                                    <th
                                                        className="border border-gray-300 py-2 text-center text-gray-800 font-medium md:font-bold text-sm"
                                                        scope="col"
                                                    >
                                                        موارد منع مصرف
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="border border-gray-300 py-2 text-center w-1/2 text-gray-800 font-light md:font-medium text-sm" dir="rtl">
                                                        {productData.indications}
                                                    </td>
                                                    <td className="border border-gray-300 py-2 text-center w-1/2 text-gray-800 font-light md:font-medium text-sm" dir="rtl">
                                                        {productData.contraindications}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="col-span-6 mt-5 rounded-md p-2 md:p-5 bg-gray-400">
                                    <p className="text-right font-bold">
                                        نظرات شما
                                    </p>
                                    <p className="text-right mt-4 text-sm">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="22"
                                            height="22"
                                            fill="currentColor"
                                            className="bi bi-bell-fill inline ml-3"
                                            viewBox="0 0 16 16"
                                        >
                                            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
                                        </svg>
                                        برای ثبت نظر خود در سایت می بایست ابتدا
                                        عضو سایت شوید و اگر قبلا ثبت نام نموده
                                        اید در سایت وارد شوید .
                                    </p>
                                    <div className="grid grid-cols-6 mt-5">
                                        <CommentCard />
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-5 col-span-12">
                                {productData.extra_options.map((extra) => {
                                    const selectedOption =
                                        extraOptions.includes(extra.id);

                                    return (
                                        <div
                                            key={extra.id}
                                            className="flex mb-2 flex-col p-2 md:p-5 rounded-md bg-white"
                                        >
                                            <div className="flex items-center justify-between text-sm font-bold">
                                                <span>{extra.option}</span>
                                                <span className="text-sm font-sm text-gray-500">
                                                    {extra.description}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-12 gap-1 md:gap-3 mt-2 md:mt-5">
                                                <div
                                                    onClick={() => {
                                                        removeExtraOption(
                                                            extra.id,
                                                            extra.price
                                                        );
                                                    }}
                                                    className={`col-span-6 cursor-pointer rounded-md border-2 flex flex-col justify-center items-center py-6 font-medium text-sm transition-all ${
                                                        !selectedOption
                                                            ? "bg-gray-400 border-amber-100 text-black shadow-md"
                                                            : " bg-gray-200 border-amber-50 hover:border-amber-200"
                                                    }`}
                                                >
                                                    خیر
                                                </div>
                                                <div
                                                    onClick={() => {
                                                        setExtraOption(
                                                            extra.id,
                                                            extra.price
                                                        );
                                                    }}
                                                    className={`col-span-6 cursor-pointer rounded-md border-2 flex flex-col justify-center items-center py-6 font-medium text-sm transition-all ${
                                                        selectedOption
                                                            ? "bg-gray-400 border-amber-100 text-black shadow-md"
                                                            : " bg-gray-200 border-amber-50 hover:border-amber-200"
                                                    }`}
                                                >
                                                    می خواهم
                                                    <span className="font-sm text-sm text-gray-600 ">
                                                        {extra.price} تومان
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                <div className="flex mt-5 flex-row  items-center justify-between p-2 md:p-5 rounded-md bg-white">
                                    <span className="text-sm font-bold">
                                        جمع مبلغ پرداختی
                                    </span>
                                    <span className="text-sm font-bold">
                                        {price} تومان
                                    </span>
                                </div>

                                <div className="flex mt-5 flex-row  items-center justify-center p-2 md:p-5 rounded-md bg-white">
                                    <button className="bg-green-500 w-full text-white px-4 py-4 rounded-md cursor-pointer transition-all ease-in border-2 duration-150 hover:shadow-md border-green-500 hover:bg-white hover:text-green-500">
                                        افزودن به سبد خرید
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default ProductDetail;
