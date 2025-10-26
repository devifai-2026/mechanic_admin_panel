import { Shift, ShiftPayload } from "../types/shiftTypes";
import axiosInstance from "../utils/axiosInstance";

// Get all shifts
export const fetchShifts = async (): Promise<Shift[]> => {
  try {
    const res = await axiosInstance.get("/shift/getAll");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch shifts", error);
    throw error;
  }
};

// Get shift by ID
export const fetchShiftById = async (id: string): Promise<Shift> => {
  try {
    const res = await axiosInstance.get(`/shift/get/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to fetch shift with id ${id}`, error);
    throw error;
  }
};

// Create new shift
export const createShift = async (payload: ShiftPayload): Promise<Shift> => {
  try {
    const res = await axiosInstance.post("/shift/create", payload);
    return res.data;
  } catch (error) {
    console.error("Failed to create shift", error);
    throw error;
  }
};

// Update shift
export const updateShift = async (
  id: string,
  payload: ShiftPayload
): Promise<Shift> => {
  try {
    const res = await axiosInstance.patch(`/shift/update/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error(`Failed to update shift with id ${id}`, error);
    throw error;
  }
};

// Delete shift
export const deleteShift = async (id: string): Promise<{ message: string }> => {
  try {
    const res = await axiosInstance.delete(`/shift/delete/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to delete shift with id ${id}`, error);
    throw error;
  }
};
