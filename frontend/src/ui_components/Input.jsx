

function Input({name,id,maxLength,type,onChange,label}){
    return <>
        <div className="flex rounded-lg h-10 md:h-11 border border-box my-3 border-gray-300 relative">
            <span className="absolute text-sm  -top-3 bg-gray-100 right-1.5" dir="rtl">{label}</span>
            <input type={type} maxLength={maxLength} name={name} id={id} onChange={onChange} className="border-0 px-3 w-full outline-0" />
        </div>
    </>
};


export default Input;