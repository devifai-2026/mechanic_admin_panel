import axiosInstance from "../utils/axiosInstance";
import {
  EquipmentGroupPayload,
  EquipmentGroupResponse,
} from "../types/equipmentGroupTypes";

// Get all equipment groups
export const fetchEquipmentGroups = async (): Promise<
  EquipmentGroupResponse[]
> => {
  try {
    const res = await axiosInstance.get("/equipmentGroup/getAll");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch equipment groups", error);
    throw error;
  }
};

// Get equipment group by ID
export const fetchEquipmentGroupById = async (
  id: string
): Promise<EquipmentGroupResponse> => {
  try {
    const res = await axiosInstance.get(`/equipmentGroup/get/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to fetch equipment group with id ${id}`, error);
    throw error;
  }
};

// Create equipment group
export const createEquipmentGroup = async (
  payload: EquipmentGroupPayload
): Promise<EquipmentGroupResponse> => {
  try {
    const res = await axiosInstance.post("/equipmentGroup/create", payload);
    return res.data;
  } catch (error) {
    console.error("Failed to create equipment group", error);
    throw error;
  }
};

// Update equipment group
export const updateEquipmentGroup = async (
  id: string,
  payload: EquipmentGroupPayload
): Promise<EquipmentGroupResponse> => {
  try {
    const res = await axiosInstance.patch(
      `/equipmentGroup/update/${id}`,
      payload
    );
    return res.data;
  } catch (error) {
    console.error(`Failed to update equipment group with id ${id}`, error);
    throw error;
  }
};

// Delete equipment group
export const deleteEquipmentGroup = async (
  id: string
): Promise<{ message: string }> => {
  try {
    const res = await axiosInstance.delete(`/equipmentGroup/delete/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to delete equipment group with id ${id}`, error);
    throw error;
  }
};
