import { useEffect, useState } from "react";
import api from "../service/api";
import ProductCard from "../ui_components/ProductCard";

function Products() {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [categorySelected, setCategorySelected] = useState("");

    useEffect(() => {
        api.get("/shop/getProducts/")
            .then((res) => {
                setCategories(res.data.categories);
                setProducts(res.data.products);

                setCategorySelected("همه محصولات");

                setIsLoading(false);
            })
            .catch((error) => {
                setIsLoading(false);
                console.log(error);
            });
    }, []);

    console.log(products)

    const filterCategory = (cName) => {
        setCategorySelected(cName);
        api.get(`/shop/getProducts/?category=${cName}`).then((res) => {
            setProducts(res.data.products);
        });
    };

    return (
        <>
            {isLoading ? (
                <>
                    <div className="w-full top-0 bottom-0 absolute z-50 flex bg-gray-300 justify-center items-center">
                        <span class="loader"></span>
                    </div>
                </>
            ) : (
                <>
                    <div className=" bg-gray-300 w-full px-7 sm:px-11 lg:px-20 py-11 min-h-screen">
                        <h1 className="w-full text-right text-lg font-bold">
                            غذاهای روزانه
                        </h1>
                        <div className="grid grid-cols-12 relative gap-4 my-4">
                            <div className="col-span-12">
                                <div className="flex gap-2 md:gap-4 justify-center scrollbar-hide cursor-all-scroll overflow-x-auto s py-2 ">
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
                            <div className="col-span-12 grid grid-cols-12 gap-4">
                                {products.length < 1 ? (
                                    <>
                                        <div className="col-span-12 text-white pt-5 text-3xl font-bold text-center">
                                            محصولی برای نمایش موجود نمی باشد
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {products.map((product) => (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                            />
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default Products;
