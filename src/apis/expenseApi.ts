import { Expense } from "../types/expenseTypes";
import axiosInstance from "../utils/axiosInstance";

const isProduction = true;

const BASE_PATH = isProduction
  ? "https://www.devifai.website/api/master/account_manager"
  : "http://localhost:8000/api/master/account_manager";

// Get all expenses
export const getAllExpenses = async (): Promise<Expense[]> => {
  try {
    const res = await axiosInstance.get(`${BASE_PATH}/all-expenses`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch expenses", error);
    throw error;
  }
};

// Get a single expense by ID
export const getExpenseById = async (id: string): Promise<Expense> => {
  try {
    const res = await axiosInstance.get(`${BASE_PATH}/expense/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to fetch expense with ID ${id}`, error);
    throw error;
  }
};
