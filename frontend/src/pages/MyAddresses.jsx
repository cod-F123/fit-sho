import { useContext, useState, useEffect } from "react";
import AccountSidebar from "../ui_components/AccountSidebar";
import Input from "../ui_components/Input";
import TextArea from "../ui_components/TextArea";
import api from "../service/api";
import { AlertContext } from "../contexts/AlertContext";
import { Helmet } from "react-helmet-async";


function MyAddresses() {
    const [addresses, setAddresses] = useState([]);
    const [showFrom, setShowForm] = useState(false);
    const [addressForm, setAddressForm] = useState({});

    const {setAlert} = useContext(AlertContext);

    useEffect(() => {
        api.get("/accounts/addresses/")
            .then((res) => {
                setAddresses(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const inputOnChange = (e)=>{
        setAddressForm((prev)=>({...prev,[e.target.name] : e.target.value}));
    };

    const submitClicked = ()=>{
        api.post("/accounts/addresses/",addressForm).then((res)=>{
            setAddresses((prev)=>([...prev,res.data]))
        }).catch((error)=>{
            setAlert("لطفا اطلاعات را به درستی وارد کنید")
        }).finally(()=>{
            setShowForm(false);
        })
    }


    const deleteClicked = (id_address)=>{
        api.delete("/accounts/addresses/",{data:{"address_id":id_address}}).then((res)=>{
            setAddresses((prev)=>{
                return prev.filter(item=>item.id !== id_address);
            })
            setAlert("آدرس با موفقیت حذف شد");
        }).catch((error)=>{
            setAlert("لطفا دقایقی دیگر تلاش کنید");
        })
    }

    return (
        <>
        <Helmet><title>آدرس های من | fit bama</title></Helmet>
            <div className="min-h-screen bg-gray-300 w-full px-7 sm:px-11 lg:px-20 md:gap-10 pb-5 mt-5 pt-8">
                <div className="grid relative z-10 grid-cols-12 md:gap-5">
                    <div
                        className={`w-full bg-gray-300 m-0 h-full transition-opacity flex duration-200 justify-center md:items-center absolute top-0 ${
                            showFrom ? "z-40 opacity-100" : "-z-40 opacity-0"
                        }`}
                    >
                        <div className="md:w-1/2 shadow relative mt-40 max-h-content md:-mt-32 w-full p-3 md:p-5 rounded-xl bg-gray-100">
                            <button
                                className="absolute top-2 right-2 cursor-pointer"
                                onClick={() => {
                                    setShowForm(false);
                                }}
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
                            <p className="text-black text-center">
                                آدرس خودرا وارد کنید
                            </p>

                            <Input onChange={inputOnChange} label={"عنوان"} type={"text"} maxLength={255} name={"title"} id={"id_title"} />
                            <TextArea onChange={inputOnChange} label={"آدرس"} id={"id_address"} name={"address"} />
                            <Input onChange={inputOnChange} type={"number"} maxLength={10} label={"کدپستی"} id={"id_zip_code"} name={"zip_code"} />
                            <button onClick={()=>{submitClicked()}} className="rounded-md px-5 max-sm:w-full bg-green-600 text-white cursor-pointer py-2 ">ذخیره</button>

                        </div>
                    </div>
                    <div
                        className="md:col-span-8 col-span-12 max-h-conten"
                        dir="rtl"
                    >
                        <div className="flex flex-row-reverse p-3 md:p-5 rounded-md bg-white max-h-content justify-between items-center">
                            <button
                                onClick={() => {
                                    setShowForm(true);
                                }}
                                className="bg-black text-white cursor-pointer px-3 py-2 rounded-md "
                            >
                                افزودن آدرس
                            </button>{" "}
                            <span className="text-sm font-bold">آدرس ها</span>
                        </div>
                        {addresses.length == 0 ? (
                            <>
                                <p className="text-center mt-32 font-bold">
                                    آدرسی وجود ندارد
                                </p>
                            </>
                        ) : (
                            <>
                                {addresses.map((address) => {
                                    return (
                                        <div
                                            key={address.id}
                                            className=" text-right mt-5 font-medium text-sm rounded-md bg-white flex flex-col md:flex-row md:justify-between justify-center md:items-center items-start p-3 md:p-5 max-h-content "
                                        >
                                            <div className="flex flex-col items-start">
                                                <span className="font-md text-lg">
                                                    {address.title}
                                                </span>
                                                <span>{address.address}</span>
                                                <span className="font-sm text-sm mt-1">
                                                    کد پستی : {address.zip_code}
                                                </span>
                                            </div>
                                            <div className="flex w-full md:w-7 justify-end">
                                                <button onClick={()=>{deleteClicked(address.id)}} className="text-red-700 cursor-pointer">
                                                    حذف
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                        )}
                    </div>
                    <AccountSidebar />
                </div>
            </div>
        </>
    );
}

export default MyAddresses;
