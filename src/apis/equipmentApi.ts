import axiosInstance from "../utils/axiosInstance";
import { EquipmentPayload, EquipmentResponse } from "../types/equipmentTypes";

// Get all equipment
export const fetchEquipments = async (): Promise<EquipmentResponse[]> => {
  try {
    const res = await axiosInstance.get("/equipment/getAll");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch equipments", error);
    throw error;
  }
};

// Get equipment by ID
export const fetchEquipmentById = async (
  id: string
): Promise<EquipmentResponse> => {
  try {
    const res = await axiosInstance.get(`/equipment/get/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to fetch equipment with id ${id}`, error);
    throw error;
  }
};

// Create equipment
export const createEquipment = async (
  payload: EquipmentPayload
): Promise<EquipmentResponse> => {
  try {
    const res = await axiosInstance.post("/equipment/create", payload);
    return res.data;
  } catch (error) {
    console.error("Failed to create equipment", error);
    throw error;
  }
};

// Update equipment
export const updateEquipment = async (
  id: string,
  payload: EquipmentPayload
): Promise<EquipmentResponse> => {
  try {
    const res = await axiosInstance.patch(`/equipment/update/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error(`Failed to update equipment with id ${id}`, error);
    throw error;
  }
};

// Delete equipment
export const deleteEquipment = async (
  id: string
): Promise<{ message: string }> => {
  try {
    const res = await axiosInstance.delete(`/equipment/delete/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to delete equipment with id ${id}`, error);
    throw error;
  }
};
