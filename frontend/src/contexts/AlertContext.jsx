import { useContext, useState } from "react";
import { createContext } from "react";

export const AlertContext = createContext();

function AlertProvider({children}){

    const [alertMessage,setAlert] = useState(null)

    return (<AlertContext.Provider value={{alertMessage, setAlert}}>
        {children}
    </AlertContext.Provider>)
}

export default AlertProvider;