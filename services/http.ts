import axios from "axios";
import Constants from "expo-constants";

const API_BASE_URL =
    Constants.expoConfig?.extra?.API_BASE_URL;

console.log("📡 API_BASE_URL:", API_BASE_URL);

const http = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
});

export default http;
