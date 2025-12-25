import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import api, { BASEURL } from "../service/api";
import CommentCard from "../ui_components/CommentCard";
import { AuthContext } from "../contexts/AuthContext";
import CommentForm from "../ui_components/CommentForm";
import { AlertContext } from "../contexts/AlertContext";
import { CartContext } from "../contexts/CartContext";
import { Helmet } from "react-helmet-async";

function PackageDetail() {
    const [isLoading, setIsLoading] = useState(true);
    const [packageData, setPackageData] = useState({});
    const [activeMeal, setActiveMeal] = useState(null);
    const params = useParams();
    const MAX_SELECTION = 3;
    const [price, setPrice] = useState(0);
    const [selectedWeek, setSelectedWeek] = useState(null);

    const allergies = [
        "مغزها",
        "انواع کلم",
        "پیاز (خام)",
        "سیر ( خام )",
        "انواع حبوبات",
        "بادمجان",
        "گوشت قرمز",
        "ماهی - تن ماهی",
        "تخم مرغ",
    ];

    const { user, isLogin } = useContext(AuthContext);
    const [commentForm, setCommentForm] = useState({});

    const { setAlert } = useContext(AlertContext);

    const [allergiesSelected, setAllergiesSelected] = useState([]);

    const [extraOptions, setExtraOptions] = useState([]);

    const { addToCart, existProductInCart, removeFromCart} = useContext(CartContext);

    const navigate = useNavigate();

    const [text,setText] = useState("");

    useEffect(() => {
        api.get(`/shop/getPackage/${params.id}/`)
            .then((res) => {
                setPackageData(res.data);

                // set active meal

                setActiveMeal(res.data.meals[0] ? res.data.meals[0].id : null);

                setSelectedWeek(
                    res.data.meals &&
                        res.data.meals[0] &&
                        res.data.meals[0].pricing_week[0]
                        ? res.data.meals[0].pricing_week[0].id
                        : null
                );
                setPrice(
                    res.data.meals &&
                        res.data.meals[0] &&
                        res.data.meals[0].pricing_week[0]
                        ? res.data.meals[0].pricing_week[0].price
                        : 0
                );

                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err)
                navigate("/404");
            });
    }, []);

    const setAllergies = (name) => {
        if (allergiesSelected.includes(name)) {
            setAllergiesSelected((prev) =>
                prev.filter((item) => item !== name)
            );
        } else {
            if (allergiesSelected.length >= MAX_SELECTION) {
                alert(`حداکثر ${MAX_SELECTION} مورد می‌تونی انتخاب کنی 😅`);
                return 0;
            }
            setAllergiesSelected((prev) => {
                return [...prev, name];
            });
        }
    };

    const setExtraOption = (id, price) => {
        if (!extraOptions.includes(id)) {
            let weeks = 1;

            for (let i of packageData.meals) {
                if (i.id == activeMeal) {
                    for (let week of i.pricing_week) {
                        if (week.id == selectedWeek) {
                            weeks = week.week_duration;
                        }
                    }
                }
            }

            setPrice((prevPrice) => Number(prevPrice) + weeks * Number(price));

            setExtraOptions((prev) => [...prev, id]);
        }
    };


    const removeExtraOption = (id, price) => {
        if (extraOptions.includes(id)) {
            let weeks = 1;

            for (let i of packageData.meals) {
                if (i.id == activeMeal) {
                    for (let week of i.pricing_week) {
                        if (week.id == selectedWeek) {
                            weeks = week.week_duration;
                        }
                    }
                }
            }

            setPrice((prevPrice) => Number(prevPrice) - weeks * Number(price));

            setExtraOptions((prev) => prev.filter((item) => item !== id));
        }
    };

    const setTotalPrice = (id, price, weeks) => {
        setSelectedWeek(id);
        let total = 0;
        for (let i of packageData.extra_options) {
            if (extraOptions.includes(i.id)) {
                total += weeks * Number(i.price);
            }
        }

        total += Number(price);

        setPrice(total);
    };

    const setActiveMealAndWeek = (mealId)=>{

        const selectedMeal = packageData.meals.filter((item)=>item.id == mealId)[0]
        setActiveMeal(selectedMeal.id);

        setSelectedWeek(selectedMeal.pricing_week[0].id);

        setTotalPrice(selectedMeal.pricing_week[0].id,selectedMeal.pricing_week[0].price,selectedMeal.pricing_week[0].week_duration)
    };

    const onChangeCommentInput = (e) => {
        setText(e.target.value);
        setCommentForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmitCommentForm = () => {
        if (commentForm.comment_content) {
            const token = localStorage.getItem("token");
            setText("");
            api.post(`/shop/getPackage/${params.id}/`, commentForm, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => {
                    setAlert("نظر شما ثیت شد");
                    setPackageData(res.data);
                })
                .catch((error) => {
                    setAlert("مشکلی پیش آمدد دقایقی دیگر انتحان کنید");
                })
                .finally(() => {
                    setCommentForm({});
                });
        }
    };

    return (
        <>
            {isLoading ? (
                <div className="w-full top-0 bottom-0 bg-gray-300 absolute z-50 flex justify-center items-center">
                    <span class="loader"></span>
                </div>
            ) : (
                <>
                    <Helmet><title> بسته هفتگی {packageData.name}</title></Helmet>
                    <div className="title w-full px-7 sm:px-11 lg:px-20 pb-5 mt-5 pt-8">
                        <h1 className="w-full text-right text-lg font-bold">
                            بسته هفتگی {packageData.name}
                        </h1>
                    </div>
                    <div className=" bg-gray-300 w-full px-7 sm:px-11 lg:px-20 py-8 min-h-4/5">
                        <h4 className="w-full flex justify-end pb-5 font-medium">
                            <Link
                                className="text-black w-max flex"
                                to={"/packages"}
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
                            <div className="md:col-span-7 mb-5 max-h-content col-span-12 grid grid-cols-6">
                                <div className="p-2 md:p-5 max-h-content rounded-md bg-white col-span-6">
                                    <div className="">
                                        <img
                                            src={`${BASEURL}${packageData.image}`}
                                            alt="image"
                                            loading="lazy"
                                            className="rounded-lg w-full object-cover object-center"
                                        />
                                    </div>
                                    <div className="package-info pt-5">
                                        <table
                                            className="border-collapse border border-gray-400 w-full table"
                                            dir="ltr"
                                        >
                                            <thead>
                                                <tr className="table-row">
                                                    <th
                                                        className="border border-gray-300 py-2 text-center text-gray-800 font-light md:font-medium text-sm"
                                                        scope="col"
                                                    >
                                                        گرم فیبر
                                                    </th>
                                                    <th
                                                        className="border border-gray-300 py-2 text-center text-gray-800 font-light md:font-medium text-sm"
                                                        scope="col"
                                                    >
                                                        گرم چربی
                                                    </th>
                                                    <th
                                                        className="border border-gray-300 py-2 text-center text-gray-800 font-light md:font-medium text-sm"
                                                        scope="col"
                                                    >
                                                        گرم پروتئین
                                                    </th>
                                                    <th
                                                        className="border border-gray-300 py-2 text-center text-gray-800 font-light md:font-medium text-sm"
                                                        scope="col"
                                                    >
                                                        گرم کربوهیدرات{" "}
                                                    </th>
                                                    <th
                                                        className="border border-gray-300 py-2 text-center text-gray-800 font-light md:font-medium text-sm"
                                                        scope="col"
                                                    >
                                                        کالری
                                                    </th>
                                                    <th
                                                        className="border border-gray-300 py-2 pr-1 text-right text-gray-800 font-medium md:font-bold text-md"
                                                        scope="col"
                                                    >
                                                        بسته {packageData.name}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {packageData.meals.map(
                                                    (meal) => {
                                                        return (
                                                            <>
                                                                <tr
                                                                    key={
                                                                        meal.id
                                                                    }
                                                                >
                                                                    <td className="border border-gray-300 py-2 text-center text-gray-800 font-light md:font-medium text-sm">
                                                                        {
                                                                            meal.fiber
                                                                        }
                                                                    </td>
                                                                    <td className="border border-gray-300 py-2 text-center text-gray-800 font-light md:font-medium text-sm">
                                                                        {
                                                                            meal.fat
                                                                        }
                                                                    </td>
                                                                    <td className="border border-gray-300 py-2 text-center text-gray-800 font-light md:font-medium text-sm">
                                                                        {
                                                                            meal.protein
                                                                        }
                                                                    </td>
                                                                    <td className="border border-gray-300 py-2 text-center text-gray-800 font-light md:font-medium text-sm">
                                                                        {
                                                                            meal.carbs
                                                                        }
                                                                    </td>
                                                                    <td className="border border-gray-300 py-2 text-center text-gray-800 font-light md:font-medium text-sm">
                                                                        {
                                                                            meal.calories
                                                                        }
                                                                    </td>
                                                                    <td className="border border-gray-300 py-2 pr-1 text-right text-gray-800 font-medium md:font-bold text-md">
                                                                        {
                                                                            meal.meal_type
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            </>
                                                        );
                                                    }
                                                )}
                                            </tbody>
                                        </table>
                                        <table
                                            className="border-collapse border mt-5 border-gray-300 w-full table"
                                            dir="ltr"
                                        >
                                            <thead>
                                                <tr className="table-row">
                                                    <th
                                                        className="border border-gray-300 py-2 text-center text-gray-800 font-medium md:font-bold text-sm"
                                                        scope="col"
                                                    >
                                                        اطلاعات بسته
                                                    </th>
                                                    <th
                                                        className="border border-gray-300 py-2 text-center text-gray-800 font-medium md:font-bold text-sm"
                                                        scope="col"
                                                    >
                                                        قبل از خرید بسته حتما
                                                        بخوانید!
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="border border-gray-300 py-2 text-center w-1/2 text-gray-800 font-light md:font-medium text-sm">
                                                        {
                                                            packageData.package_info
                                                        }
                                                    </td>
                                                    <td className="border border-gray-300 py-2 text-center w-1/2 text-gray-800 font-light md:font-medium text-sm">
                                                        {
                                                            packageData.important_note
                                                        }
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table className="w-full">
                                            <tbody>
                                                <tr className="w-full">
                                                    <th
                                                        scope="row"
                                                        className="border border-t-0 border-gray-300 py-2 text-center w-full text-gray-800 font-light md:font-medium text-sm"
                                                    >
                                                        {
                                                            packageData.composition
                                                        }
                                                    </th>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="col-span-6 flex items-center mt-5 rounded-md bg-white p-2 md:p-5">
                                    <img
                                        className="w-22"
                                        src="https://getjoule.co/assets/desktop/images1/icons/support2-01.svg"
                                        alt="supportimage"
                                    />
                                    <span className="mr-11">
                                        قبل از سفارش بسته حتما با مشاوره تغذیه
                                        تماس بگیرید و مشاوره رایگان دریافت کنید.{" "}
                                        <br />
                                        <Link
                                            className="text-blue-950 font-medium md:font-bold text-sm text-center mt-4 w-max flex"
                                            to={"/packages"}
                                        >
                                            <span className="w-max flex items-center justify-end">
                                                تماس با مشاور
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    fill="currentColor"
                                                    class="bi bi-chevron-left"
                                                    viewBox="0 0 16 16"
                                                >
                                                    <path
                                                        fill-rule="evenodd"
                                                        d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
                                                    />
                                                </svg>
                                            </span>
                                        </Link>
                                    </span>
                                </div>
                                <div className="col-span-6 mt-5 rounded-md p-2 md:p-5 bg-gray-400">
                                    <p className="text-right font-bold">
                                        نظرات شما
                                    </p>
                                    {isLogin ? (
                                        <>
                                            <CommentForm
                                                onSubmit={onSubmitCommentForm}
                                                onChangeInput={
                                                    onChangeCommentInput
                                                }

                                                text={text}
                                            />
                                        </>
                                    ) : (
                                        <>
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
                                                برای ثبت نظر خود در سایت می
                                                بایست ابتدا عضو سایت شوید و اگر
                                                قبلا ثبت نام نموده اید در سایت
                                                وارد شوید .
                                            </p>
                                        </>
                                    )}
                                    <div className="grid grid-cols-6 mt-5">
                                        {packageData.comments.map((comment) => {
                                            return (
                                                <CommentCard
                                                    commentData={comment}
                                                    key={comment.id}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-5 col-span-12">
                                <div className="flex flex-col p-2 md:p-5 rounded-md bg-white">
                                    <p className="text-right text-sm font-bold">
                                        تعداد وعده
                                    </p>
                                    <div className="grid grid-cols-12 gap-1 md:gap-3 mt-2 md:mt-5">
                                        {packageData.meals.map((meal) => {
                                            const isActive =
                                                activeMeal === meal.id;

                                            return (
                                                <div
                                                    key={meal.id}
                                                    onClick={() =>
                                                        setActiveMealAndWeek(meal.id)
                                                    }
                                                    className={`col-span-6 cursor-pointer rounded-md border-2 flex flex-col justify-center items-center py-6 font-medium text-sm transition-all
                                ${
                                    isActive
                                        ? "bg-gray-400 border-amber-100 text-black shadow-md"
                                        : "bg-gray-200 border-amber-50 hover:border-amber-200"
                                }`}
                                                >
                                                    {meal.meal_type}
                                                    <span className="font-sm text-sm text-gray-600 ">
                                                        {meal.calories} کالری
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="flex flex-col p-2 md:p-5 rounded-md bg-white mt-5">
                                    <p className="text-right text-sm font-bold">
                                        مخلفاتی که به آن آلرژی دارید را انتخاب
                                        کنید
                                    </p>
                                    <div className="grid grid-cols-12 gap-1 md:gap-3 mt-2 md:mt-5">
                                        {allergies.map((allergy) => {
                                            const isSelected =
                                                allergiesSelected.includes(
                                                    allergy
                                                );

                                            return (
                                                <div
                                                    key={allergy}
                                                    onClick={() =>
                                                        setAllergies(allergy)
                                                    }
                                                    className={`col-span-6 cursor-pointer rounded-md border-2 flex flex-col justify-center items-center py-3 font-medium text-sm transition-all
                ${
                    isSelected
                        ? "bg-gray-400 border-amber-100 text-black shadow-md"
                        : "bg-gray-200 border-amber-50 hover:border-amber-200"
                }`}
                                                >
                                                    {allergy}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                {packageData.extra_options.map((extra) => {
                                    const selectedOption =
                                        extraOptions.includes(extra.id);

                                    return (
                                        <div
                                            key={extra.id}
                                            className="flex mt-5 flex-col p-2 md:p-5 rounded-md bg-white"
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

                                <div className="flex mt-5 flex-col p-2 md:p-5 rounded-md bg-white">
                                    <p className="text-right text-sm font-bold">
                                        تعداد هفته
                                    </p>
                                    <div className="grid grid-cols-12 gap-1 md:gap-3 mt-2 md:mt-5">
                                        {packageData.meals.map((meal) => {
                                            const selectedMeal =
                                                activeMeal === meal.id;

                                            return (
                                                <>
                                                    {selectedMeal ? (
                                                        <>
                                                            {meal.pricing_week.map(
                                                                (item) => {
                                                                    const isSelectedWeek =
                                                                        selectedWeek ===
                                                                        item.id;

                                                                    return (
                                                                        <div
                                                                            key={
                                                                                item.id
                                                                            }
                                                                            onClick={() => {
                                                                                setTotalPrice(
                                                                                    item.id,
                                                                                    item.price,
                                                                                    item.week_duration
                                                                                );
                                                                            }}
                                                                            className={`col-span-3 cursor-pointer rounded-md border-2 flex flex-col justify-center items-center py-6 font-medium text-sm transition-all
                        ${
                            isSelectedWeek
                                ? "bg-gray-400 border-amber-100 text-black shadow-md"
                                : "bg-gray-200 border-amber-50 hover:border-amber-200"
                        }`}
                                                                        >
                                                                            {
                                                                                item.week_duration
                                                                            }{" "}
                                                                            هفته
                                                                        </div>
                                                                    );
                                                                }
                                                            )}
                                                        </>
                                                    ) : (
                                                        <></>
                                                    )}
                                                </>
                                            );
                                        })}
                                    </div>
                                    <div className="flex justify-center mt-4">
                                        <p className="bg-gray-400 text-sm font-sm rounded w-3/4 p-3">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                                className="inline bi bi-circle-fill ml-2"
                                                viewBox="0 0 16 16"
                                            >
                                                <circle cx="8" cy="8" r="8" />
                                            </svg>
                                            ارسال بسته ها روزانه یک بار در طول
                                            یک یا چند هفته‌ی ۶ روزه می باشد و
                                            جمعه ها ارسال نمی شوند.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex mt-5 flex-row  items-center justify-between p-3 md:p-5 rounded-md bg-white">
                                    <span className="text-sm font-bold">
                                        جمع مبلغ پرداختی
                                    </span>
                                    <span className="text-sm font-bold">
                                        {price} تومان
                                    </span>
                                </div>

                                <div className="flex mt-5 flex-row  items-center justify-center p-2 md:p-5 rounded-md bg-white">
                                    {existProductInCart(packageData.slug) ? (
                                        <>
                                            <button onClick={()=>{removeFromCart(packageData.slug)}} className="bg-red-500 w-full text-white px-4 py-4 rounded-md cursor-pointer transition-all ease-in border-2 duration-150 hover:shadow-md border-red-500 hover:bg-white hover:text-red-500">
                                                حذف از سبد خرید
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => {
                                                    addToCart(
                                                        packageData,
                                                        1,
                                                        price,
                                                        true,
                                                        extraOptions,
                                                        allergiesSelected,
                                                        activeMeal,
                                                        selectedWeek,
                                                    );
                                                }}
                                                className="bg-green-500 w-full text-white px-4 py-4 rounded-md cursor-pointer transition-all ease-in border-2 duration-150 hover:shadow-md border-green-500 hover:bg-white hover:text-green-500"
                                            >
                                                افزودن به سبد خرید
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default PackageDetail;
