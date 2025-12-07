import {
    Navigation,
    Pagination,
    Scrollbar,
    A11y,
    Autoplay,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Link } from "react-router-dom";
import PackagesSlider from "../ui_components/PackagesSlider";
import ProductSlider from "../ui_components/ProductSlider";
import { Helmet } from "react-helmet-async";
import banner1 from "../assets/images/banner1.jpg";
import banner2 from "../assets/images/banner2.jpg";
import banner3 from "../assets/images/banner3.jpg";
import banner4 from "../assets/images/banner4.jpg";
import banner5 from "../assets/images/banner5.jpg";
import salad1 from "../assets/images/salad1.png";
import salad2 from "../assets/images/salad2.png";

function Home() {
    return (
        <>
            <Helmet>
                <title>27534520</title>
            </Helmet>
            <div className="grid grid-cols-12 mx-2 md:mx-20 my-4 mt-7">
                <div className="col-span-12 mt-5">
                    <Swiper
                        pagination={{
                            type: "fraction",
                        }}
                        loop={true}
                        navigation={true}
                        modules={[Autoplay, Pagination, Navigation]}
                        className="bannerSlider"
                        autoplay={{
                            delay: 3500,
                            disableOnInteraction: false,
                        }}
                    >
                        <SwiperSlide>
                            <Link to={"/packages"}>
                                <img src={banner1} alt="slide" />
                            </Link>
                        </SwiperSlide>
                        <SwiperSlide>
                            <Link to={"/products"}>
                                <img src={banner2} alt="slide" />
                            </Link>
                        </SwiperSlide>
                        <SwiperSlide>
                            <Link>
                                <img src={banner3} alt="slide" />
                            </Link>
                        </SwiperSlide>
                        <SwiperSlide>
                            <Link to={"/packages"}>
                                <img src={banner4} alt="slide" />
                            </Link>
                        </SwiperSlide>
                        <SwiperSlide>
                            <Link to={"/products"}>
                                <img src={banner5} alt="slide" />
                            </Link>
                        </SwiperSlide>
                    </Swiper>
                </div>
                <div className="col-span-12 grid grid-cols-12 gap-5 my-5">
                    <Link className="md:col-span-3 col-span-6 rounded-md bg-gray-400 flex flex-col justify-center items-center p-5">
                        <img
                            src="https://getjoule.co/assets/images/home_icon/d3dfa52f4519cacefbb74f2a32035563.png"
                            className="w-24 rounded-full cursor-pointer hover:bg-gray-200 p-3"
                            alt="cat"
                        />
                        <h2 className="text-center">
                            کتابچه های آشپزی غذای رژیمی
                        </h2>
                    </Link>
                    <Link
                        to={"/products"}
                        className="md:col-span-3 col-span-6 rounded-md bg-gray-400 flex flex-col justify-center items-center p-5"
                    >
                        <img
                            src="https://getjoule.co/assets/images/home_icon/c1d089450ed839fa99e53cbafd5cd4ee.png"
                            className="w-24 rounded-full cursor-pointer hover:bg-gray-200 p-3"
                            alt="cat"
                        />
                        <h2 className="text-center">سوپرمارکت رژیمی و سلامت</h2>
                    </Link>
                    <Link
                        to="/products"
                        className="md:col-span-3 col-span-6 rounded-md bg-gray-400 flex flex-col justify-center items-center p-5"
                    >
                        <div className="rounded-full cursor-pointer hover:bg-gray-200 p-3">
                            <img
                                src="https://getjoule.co/assets/images/home_icon/c71ce6c864c594ca8b92ab8e9e0c9705.png"
                                className="w-20"
                                alt="cat"
                            />
                        </div>

                        <h2 className="text-center">سفارش روزانه غذای رژیمی</h2>
                    </Link>

                    <Link
                        to="/packages"
                        className="md:col-span-3 col-span-6 rounded-md bg-gray-400 flex flex-col justify-center items-center p-5"
                    >
                        <img
                            src="https://getjoule.co/assets/images/home_icon/b812eecadbf26e303db2d45c2e7c2295.png"
                            className="w-24 transition-all ease-in duration-200 rounded-full cursor-pointer hover:bg-gray-200 p-3"
                            alt="cat"
                        />
                        <h2 className="text-center">
                            بسته های هفتگی غذای رژیمی
                        </h2>
                    </Link>
                </div>

                <PackagesSlider />

                <Link to={"/makeSalad"} className="col-span-12 my-5 rounded-2xl flex  justify-between bg-green-50 p-2 md:p-5">
                    <div className="flex justify-start gap-5">
                        <img src={salad1} loading="lazy" className="w-36 lg:w-40" alt="salad" />
                        <img src={salad2} loading="lazy" className="w-0 lg:w-40" alt="salad" />
                    </div>
                    
                    <div>
                        <h2 className="font-bold text-2xl text-right md:text-4xl text-green-900">سالاد خودتو بساز</h2>
                        <p className="text-lg md:text-xl text-green-600 text-right mt-8">می تونی با هرچیزی که دوست داری سالاد خودتو بسازی</p>
                    </div>
                </Link>

                <ProductSlider />
            </div>
        </>
    );
}

export default Home;
