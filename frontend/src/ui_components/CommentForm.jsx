
function CommentForm({onSubmit,onChangeInput,text}){
    return <>
        <div className="flex rounded-md mt-3 bg-white p-3 justify-between">
            <input onChange={onChangeInput} value={text} name="comment_content" type="text" placeholder="توهم نظرخودتو برامون بنویس" className="border-o outline-0 text-right text-sm sm:w-3/4 font-medium" dir="rtl" />
            <button onClick={onSubmit} className="rounded-md p-3 bg-black text-white cursor-pointer">ارسال نظر</button>
        </div>
    </>
};


export default CommentForm;