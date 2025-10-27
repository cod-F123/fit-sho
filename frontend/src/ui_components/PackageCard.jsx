import { Link } from "react-router-dom";
import { BASEURL } from "../service/api";

function PackageCard({pkg}) {
    return (
        <>
            <div className="col-span-12 sm:col-span-6 lg:col-span-4" dir="ltr">
                <Link className="" to={`/packages/detail/${pkg.slug}`}>
                    <div className="w-full bg-white rounded-md p-4">
                        <div className="">
                            <img
                                src={`${BASEURL}${pkg ? pkg.image : "/assets/images/package_image/51a168da35863a687e4e950b214f5479.jpg"}`}
                                alt="image"
                                loading="lazy"
                                className="rounded-lg w-full object-cover object-center"
                            />
                        </div>
                        <div className="flex flex-row-reverse mt-4 justify-between">
                            <h3 className="font-bold">بسته {pkg.name}</h3>
                            <span className="font-medium flex text-sm">
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
                            </span>
                        </div>
                        <p dangerouslySetInnerHTML={{__html:pkg.feature}} className="text-gray-500 font-light text-right text-sm">
                            
                        </p>
                    </div>
                </Link>
            </div>
        </>
    );
}

export default PackageCard;
