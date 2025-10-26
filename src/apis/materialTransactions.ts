import axiosInstance from "../utils/axiosInstance";

// Toggle this flag depending on environment
const isProduction = true;

const BASE_PATH = isProduction
  ? "https://www.devifai.website/api/master/store_manager/get/transactions"
  : "http://localhost:8000/api/master/store_manager/get/transactions";

export const getAllMaterialTransactions = async (): Promise<any[]> => {
  try {
    const res = await axiosInstance.get(`${BASE_PATH}`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch material transactions", error);
    throw error;
  }
};
