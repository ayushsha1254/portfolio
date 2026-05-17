import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: import.meta.env.VITE_AUTH_TOKEN || "",
  },
});

export default instance;
