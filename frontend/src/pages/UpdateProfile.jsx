import api from "../service/api";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import AccountSidebar from "../ui_components/AccountSidebar";
import UpdateInput from "../ui_components/UpdateInput";
import {AlertContext} from "../ui_components/AppLayout";

function UpdateProfile() {
    const { user } = useContext(AuthContext);
    const [userProfile, setUserProfile] = useState({});

    const [profileChangeForm , setProfileChangeForm] = useState({
        height : 0.0,
        weight : 0.0,
        bmi : 0,
        body_category : ""
    });

    const navigate = useNavigate();

    const {setAlert} = useContext(AlertContext);

    useEffect(() => {
        if (!user["is_validate"]) {
            navigate("/accounts/validate");
        } else {
            api.get("/accounts/profile/")
                .then((res) => {
                    setUserProfile(res.data);
                    setProfileChangeForm({
                        height : res.data.height,
                        weight : res.data.weight,
                        bmi : res.data.bmi,
                        body_category : res.data.body_category
                    });

                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, []);

    const onChangeForm = (e)=>{
        setProfileChangeForm((prev)=>({
            ...prev,[e.target.name] : e.target.value
        }));
    };

    const onSubmitChangeForm = ()=>{
        api.post("/accounts/profile/",profileChangeForm).then((res)=>{
            setUserProfile(res.data);
            setAlert("پروفایل شما آپدیت شد");
        }).catch((error)=>{
            setAlert("مشکلی پیش آمدد دقلیقی دیگر مجدد امتحان کنید");
        });
    };


    return (
        <>
            <div className="min-h-screen bg-gray-300 w-full px-7 sm:px-11 lg:px-20 md:gap-10 pb-5 mt-5 pt-8">
                <div className="grid grid-cols-12 md:gap-5">
                    <div
                        className="md:col-span-8 col-span-12 max-h-content bg-gray-100 p-3 md:p-5 rounded-md grid grid-cols-6"
                        dir="rtl"
                    >
                        <div className="col-span-6 grid gap-5 grid-cols-6">
                            <div className="md:col-span-3 col-span-6">
                                <UpdateInput
                                    name={"phone"}
                                    id={"11"}
                                    label={"شماره تماس"}
                                    maxLength={"13"}
                                    type={"tel"}
                                    value={user.phone}
                                    onChange={() => {}}
                                    isDisabled={true}
                                />
                            </div>
                        </div>

                        <div className="col-span-6 grid gap-5 grid-cols-6">
                            <div className="md:col-span-3 col-span-6">
                                <UpdateInput
                                    name={"first_name"}
                                    label={"نام*"}
                                    maxLength={"150"}
                                    type={"text"}
                                    value={user.first_name}
                                    onChange={() => {}}
                                    isDisabled={true}
                                />
                            </div>
                            <div className="md:col-span-3 col-span-6">
                                <UpdateInput
                                    name={"last_name"}
                                    label={"نام خانوادگی*"}
                                    maxLength={"150"}
                                    type={"text"}
                                    value={user.last_name}
                                    onChange={() => {}}
                                    isDisabled={true}
                                />
                            </div>
                        </div>
                        <div className="col-span-6 grid gap-5 grid-cols-12">
                            <div className="col-span-6 md:col-span-3">
                                <UpdateInput
                                    name={"height"}
                                    onChange={onChangeForm}
                                    type={"number"}
                                    maxLength={3}
                                    value={profileChangeForm.height}
                                    label={"قدت چقدره؟(cm)"}
                                />
                            </div>
                            <div className="col-span-6 md:col-span-3">
                                <UpdateInput
                                    name={"weight"}
                                    onChange={onChangeForm}
                                    type={"number"}
                                    maxLength={3}
                                    value={profileChangeForm.weight}
                                    label={"وزنت چقدره؟(kg)"}
                                />
                            </div>
                            <div className="col-span-6 md:col-span-3">
                                <UpdateInput
                                    name={"bmi"}
                                    onChange={()=>{}}
                                    type={"number"}
                                    isDisabled={true}
                                    maxLength={100}
                                    value={userProfile.bmi}
                                    label={"BMI شما"}
                                />
                            </div>
                            <div className="col-span-6 md:col-span-3">
                                <UpdateInput
                                    name={"body_category"}
                                    onChange={()=>{}}
                                    type={"text"}
                                    maxLength={100}
                                    isDisabled={true}
                                    value={userProfile.body_category}
                                    label={"دسته بدنی شما"}
                                />
                            </div>
                        </div>
                        <div className="col-span-6 flex justify-center mt-5">
                            <button onClick={onSubmitChangeForm} className="rounded-md cursor-pointer bg-gray-900 text-white px-7 py-2">ذخیره اطلاعات</button>
                        </div>
                    </div>
                    <AccountSidebar />
                </div>
            </div>
        </>
    );
}

export default UpdateProfile;
