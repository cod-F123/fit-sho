
function ShipmentItem({item}){
    return <>
        <div className={`col-span-6 md:col-span-3 font-bold flex justify-between max-h-content rounded-md mb-5  bg-gray-100 p-2 md:p-5 ${item.status == "delivered" | item.status == "delivering" ? "bg-green-400" : item.status == "failed" ? "bg-red-400" : ""}`}>
            <span>زمان ارسال : {item.date}</span>
            <span>وضعیت : {item.status == "delivered" | item.status == "delivering" ? "ارسال شده" : item.status == "pending" ? "درانتظار ارسال" : "ناموفق"}</span>
        </div>
    </>
};

export default ShipmentItem;