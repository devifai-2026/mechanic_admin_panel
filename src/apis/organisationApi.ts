import {
  Organisation,
  OrganisationPostPayload,
} from "../types/organisationTypes";
import axiosInstance from "../utils/axiosInstance";

const BASE_PATH = "/organisations";

export const getAllOrganisations = async (): Promise<Organisation[]> => {
  const res = await axiosInstance.get(BASE_PATH);
  return res.data;
};

export const getOrganisationById = async (
  id: string
): Promise<Organisation> => {
  const res = await axiosInstance.get(`${BASE_PATH}/${id}`);
  return res.data;
};

export const createOrganisation = async (
  payload: OrganisationPostPayload
): Promise<Organisation> => {
  const res = await axiosInstance.post(BASE_PATH, payload);
  return res.data;
};

export const updateOrganisation = async (
  id: string,
  payload: OrganisationPostPayload
): Promise<Organisation> => {
  const res = await axiosInstance.post(`${BASE_PATH}/${id}`, payload);
  return res.data;
};

export const deleteOrganisation = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${BASE_PATH}/${id}`);
};
