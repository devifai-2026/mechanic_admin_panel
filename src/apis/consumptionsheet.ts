import axiosInstance from "../utils/axiosInstance";

const isProduction = true; // change this to true in production

const BASE_PATH = isProduction
  ? "https://www.devifai.website/api/master/mechanic/consumptionsheet"
  : "http://localhost:8000/api/master/mechanic/consumptionsheet";

export const getAllConsumptionSheet = async (): Promise<any[]> => {
  try {
    const res = await axiosInstance.get(`${BASE_PATH}`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch consumption sheets", error);
    throw error;
  }
};
