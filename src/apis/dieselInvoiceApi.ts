import { DieselInvoice } from "../types/dieselInvoiceTypes";
import axiosInstance from "../utils/axiosInstance";

const isProduction = true;

const BASE_PATH = isProduction
  ? "https://www.devifai.website/api/master/account_manager"
  : "http://localhost:8000/api/master/account_manager";

// Get all diesel invoices
export const getAllDieselInvoices = async (): Promise<DieselInvoice[]> => {
  try {
    const res = await axiosInstance.get(`${BASE_PATH}/all-invoices`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch diesel invoices", error);
    throw error;
  }
};

// Get a diesel invoice by ID
export const getDieselInvoiceById = async (
  id: string
): Promise<DieselInvoice> => {
  try {
    const res = await axiosInstance.get(`${BASE_PATH}/invoice/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to fetch diesel invoice with ID ${id}`, error);
    throw error;
  }
};
