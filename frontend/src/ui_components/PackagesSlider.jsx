import { useState, useEffect } from "react";
import api from "../service/api";
import PackageCard from "./PackageCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

function PackagesSlider() {
    const [packages, setPackages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log("3");
        api.get("http://127.0.0.1:8000/shop/getPackages/")
            .then((res) => {
                setPackages(res.data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    }, []);

    return (
        <>
            <div className="col-span-12" dir="rtl">
                <p className="text-right text-md mb-3 font-bold">بسته های هفتگی </p>
                <Swiper
                    spaceBetween={20}
                    slidesPerView={3}
                    breakpoints={{
                        320: { slidesPerView: 1, spaceBetween: 10 },
                        640: { slidesPerView: 2, spaceBetween: 15 },
                        1024: { slidesPerView: 3, spaceBetween: 10 },
                    }}
                    grabCursor={true}
                    
                    loop={packages.length > 3} 
                    className="w-full"
                >
                    {packages.map((pkg) => (
                        <SwiperSlide key={pkg.slug} className="py-2">
                            <div className=" border border-gray-300 rounded-md">
                                <PackageCard pkg={pkg} />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </>
    );
}

export default PackagesSlider;
