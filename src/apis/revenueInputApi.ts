
import { RevenueInvoice } from "../types/revenueInvoiceTypes";
import axiosInstance from "../utils/axiosInstance";

const isProduction = true;

const BASE_PATH = isProduction
  ? "https://www.devifai.website/api/master/account_manager"
  : "http://localhost:8000/api/master/account_manager";

// Get all revenues
export const getAllRevenueInvoice = async (): Promise<RevenueInvoice[]> => {
  try {
    const res = await axiosInstance.get(`${BASE_PATH}/all/revenue-invoice`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch revenues", error);
    throw error;
  }
};

// Get a revenue by ID
export const getRevenueInvoiceById = async (id: string): Promise<RevenueInvoice> => {
  try {
    const res = await axiosInstance.get(`${BASE_PATH}/revenue-invoice/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to fetch revenue with ID ${id}`, error);
    throw error;
  }
};
