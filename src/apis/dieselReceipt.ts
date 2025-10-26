// src/api/dieselReceiptApi.ts

import axiosInstance from "../utils/axiosInstance";

const isProduction = true; // Set to true in production

const BASE_PATH = isProduction
  ? "https://www.devifai.website/api/master/mechanic/diselreciept"
  : "http://localhost:8000/api/master/mechanic/diselreciept";

export const getAllDieselReceipt = async (): Promise<any[]> => {
  try {
    const res = await axiosInstance.get(`${BASE_PATH}`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch diesel receipts", error);
    throw error;
  }
};
