import { BASEURL } from "../service/api";
import { CartContext } from "../contexts/CartContext";
import { useContext } from "react";

function SaladItem({ item }) {
    const {addToSalad, existingIteminSalad, removeFromSalad} = useContext(CartContext);
    return (
        <>
            <div className="col-span-6 productCard md:col-span-3 lg:col-span-2 bg-white rounded-lg">
                <img
                    src={`${BASEURL}${item.image}`}
                    alt={item.name}
                    className="rounded-t-lg w-full"
                />
                <div className="flex flex-col p-2">
                    <h4 className="font-bold text-right">{item.name}</h4>
                    <div className="flex flex-col-reverse sm:flex-row justify-between px-3 py-2 my-3 rounded-2xl bg-gray-300">
                        <span
                            className="text-sm font-bold text-gray-600"
                            dir="rtl"
                        >
                            {item.protein} پروتئین
                        </span>

                        <span
                            className="text-sm font-bold text-gray-600"
                            dir="rtl"
                        >
                            {item.calories} کالری
                        </span>
                    </div>
                    <div className="flex flex-col-reverse sm:flex-row justify-between items-center">
                        {existingIteminSalad(item.id) ? (
                                    <>
                                        <button
                                            onClick={() => {
                                                removeFromSalad(item.id);
                                            }}
                                            className="rounded-lg bg-red-500 text-white max-sm:w-full px-2 py-2 cursor-pointer transition-all ease-in border-2 duration-150 hover:shadow-md border-red-500 hover:bg-white hover:text-red-500"
                                        >
                                            حذف
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => {
                                                addToSalad(item.id)
                                            }}
                                            className="rounded-lg bg-green-500 text-white max-sm:w-full px-2 py-2 cursor-pointer transition-all ease-in border-2 duration-150 hover:shadow-md border-green-500 hover:bg-white hover:text-green-500"
                                        >
                                            افزودن
                                        </button>
                                    </>
                                )}
                       
                        <span
                            className="font-sm font-bold text-gray-600"
                            dir="rtl"
                        >
                            {item.price} تومان
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SaladItem;
