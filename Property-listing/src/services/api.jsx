import axios from "axios";

// Use environment variable
const BASE = import.meta.env.VITE_API_BASE; 
const RESOURCE = "/api/properties";
const API_URL = `${BASE}${RESOURCE}`;

export const getProperties = async () => {
  return axios.get(API_URL);
};

export const addProperty = async (payload) => {
  return axios.post(API_URL, payload);
};
