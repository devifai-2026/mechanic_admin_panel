// src/api/itemApi.ts
import { Item, ItemPostPayload } from "../types/consumableItemTypes";
import axiosInstance from "../utils/axiosInstance";

// Get all items
export const fetchItems = async (): Promise<Item[]> => {
  try {
    const res = await axiosInstance.get("/consumableitems");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch items", error);
    throw error;
  }
};

// Get a single item by ID
export const fetchItemById = async (id: string): Promise<Item> => {
  try {
    const res = await axiosInstance.get(`/consumableitems/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to fetch item with id ${id}`, error);
    throw error;
  }
};

// Create a new item
export const createItem = async (payload: ItemPostPayload): Promise<Item> => {
  try {
    const res = await axiosInstance.post("/consumableitems", payload);
    return res.data;
  } catch (error) {
    console.error("Failed to create item", error);
    throw error;
  }
};

// Update an item
export const updateItem = async (
  id: string,
  payload: ItemPostPayload
): Promise<Item> => {
  try {
    const res = await axiosInstance.patch(`/consumableitems/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error(`Failed to update item with id ${id}`, error);
    throw error;
  }
};

// Delete an item
export const deleteItem = async (id: string): Promise<{ message: string }> => {
  try {
    const res = await axiosInstance.delete(`/consumableitems/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to delete item with id ${id}`, error);
    throw error;
  }
};
