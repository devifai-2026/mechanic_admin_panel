import { CreateOEMPayload, OEM, UpdateOemPayload } from "../types/oemTypes";
import axiosInstance from "../utils/axiosInstance";

const BASE_PATH = "/oem";

export const getAllOEMs = async (): Promise<OEM[]> => {
  const res = await axiosInstance.get(`${BASE_PATH}`);
  return res.data;
};

export const getOEMById = async (id: string): Promise<OEM> => {
  const res = await axiosInstance.get(`${BASE_PATH}/${id}`);
  return res.data;
};

export const createOEM = async (payload: CreateOEMPayload): Promise<OEM> => {
  const res = await axiosInstance.post(`${BASE_PATH}`, payload);
  return res.data;
};

export const updateOEM = async (payload: UpdateOemPayload): Promise<OEM> => {
  const res = await axiosInstance.put(`${BASE_PATH}/${payload.id}`, payload);
  return res.data;
};

export const deleteOEM = async (id: string): Promise<{ message: string }> => {
  const res = await axiosInstance.delete(`${BASE_PATH}/${id}`);
  return res.data;
};
