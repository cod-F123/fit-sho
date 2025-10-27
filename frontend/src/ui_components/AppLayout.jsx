import Nav from "./Nav";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";


function AppLayout() {
    return (
        <>
            <main className="min-h-screen selection:text-white selection:bg-black  z-0 flex flex-col w-full relative">
                <Nav />
                <div className="mt-20 ">
                    <Outlet />
                </div>
                <Footer />
            </main>
        </>
    );
}

export default AppLayout;