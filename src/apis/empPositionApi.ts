import { EmpPosition, EmpPositionPayload } from "../types/empPositionTypes";
import axiosInstance from "../utils/axiosInstance";

// Get all positions
export const fetchEmpPositions = async (): Promise<EmpPosition[]> => {
  try {
    const res = await axiosInstance.get("/empPosition/getAll");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch employee positions", error);
    throw error;
  }
};

// Get position by ID
export const fetchEmpPositionById = async (
  id: string
): Promise<EmpPosition> => {
  try {
    const res = await axiosInstance.get(`/empPositionn/get/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to fetch employee position with id ${id}`, error);
    throw error;
  }
};

// Create new position
export const createEmpPosition = async (
  payload: EmpPositionPayload
): Promise<EmpPosition> => {
  try {
    const res = await axiosInstance.post("/empPosition/create", payload);
    return res.data;
  } catch (error) {
    console.error("Failed to create employee position", error);
    throw error;
  }
};

// Update position
export const updateEmpPosition = async (
  id: string,
  payload: EmpPositionPayload
): Promise<EmpPosition> => {
  try {
    const res = await axiosInstance.put(`/empPosition/update/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error(`Failed to update employee position with id ${id}`, error);
    throw error;
  }
};

// Delete position
export const deleteEmpPosition = async (
  id: string
): Promise<{ message: string }> => {
  try {
    const res = await axiosInstance.delete(`/empPosition/delete/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to delete employee position with id ${id}`, error);
    throw error;
  }
};
