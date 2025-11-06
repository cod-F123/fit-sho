import axios from "axios";

export const BASEURL = "http://127.0.0.1:8000";
// export const BASEURL = "https://testshop.pythonanywhere.com";

const api = axios.create({
    baseURL: BASEURL,
});

api.interceptors.request.use(
    (config) => {
        const access = localStorage.getItem("access");
        if (access) {
            config.headers.Authorization = `Bearer ${access}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            localStorage.getItem("refresh")
        ) {
            originalRequest._retry = true;
            try {
                const refresh = localStorage.getItem("refresh");

                
                const res = await axios.post(
                    `${BASEURL}/accounts/token/refresh/`,
                    {
                        refresh,
                    }
                );

                // ذخیره access جدید
                localStorage.setItem("access", res.data.access);

                originalRequest.headers.Authorization = `Bearer ${res.data.access}`;

                return api(originalRequest);
            } catch (refreshError) {
                console.error("❌ Refresh token expired or invalid");

                localStorage.removeItem("access");
                localStorage.removeItem("refresh");

                if (typeof window !== "undefined") {
                    window.location.href = "/accounts/login";
                }
            }
        }

        return Promise.reject(error);
    }
);

export default api;
