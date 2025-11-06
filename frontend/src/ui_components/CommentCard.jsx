function CommentCard({commentData}) {
    return (
        <>
            <div className="col-span-6 p-2 md:p-4 mb-5 bg-white rounded-md">
                <div className="commentAuthor flex content-end items-center">
                    <img
                        className="w-10"
                        src="https://getjoule.co/assets/desktop/images1/fotor-20240123182513.png"
                        alt="imgAuthor"
                    />
                    <span className="font-sm font-medium mr-3">
                        {commentData.author.first_name} {commentData.author.last_name}
                    </span>
                </div>
                <p className="text-right mt-3 text-sm ">
                    {commentData.content}
                </p>
            </div>
        </>
    );
}

export default CommentCard;
