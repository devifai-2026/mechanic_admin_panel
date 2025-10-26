import { Customer, CustomerPayload } from "../types/customerTypes";
import axiosInstance from "../utils/axiosInstance";

// Fetch all customers
export const fetchCustomers = async (): Promise<Customer[]> => {
  try {
    const res = await axiosInstance.get("/partner/getall");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch customers", error);
    throw error;
  }
};

// Fetch customer by ID
export const fetchCustomerById = async (id: string): Promise<Customer> => {
  try {
    const res = await axiosInstance.get(`/partner/get/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to fetch customer with id ${id}`, error);
    throw error;
  }
};

// Create a new customer
export const createCustomer = async (
  payload: CustomerPayload
): Promise<Customer> => {
  try {
    const res = await axiosInstance.post("/partner/create", payload);
    return res.data;
  } catch (error) {
    console.error("Failed to create customer", error);
    throw error;
  }
};

// Update a customer
export const updateCustomer = async (
  id: string,
  payload: CustomerPayload
): Promise<Customer> => {
  try {
    const res = await axiosInstance.patch(`/partner/update/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error(`Failed to update customer with id ${id}`, error);
    throw error;
  }
};

// Delete a customer
export const deleteCustomer = async (
  id: string
): Promise<{ message: string }> => {
  try {
    const res = await axiosInstance.delete(`/partner/delete/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to delete customer with id ${id}`, error);
    throw error;
  }
};
