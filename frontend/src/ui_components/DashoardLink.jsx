import { Link } from "react-router-dom";

function DashboardLink({ to, text }) {
    return (
        <>
            <Link to={to} className="flex flex-row mb-5 hover:border-b-gray-500 hover:text-blue-800 transition-all duration-200 justify-between items-center border-b pb-2 border-b-gray-300">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-chevron-left"
                    viewBox="0 0 16 16"
                >
                    <path
                        fillRule="evenodd"
                        d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
                    />
                </svg>
                <span>{text}</span>{" "}
            </Link>
        </>
    );
}

export default DashboardLink;
