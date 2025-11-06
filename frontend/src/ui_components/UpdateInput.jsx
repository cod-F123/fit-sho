function UpdateInput({
    name,
    id,
    maxLength,
    type,
    onChange,
    label,
    value,
    isDisabled,
}) {
    return (
        <>
            <div className="flex rounded-lg h-10 md:h-11 border border-box my-3 border-gray-300 relative">
                <span
                    className="absolute text-sm  -top-3 bg-gray-100 right-1.5"
                    dir="rtl"
                >
                    {label}
                </span>
                {isDisabled ? (
                    <>
                        <input
                            type={type}
                            maxLength={maxLength}
                            name={name}
                            id={id}
                            onChange={onChange}
                            value={value}
                            className="border-0 pl-3 w-full outline-0 pr-3"
                            disabled
                        />
                    </>
                ) : (
                    <>
                        {" "}
                        <input
                            type={type}
                            maxLength={maxLength}
                            name={name}
                            id={id}
                            onChange={onChange}
                            value={value}
                            className="border-0 pl-3 w-full outline-0 pr-3"
                        />
                    </>
                )}
            </div>
        </>
    );
}

export default UpdateInput;
