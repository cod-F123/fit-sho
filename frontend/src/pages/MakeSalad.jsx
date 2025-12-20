import api, { BASEURL } from "../service/api";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import SaladItem from "../ui_components/SaladItem";
import { CartContext } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { AlertContext } from "../contexts/AlertContext";

function MakeSalad() {
    const [saladItemsList, setSaladItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categorySelected, setCategorySelected] = useState("همه آیتم ها");
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const { saladItems, clearSalad } = useContext(CartContext);

    const navigate = useNavigate();
    const { setAlert } = useContext(AlertContext);

    useEffect(() => {
        setIsLoading(true);

        api.get(`/shop/getSaladItems/?category=${categorySelected}`)
            .then((res) => {
                setSaladItems(res.data.items);
                setCategories(res.data.categories);
                setIsLoading(false);
            })
            .catch((error) => {
                setIsLoading(false);
                console.log(error);
            });
    }, [categorySelected]);

    const filterCategory = (name) => {
        setCategorySelected(name);
    };

    const makeSalad = () => {
        if (user) {
            setIsLoading(true);
            api.post("/payment/makeSalad/", { salad_items: saladItems })
                .then((res) => {
                    clearSalad();
                    navigate("/accounts/orders");
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            navigate("/accounts/login");
            setAlert("ابتدا وارد حساب خود شوید");
        }
    };

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
                    <div className="w-full relative px-7 sm:px-11 lg:px-20 py-11 min-h-screen bg-gray-300">
                        <span
                            onClick={makeSalad}
                            className={`rounded-full fixed bg-green-700 border-2 cursor-pointer font-bold transition-opacity duration-200 text-white border-white p-2 md:p-5 ${
                                saladItems.length > 0
                                    ? "md:opacity-45 block md:hover:opacity-90 z-40"
                                    : "opacity-0 z-0 hidden"
                            }`}
                        >
                            تکمیل سفارش
                        </span>
                        <h2 className="text-3xl my-5 w-full text-center font-bold">
                            سالاد خودتو بساز
                        </h2>
                        <div className="grid grid-cols-12">
                            <div className="col-span-12 overflow-x-auto scrollbar-hide">
                                <div className="flex max-w-content gap-2 md:gap-4 justify-center  cursor-all-scroll s py-2 ">
                                    {categories.map((category) => (
                                        <div
                                            onClick={() => {
                                                filterCategory(category.name);
                                            }}
                                            key={category.id}
                                            className={`rounded-2xl cursor-pointer py-2 px-5 text-sm font-medium whitespace-nowrap hover:bg-gray-500 hover:text-black transition-all ${
                                                categorySelected ==
                                                category.name
                                                    ? "bg-gray-500 text-white"
                                                    : " bg-white"
                                            }`}
                                        >
                                            {category.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-12 gap-5 mt-5">
                            {saladItemsList.map((item) => {
                                return <SaladItem key={item.id} item={item} />;
                            })}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default MakeSalad;
