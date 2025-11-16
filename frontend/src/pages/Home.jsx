import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import image from "../assets/images/bos.png";
import { Link } from "react-router-dom";
import PackagesSlider from "../ui_components/PackagesSlider";
import ProductSlider from "../ui_components/ProductSlider";
import { Helmet } from "react-helmet-async";

function Home() {
    return (
        <>
        <Helmet><title>fit bama</title></Helmet>
            <div className="grid grid-cols-12 mx-2 md:mx-20 my-4 mt-7">
                <div className="col-span-12 mt-5">
                    <Swiper
                        pagination={{
                            type: "fraction",
                        }}
                        loop={true}
                        navigation={true}
                        modules={[Pagination, Navigation]}
                        className="bannerSlider"
                    >
                        <SwiperSlide>
                            <Link>
                                <img
                                    src="https://getjoule.co/assets/images/slide/a50d07a6aa86a69657b3562018e5b694.jpg"
                                    alt="slide"
                                />
                            </Link>
                        </SwiperSlide>
                        <SwiperSlide>
                            <Link>
                                <img
                                    src="https://getjoule.co/assets/images/slide/b7bca7eb45ed0c1f5c61b6f97d2fb7be.jpg"
                                    alt="slide"
                                />
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
                        <h2 className="text-center">کتابچه های آشپزی غذای رژیمی</h2>
                    </Link>
                    <Link to={"/products"} className="md:col-span-3 col-span-6 rounded-md bg-gray-400 flex flex-col justify-center items-center p-5">
                        <img
                            src="https://getjoule.co/assets/images/home_icon/c1d089450ed839fa99e53cbafd5cd4ee.png"
                            className="w-24 rounded-full cursor-pointer hover:bg-gray-200 p-3"
                            alt="cat"
                        />
                        <h2 className="text-center">سوپرمارکت رژیمی و سلامت</h2>
                    </Link>
                    <Link to="/products" className="md:col-span-3 col-span-6 rounded-md bg-gray-400 flex flex-col justify-center items-center p-5">
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
                        <h2 className="text-center">بسته های هفتگی غذای رژیمی</h2>
                    </Link>
                </div>
                
                <PackagesSlider />
                <br /><br />
                <ProductSlider />
                
            </div>
        </>
    );
}

export default Home;
