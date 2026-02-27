import axios from "axios"


const backendUrl = process.env.BUN_PUBLIC_NODE_BASE_URL ?? "http://localhost:3200";

export const api = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

export { backendUrl }
