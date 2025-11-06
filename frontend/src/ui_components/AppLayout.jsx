import Nav from "./Nav";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import Alert from "./Alert";
import { createContext, useState } from "react";



const AlertContext = createContext();

function AppLayout() {

    const [alertMessage,setAlert] = useState(null)

    return (
        <>  
        <AlertContext.Provider value={{alertMessage,setAlert}}>
            <main className="min-h-screen selection:text-white selection:bg-black  z-0 flex flex-col w-full relative">
                <Nav />
                {alertMessage && <Alert message={alertMessage} />}
                <div className="mt-20 ">
                    <Outlet />
                </div>
                <Footer />
            </main>
        </AlertContext.Provider>
        </>
    );
}

export default AppLayout;
export { AlertContext };