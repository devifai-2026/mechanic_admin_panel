import axiosInstance from "../utils/axiosInstance";
import { Role, RolePayload } from "../types/roleTypes";

// Get all roles
export const fetchRoles = async (): Promise<Role[]> => {
  try {
    const res = await axiosInstance.get("/role/getAll");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch roles", error);
    throw error;
  }
};

// Get a single role by ID
export const fetchRoleById = async (id: string): Promise<Role> => {
  try {
    const res = await axiosInstance.get(`/role/get/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to fetch role with id ${id}`, error);
    throw error;
  }
};

// Create a new role
export const createRole = async (payload: RolePayload): Promise<Role> => {
  try {
    const res = await axiosInstance.post("/role/create", payload);
    return res.data;
  } catch (error) {
    console.error("Failed to create role", error);
    throw error;
  }
};

// Update a role
export const updateRole = async (
  id: string,
  payload: RolePayload
): Promise<Role> => {
  try {
    const res = await axiosInstance.patch(`/role/update/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error(`Failed to update role with id ${id}`, error);
    throw error;
  }
};

// Delete a role
export const deleteRole = async (id: string): Promise<{ message: string }> => {
  try {
    const res = await axiosInstance.delete(`/role/delete/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to delete role with id ${id}`, error);
    throw error;
  }
};
