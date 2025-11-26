import axios from "axios";

const aiAxios = axios.create({
    baseURL: "http://127.0.0.1:8000",   // FastAPI URL
});

export default aiAxios;
