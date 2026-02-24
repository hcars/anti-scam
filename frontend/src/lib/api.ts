import axios from "axios"



const backendUrl = import.meta.env.NODE_BASE_URL

export const api = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

export { backendUrl }
