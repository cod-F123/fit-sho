import {} from "lucide-react";
import { Link } from "react-router-dom";

function OrderItem({ order }) {
    return (
        <>
            <div className="col-span-6 rounded-md bg-white gap-5 lg:gap-20 p-3 flex flex-row-reverse items-center">
                <span className="text-red-900 rounded-lg p-4 bg-red-300">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        fill="currentColor"
                        className="bi bi-basket2-fill"
                        viewBox="0 0 16 16"
                    >
                        <path d="M5.929 1.757a.5.5 0 1 0-.858-.514L2.217 6H.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h.623l1.844 6.456A.75.75 0 0 0 3.69 15h8.622a.75.75 0 0 0 .722-.544L14.877 8h.623a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1.717L10.93 1.243a.5.5 0 1 0-.858.514L12.617 6H3.383zM4 10a1 1 0 0 1 2 0v2a1 1 0 1 1-2 0zm3 0a1 1 0 0 1 2 0v2a1 1 0 1 1-2 0zm4-1a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1" />
                    </svg>
                </span>
                <div className="flex gap-1 lg:gap-20 items-end md:items-center flex-col md:flex-row-reverse">
                  <span className="text-sm font-bold">تاریخ سفارش :  {order.create_at}</span>
                  <span className="text-sm font-bold">مبلغ سفارش : {order.amount} تومان</span>
                  <Link to={`/accoutns/orders/${order.order_id}`} className="text-sm text-blue-500 font-bold">شماره سفارش : #{order.order_number}</Link>
                </div>
            </div>
        </>
    );
}

export default OrderItem;
