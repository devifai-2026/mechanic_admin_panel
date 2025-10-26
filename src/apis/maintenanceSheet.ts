import axiosInstance from "../utils/axiosInstance";

// Toggle this flag depending on environment
const isProduction = true;

const BASE_PATH = isProduction
  ? "https://www.devifai.website/api/master/mechanic/maintenancesheet"
  : "http://localhost:8000/api/master/mechanic/maintenancesheet";

export const getAllMaintenanceSheet = async (): Promise<any[]> => {
  try {
    const res = await axiosInstance.get(`${BASE_PATH}`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch maintenance sheet data", error);
    throw error;
  }
};
