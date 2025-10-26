// src/api/materialBillTransactionApi.ts
import axiosInstance from "../utils/axiosInstance";
import { MaterialBillTransaction } from "../types/materialBillTransactionTypes";

const isProduction = true;

const BASE_PATH = isProduction
  ? "https://www.devifai.website/api/master/account_manager"
  : "http://localhost:8000/api/master/account_manager";

// Get all material bill transactions
export const getAllMaterialBillTransactions = async (): Promise<MaterialBillTransaction[]> => {
  try {
    const res = await axiosInstance.get(`${BASE_PATH}/all-bills`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch material bill transactions", error);
    throw error;
  }
};

// Get a material bill transaction by ID
export const getMaterialBillTransactionById = async (
  id: string
): Promise<MaterialBillTransaction> => {
  try {
    const res = await axiosInstance.get(`${BASE_PATH}/bill/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to fetch material bill transaction with ID ${id}`, error);
    throw error;
  }
};
