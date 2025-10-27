import { useState, useEffect } from "react";
import api from "../service/api";
import ProductCard from "./ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";


function ProductSlider() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log("3");
        api.get("/shop/getProducts")
            .then((res) => {
                setProducts(res.data.products);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    }, []);

    return (
        <>
            <div className="col-span-12 bg-gray-300 rounded-2xl p-5" dir="rtl">
                <p className="text-right text-md mb-3 font-bold">بسته های هفتگی </p>
                <Swiper
                    spaceBetween={20}
                    slidesPerView={3}
                    breakpoints={{
                        320: { slidesPerView: 1, spaceBetween: 10 },
                        640: { slidesPerView: 4, spaceBetween: 15 },
                        1024: { slidesPerView: 5, spaceBetween: 10 },
                    }}
                    grabCursor={true}
                    
                    loop={products.length > 3} 
                    className="w-full"
                >
                    {products.map((product) => (
                        <SwiperSlide key={product.slug} className="py-2">
                            <div className=" border border-gray-300 rounded-md" dir="ltr">
                                <ProductCard product={product} />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </>
    );
}

export default ProductSlider;
