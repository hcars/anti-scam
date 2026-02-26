import axios from "axios"



const backendUrl = "http://localhost:3200";

export const api = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

export { backendUrl }
