import { EquipmentTransaction } from "../types/equipmentTransactionTypes";
import axiosInstance from "../utils/axiosInstance";

const isProduction = true;

const BASE_PATH = isProduction
  ? "https://www.devifai.website/api/master/store_manager"
  : "http://localhost:8000/api/master/store_manager";

// Get all equipment transactions
export const getAllEquipmentTransactions = async (): Promise<
  EquipmentTransaction[]
> => {
  try {
    const res = await axiosInstance.get(`${BASE_PATH}/get/equipment`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch equipment transactions", error);
    throw error;
  }
};

// Get equipment transaction by ID
export const getEquipmentTransactionById = async (
  id: string
): Promise<EquipmentTransaction> => {
  try {
    const res = await axiosInstance.get(`${BASE_PATH}/equipment/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to fetch equipment transaction with ID ${id}`, error);
    throw error;
  }
};
