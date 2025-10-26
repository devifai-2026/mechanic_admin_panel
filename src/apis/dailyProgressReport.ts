import axiosInstance from "../utils/axiosInstance";

// Toggle this flag based on your environment
const isProduction = true;

const BASE_PATH = isProduction
  ? "https://www.devifai.website/api/master/site_incharge/get-all-dpr"
  : "http://localhost:8000/api/master/site_incharge/get-all-dpr";

export const getAllDPR = async (): Promise<any[]> => {
  try {
    const res = await axiosInstance.get(`${BASE_PATH}`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch DPR data", error);
    throw error;
  }
};
