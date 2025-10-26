// src/api/dieselRequisitionApi.ts
import axiosInstance from "../utils/axiosInstance";

const isProduction = true;

const BASE_PATH = isProduction
  ? "https://www.devifai.website/api/master/mechanic/diselrequisition"
  : "http://localhost:8000/api/master/mechanic/diselrequisition";

// Get all diesel requisitions
export const getAllDieselRequisitions = async (): Promise<any[]> => {
  try {
    const res = await axiosInstance.get(BASE_PATH);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch diesel requisitions", error);
    throw error;
  }
};

// Get a single diesel requisition by ID
export const getDieselRequisitionById = async (id: string): Promise<any> => {
  try {
    const res = await axiosInstance.get(`${BASE_PATH}/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to fetch diesel requisition with ID ${id}`, error);
    throw error;
  }
};
