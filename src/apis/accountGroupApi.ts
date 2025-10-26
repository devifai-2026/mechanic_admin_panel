import axiosInstance from "../utils/axiosInstance";
import {
  AccountGroup,
  AccountGroupPostPayload,
} from "../types/accountGroupTypes";

const BASE_PATH = "/accountgroup";

export const getAllAccountGroups = async (): Promise<AccountGroup[]> => {
  const res = await axiosInstance.get(BASE_PATH);
  return res.data;
};

export const getAccountGroupById = async (
  id: string
): Promise<AccountGroup> => {
  const res = await axiosInstance.get(`${BASE_PATH}/${id}`);
  return res.data;
};

export const createAccountGroup = async (
  payload: AccountGroupPostPayload
): Promise<AccountGroup> => {
  const res = await axiosInstance.post(BASE_PATH, payload);
  return res.data;
};

export const updateAccountGroup = async (
  id: string,
  payload: AccountGroupPostPayload
): Promise<AccountGroup> => {
  const res = await axiosInstance.put(`${BASE_PATH}/${id}`, payload);
  return res.data;
};

export const deleteAccountGroup = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${BASE_PATH}/${id}`);
};
