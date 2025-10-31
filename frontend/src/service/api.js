import axios from "axios";

export const BASEURL = "http://127.0.0.1:8000";
// export const BASEURL = "https://caden-bulkheaded-unregally.ngrok-free.app";

const api = axios.create({
    baseURL: BASEURL,
});

export default api;
