import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001", // NestJS 백엔드 주소
  withCredentials: true,
});

export default api;
