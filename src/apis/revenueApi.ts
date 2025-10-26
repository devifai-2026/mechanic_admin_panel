import { RevenueMaster } from "../types/revenueMasterTypes.";
import axiosInstance from "../utils/axiosInstance";

// Get all revenues
export const fetchRevenues = async (): Promise<RevenueMaster[]> => {
  try {
    const res = await axiosInstance.get("/revenue_master/getAll");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch revenues", error);
    throw error;
  }
};

// Get revenue by ID
export const fetchRevenueById = async (id: string): Promise<RevenueMaster> => {
  try {
    const res = await axiosInstance.get(`/revenue_master/get/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to fetch revenue with id ${id}`, error);
    throw error;
  }
};

// Create revenue
export const createRevenue = async (
  payload: Omit<RevenueMaster, "id" | "createdAt" | "updatedAt">
): Promise<RevenueMaster> => {
  try {
    const res = await axiosInstance.post("/revenue_master/create", payload);
    return res.data;
  } catch (error) {
    console.error("Failed to create revenue", error);
    throw error;
  }
};

// Update revenue
export const updateRevenue = async (
  id: string,
  payload: Omit<RevenueMaster, "id" | "createdAt" | "updatedAt">
): Promise<RevenueMaster> => {
  try {
    const res = await axiosInstance.patch(`/revenue_master/update/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error(`Failed to update revenue with id ${id}`, error);
    throw error;
  }
};

// Delete revenue
export const deleteRevenue = async (
  id: string
): Promise<{ message: string }> => {
  try {
    const res = await axiosInstance.delete(`/revenue_master/delete/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to delete revenue with id ${id}`, error);
    throw error;
  }
};
