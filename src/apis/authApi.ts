import axiosInstance from "../utils/axiosInstance";

export interface AdminLoginPayload {
  admin_id: string;
  password: string;
}

export interface AdminLoginSuccess {
  status: true;
  message: string;
  token: string;
  admin: {
    id: string;
    admin_id: string;
    name: string;
    email: string;
  };
}

export interface AdminLoginMultipleLogin {
  isMultipleLogin: true;
  message: string;
  status?: false;
}

export interface AdminLoginError {
  status?: false;
  message: string;
}

export type AdminLoginResponse =
  | AdminLoginSuccess
  | AdminLoginMultipleLogin
  | AdminLoginError;

export const adminLogin = async (
  payload: AdminLoginPayload
): Promise<AdminLoginResponse> => {
  const res = await axiosInstance.post(`/login`, payload);
  return res.data;
};

export const adminLogout = async (): Promise<{ message: string }> => {
  const res = await axiosInstance.post(`/logout`);
  return res.data;
};