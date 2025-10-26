import {
  Account,
  CreateAccountPayload,
  UpdateAccountPayload,
} from "../types/accountTypes";
import axiosInstance from "../utils/axiosInstance";

const BASE_PATH = "/account";

export const getAllAccounts = async (): Promise<Account[]> => {
  const res = await axiosInstance.get(`${BASE_PATH}`);
  return res.data;
};

export const getAccountById = async (id: string): Promise<Account> => {
  const res = await axiosInstance.get(`${BASE_PATH}/${id}`);
  return res.data;
};

export const createAccount = async (
  payload: CreateAccountPayload
): Promise<Account> => {
  const res = await axiosInstance.post(`${BASE_PATH}`, payload);
  return res.data;
};

export const updateAccount = async (
  payload: UpdateAccountPayload
): Promise<Account> => {
  const res = await axiosInstance.put(
    `${BASE_PATH}/${payload.id}`,
    payload
  );
  return res.data;
};

export const deleteAccount = async (
  id: string
): Promise<{ message: string }> => {
  const res = await axiosInstance.delete(`${BASE_PATH}/${id}`);
  return res.data;
};
