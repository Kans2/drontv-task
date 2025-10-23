import axios from "axios";

const BASE = "http://localhost:5000";
const RESOURCE = "/properties";
const API_URL = `${BASE}${RESOURCE}`;

export const getProperties = async () => {
  return axios.get(API_URL);
};

export const addProperty = async (payload) => {
  return axios.post(API_URL, payload);
};
