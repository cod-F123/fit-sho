import { Helmet } from "react-helmet-async";
import Nav from "../ui_components/Nav";

function Page404() {
    return (
        <>
            <Helmet><title>صفحه پیدا نشد 404</title></Helmet>
            <div className="grid grid-cols-12 mx-12 my-4 min-h-1/2 place-items-center place-content-center">
                <div className="col-span-12 bg-gray-200 rounded-md p-4">
                    <h1 className="text-center font-bold text-2xl">صفحه مورد نظر یافت نشد</h1>
                </div>
            </div>
        </>
    );
}

export default Page404;