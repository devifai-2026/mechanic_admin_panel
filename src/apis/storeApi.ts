import axiosInstance from "../utils/axiosInstance";
import { Store, StorePayload } from "../types/storeTypes";

// Get all stores
export const fetchStores = async (): Promise<Store[]> => {
  try {
    const res = await axiosInstance.get("/store/getAll");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch stores", error);
    throw error;
  }
};

// Get store by ID
export const fetchStoreById = async (id: string): Promise<Store> => {
  try {
    const res = await axiosInstance.get(`/store/get/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to fetch store with id ${id}`, error);
    throw error;
  }
};

// Create store
export const createStore = async (payload: StorePayload): Promise<Store> => {
  try {
    const res = await axiosInstance.post("/store/create", payload);
    return res.data;
  } catch (error) {
    console.error("Failed to create store", error);
    throw error;
  }
};

// Update store
export const updateStore = async (
  id: string,
  payload: StorePayload
): Promise<Store> => {
  try {
    const res = await axiosInstance.patch(`/store/update/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error(`Failed to update store with id ${id}`, error);
    throw error;
  }
};

// Delete store
export const deleteStore = async (id: string): Promise<{ message: string }> => {
  try {
    const res = await axiosInstance.delete(`/store/delete/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to delete store with id ${id}`, error);
    throw error;
  }
};
