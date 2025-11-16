import Nav from "./Nav";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import Alert from "./Alert";
import { useState, useContext } from "react";
import { AlertContext } from "../contexts/AlertContext";

function AppLayout() {
    const { alertMessage } = useContext(AlertContext);

    return (
        <>
            <main className="min-h-screen selection:text-white selection:bg-black  z-0 flex flex-col w-full relative">
                <Nav />
                {alertMessage && <Alert message={alertMessage} />}
                <div className="mt-20 ">
                    <Outlet />
                </div>
                <Footer />
            </main>
        </>
    );
}

export default AppLayout;
export { AlertContext };
