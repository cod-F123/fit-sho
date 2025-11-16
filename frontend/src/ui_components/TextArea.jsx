

function TextArea({label,name,id,onChange}){
    return <>
        <div className="flex rounded-lg border border-box my-3 border-gray-300 relative">
            <span className="absolute text-sm  -top-3 bg-gray-100 right-1.5" dir="rtl">{label}</span>
            <textarea name={name} id={id} onChange={onChange} className="border-0 max-h-32 pr-3 pt-2 w-full outline-0" dir="rtl" ></textarea>
        </div>
    </>
};


export default TextArea;