import { useState, useContext } from "react";
import { AlertContext } from "../contexts/AlertContext";


function Alert({ message }) {
    const [isVisible, setIsVisible] = useState(true);
    const {setAlert} = useContext(AlertContext);

    if (!isVisible) return null;

    return (
        <>
            <div className="fixed z-50 top-32 right-5 py-4 rounded-md flex items-center justify-between px-2 bg-blue-300">
                <p className="text-white font-medium text-right">{message}</p>
                <button
                    className="ml-1.5 text-3xl text-red-500 border-0 cursor-pointer"
                    onClick={() => {setIsVisible(false);setAlert(null)}}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        className="bi bi-x-lg"
                        viewBox="0 0 16 16"
                    >
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                    </svg>
                </button>
            </div>
        </>
    );
}

export default Alert;
