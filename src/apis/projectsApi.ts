import { Project, ProjectPayload } from "../types/projectsTypes";
import axiosInstance from "../utils/axiosInstance";
import axios from "axios";

// Generic error handler for API responses
const handleApiError = (error: unknown, defaultMessage: string): never => {
  let errorMessage = defaultMessage;

  if (axios.isAxiosError(error)) {
    errorMessage = error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      defaultMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  console.error(errorMessage, error);
  throw new Error(errorMessage);
};

// Fetch all projects
export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const res = await axiosInstance.get("/project/getall");
    return res.data;
  } catch (error) {
    return handleApiError(error, "Failed to fetch projects");
  }
};

// Fetch project by ID
export const fetchProjectById = async (id: string): Promise<Project> => {
  console.log('ssssssssss')
  console.log({ id })
  try {
    const res = await axiosInstance.post('/project/get', { id });
    return res.data;
  } catch (error) {
    return handleApiError(error, `Failed to fetch project with ID ${id}`);
  }
};

// Create a new project
export const createProject = async (
  payload: ProjectPayload
): Promise<Project> => {
  try {
    const res = await axiosInstance.post("/project/create", payload);
    return res.data;
  } catch (error) {
    return handleApiError(error, "Failed to create project");
  }
};

// Update a project
export const updateProject = async (
  id: number,
  payload: Partial<ProjectPayload>
): Promise<Project> => {
  try {
    const res = await axiosInstance.patch(`/project/update/${id}`, payload);
    return res.data;
  } catch (error) {
    return handleApiError(error, `Failed to update project with ID ${id}`);
  }
};

// Delete a project
export const deleteProject = async (
  id: number
): Promise<{ message: string }> => {
  try {
    const res = await axiosInstance.delete(`/project/delete/${id}`);
    return res.data;
  } catch (error) {
    return handleApiError(error, `Failed to delete project with ID ${id}`);
  }
};

// Bulk upload projects (Excel file)
export const bulkUploadProjects = async (file: File): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axiosInstance.post("/project/bulk-upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    return handleApiError(error, "Bulk upload failed");
  }
};



