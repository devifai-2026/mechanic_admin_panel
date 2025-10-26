import { CreateUOMPayload, UOM, UpdateUOMPayload } from "../types/uomTypes";
import axiosInstance from "../utils/axiosInstance";


const BASE_PATH = "/uom";

export const getAllUOMs = async (): Promise<UOM[]> => {
  const res = await axiosInstance.get(`${BASE_PATH}`);
  return res.data;
};

export const getUOMById = async (id: string): Promise<UOM> => {
  const res = await axiosInstance.get(`${BASE_PATH}/${id}`);
  return res.data;
};

export const createUOM = async (payload: CreateUOMPayload): Promise<UOM> => {
  const res = await axiosInstance.post(`${BASE_PATH}`, payload);
  return res.data;
};

export const updateUOM = async (payload: UpdateUOMPayload): Promise<UOM> => {
  const res = await axiosInstance.post(`${BASE_PATH}/${payload.id}`, payload);
  return res.data;
};

export const deleteUOM = async (id: string): Promise<{ message: string }> => {
  const res = await axiosInstance.delete(`${BASE_PATH}/${id}`);
  return res.data;
};
