import { Employee, EmployeePayload } from "../types/employeeTypes";
import axiosInstance from "../utils/axiosInstance";

// Get all employees
export const fetchEmployees = async (): Promise<Employee[]> => {
  try {
    const res = await axiosInstance.get("/employee/getAll");
    return res.data;
    console.log({ res });
  } catch (error) {
    console.error("Failed to fetch employees", error);
    throw error;
  }
};

// Get employee by ID
export const fetchEmployeeById = async (id: string) => {
  try {
    const res = await axiosInstance.get(`/employee/get/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to fetch employee with id ${id}`, error);
    throw error;
  }
};

// Create new employee
export const createEmployee = async (
  payload: EmployeePayload
): Promise<Employee> => {
  try {
    const res = await axiosInstance.post("/employee/create", payload);
    return res.data;
  } catch (error) {
    console.error("Failed to create employee", error);
    throw error;
  }
};

// Update employee
export const updateEmployee = async (
  id: string,
  payload: EmployeePayload
): Promise<Employee> => {
  try {
    const res = await axiosInstance.patch(`/employee/update/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error(`Failed to update employee with id ${id}`, error);
    throw error;
  }
};

// Delete employee
export const deleteEmployee = async (
  id: string
): Promise<{ message: string }> => {
  try {
    const res = await axiosInstance.delete(`/employee/delete/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to delete employee with id ${id}`, error);
    throw error;
  }
};

// Get employees by role ID
export const fetchEmployeesByRoleId = async (
  roleId: string
): Promise<Employee[]> => {
  try {
    const res = await axiosInstance.get(`/employee/role/${roleId}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to fetch employees with role ID ${roleId}`, error);
    throw error;
  }
};

export const assignEmployeesToProject = async (
  project_id: string,
  employee_ids: string[]
) => {
  const res = await axiosInstance.post("/employee/add/employee/project", {
    project_id,
    employee_ids,
  });
  return res.data;
};

export const getEmployyesAssignedToProject = async (project_id: string) => {
  const res = await axiosInstance.post("/employee/get/employee/project", {
    project_id,
  });
  return res.data;
};

export const updateEmployeesForProject = async (
  project_id: string,
  employee_ids: string[]
) => {
  const res = await axiosInstance.post("/employee/edit/employee/project", {
    project_id,
    employee_ids,
  });
  return res.data;
};
