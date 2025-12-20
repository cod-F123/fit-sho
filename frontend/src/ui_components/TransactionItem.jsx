import { Link } from "react-router-dom";

function TransactionItem({ transaction }) {
    return (
        <>
            <div className="col-span-6 mt-5 rounded-md bg-white p-5">
                
                <div className="flex gap-1 lg:justify-between md:items-center flex-col md:flex-row-reverse" >
                    <span className="text-sm font-bold" dir="rtl">
                        وضعیت : {transaction.status == "payed" ? <span className="text-green-700 font-bold">پرداخت شده</span > : <span className="text-red-700 font-bold">درانتظار پرداخت</span>}
                    </span>
                    <span className="text-sm font-bold">
                        تاریخ تراکنش :{transaction.create_at}
                    </span>
                    <span className="text-sm font-bold">
                        مبلغ تراکنش :{transaction.amount} تومان
                    </span>
                    <Link
                        to={`/accounts/orders/${transaction.order.order_id}`}
                        className="text-sm text-blue-500 font-bold"
                    >
                        شماره سفارش : #{transaction.order.order_number}
                    </Link>
                </div>
            </div>
        </>
    );
}

export default TransactionItem;
