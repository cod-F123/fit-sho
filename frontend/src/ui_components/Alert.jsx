import { useState } from "react";

function Alert({message}) {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
            <>
                <div className="fixed z-50 top-32 right-5 py-2 rounded-2xl flex items-center justify-between px-2 bg-blue-300">
                    <p className="text-white font-medium text-right">
                        {message}
                    </p>
                    <button className="ml-1.5 text-3xl text-red-500 border-0 cursor-pointer" onClick={() => setIsVisible(false)}>x</button>
                </div>
            </>
    );
};


export default Alert;
