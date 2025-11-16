import PackageCard from "../ui_components/PackageCard";
import { useEffect, useState } from "react";
import api from "../service/api";
import { Helmet } from "react-helmet-async";

function Packages() {
    const [packages, setPackages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.get("/shop/getPackages/")
            .then((res) => {
                setPackages(res.data);
                setIsLoading(false);
            })
            .catch((err) => {
                setIsLoading(false);
            });
    }, []);

    return (
        <>
            <Helmet><title>بسته های هفتگی رژیمی</title></Helmet>
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
                            بسته های هفتگی
                        </h1>
                        <div className="grid grid-cols-12 gap-4 my-4">
                            {packages.map((pkg) => {
                                return <PackageCard key={pkg.slug} pkg={pkg} />;
                            })}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default Packages;
