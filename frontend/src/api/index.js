import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8080" });
API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("profile")).token
      }`;
  }
  return req;
});

export const login = (formData) => API.post("/api/user/login", formData);
export const signUp = (formData) => API.post("/api/user/signup", formData);
export const changePassword = (formData) => API.post("/api/user/changePassword", formData);
export const getTokens = () => API.get("/api/token");
export const tossCoin = (formData) => API.post("/api/coin-toss", formData);
export const getTosses = ({limit = 10}) => API.get(`/api/coin-toss?limit=${limit}`);
