import {
  CreateItemGroupPayload,
  ItemGroup,
  UpdateItemGroupPayload,
} from "../types/itemGroupTypes";
import axiosInstance from "../utils/axiosInstance";

const BASE_PATH = "/itemgroup";

export const getAllItemGroups = async (): Promise<ItemGroup[]> => {
  const res = await axiosInstance.get(`${BASE_PATH}`);
  return res.data;
};

export const getItemGroupById = async (id: string): Promise<ItemGroup> => {
  const res = await axiosInstance.get(`${BASE_PATH}/${id}`);
  return res.data;
};

export const createItemGroup = async (
  payload: CreateItemGroupPayload
): Promise<ItemGroup> => {
  const res = await axiosInstance.post(`${BASE_PATH}`, payload);
  return res.data;
};

export const updateItemGroup = async (
  payload: UpdateItemGroupPayload
): Promise<ItemGroup> => {
  const res = await axiosInstance.put(`${BASE_PATH}/${payload.id}`, payload);
  return res.data;
};

export const deleteItemGroup = async (
  id: string
): Promise<{ message: string }> => {
  const res = await axiosInstance.delete(`${BASE_PATH}/${id}`);
  return res.data;
};
