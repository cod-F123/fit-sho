import { BASEURL } from "../service/api";
import { Link } from "react-router-dom";
import { useContext, useEffect, useRef } from "react";
import { CartContext } from "../contexts/CartContext";
import { animate, stagger } from "animejs";

function ProductCard({ product }) {
    const { addToCart, existProductInCart, removeFromCart } =
        useContext(CartContext);

    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        
                        animate(".productCard", {
                            opacity : [0.5,1],
                            scale : [0.8,1]
                        });
                        observer.unobserve(ref.current);
                    }
                });
            },
            { threshold: 0.2 }
        );

        observer.observe(ref.current);

        return () => observer.disconnect();
    }, []);
    return (
        <>
            <div
                ref={ref}
                className="col-span-6 productCard md:col-span-3 bg-white rounded-lg"
            >
                <img
                    src={`${BASEURL}${product.image}`}
                    alt={product.name}
                    className="rounded-t-lg w-full"
                />
                <div className="flex flex-col p-2">
                    <h4 className="font-bold text-right">{product.name}</h4>
                    <div className="flex flex-col-reverse sm:flex-row justify-between px-3 py-2 my-3 rounded-2xl bg-gray-300">
                        <Link
                            to={`/products/detail/${product.slug}`}
                            className="font-medium flex items-center text-sm"
                        >
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
                            جزئیات بیشتر
                        </Link>

                        <span
                            className="text-sm font-bold text-gray-600"
                            dir="rtl"
                        >
                            {product.calories} کالری
                        </span>
                    </div>
                    <div className="flex flex-col-reverse sm:flex-row justify-between items-center">
                        {product.is_exist ? (
                            <>
                                {existProductInCart(product.slug) ? (
                                    <>
                                        <button
                                            onClick={() => {
                                                removeFromCart(product.slug);
                                            }}
                                            className="rounded-lg bg-red-500 text-white max-sm:w-full px-2 py-2 cursor-pointer transition-all ease-in border-2 duration-150 hover:shadow-md border-red-500 hover:bg-white hover:text-red-500"
                                        >
                                            حذف از سبد
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => {
                                                addToCart(
                                                    product,
                                                    1,
                                                    product.price,
                                                    false,
                                                    [],
                                                    [],
                                                    "",
                                                    0
                                                );
                                            }}
                                            className="rounded-lg bg-green-500 text-white max-sm:w-full px-2 py-2 cursor-pointer transition-all ease-in border-2 duration-150 hover:shadow-md border-green-500 hover:bg-white hover:text-green-500"
                                        >
                                            سفارش
                                        </button>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <button className="rounded-lg bg-red-600 text-white max-sm:w-full px-2 py-2 cursor-pointer transition-all ease-in border-2 duration-150 hover:shadow-md border-red-600 hover:bg-white hover:text-red-600">
                                    اتمام موجودی
                                </button>
                            </>
                        )}

                        <span
                            className="font-sm font-bold text-gray-600"
                            dir="rtl"
                        >
                            {product.price} تومان
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProductCard;
