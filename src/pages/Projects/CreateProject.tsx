import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProjectCreateForm } from "../../components/projects/ProjectCreateForm";
import {
  FaUpload,
  FaPlus,
  FaSpinner,
  FaFileExcel,
  FaTimes,
} from "react-icons/fa";
import {
  createProject,
  fetchProjectById,
  updateProject,
} from "../../apis/projectsApi";
import DownloadTemplateButton from "../../utils/helperFunctions/create_excel_template";
import { toast, ToastContainer } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";

export const CreateProjectPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"form" | "bulk">("form");
  const [editData, setEditData] = useState<any | null>(null);

  const { id } = useParams<{ id: any }>();
  console.log({ editData });
  useEffect(() => {
    if (id) {
      const fetchEditData = async () => {
        try {
          const data = await fetchProjectById(id);
          setEditData(data);
        } catch (error) {
          console.error("Failed to fetch project data", error);
        }
      };
      fetchEditData();
    }
  }, [id]);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <ToastContainer position="bottom-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {id ? "Edit Project" : "Create New Project"}
          </h1>
          <button
            onClick={() => navigate("/projects/view")}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <span>Back to Projects</span>
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("form")}
                className={`flex items-center px-4 py-3 text-sm font-medium ${
                  activeTab === "form"
                    ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <FaPlus className="mr-2" />
                Single Project
              </button>
              {!id && (
                <button
                  onClick={() => setActiveTab("bulk")}
                  className={`flex items-center px-4 py-3 text-sm font-medium ${
                    activeTab === "bulk"
                      ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  <FaUpload className="mr-2" />
                  Bulk Upload
                </button>
              )}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "form" ? (
              <ProjectCreateForm
                onClose={() => navigate("/projects/view")}
                onSubmit={async (projectData: any) => {
                  try {
                    if (id) {
                      await updateProject(id, projectData);
                      toast.success("Project updated successfully");
                    } else {
                      await createProject(projectData);
                      toast.success("Project created successfully");
                      // navigate("/projects/view")
                    }
                    // navigate("/projects/view");
                  } catch (error) {
                    let errorMessage = "An unexpected error occurred";

                    if (error instanceof Error) {
                      errorMessage = error.message;
                    } else if (typeof error === "string") {
                      errorMessage = error;
                    }

                    toast.error(errorMessage);

                    // Optionally log the full error for debugging
                    console.error("Project operation failed:", error);
                  }
                }}
                initialData={editData}
                isEditMode={!!id}
              />
            ) : (
              <BulkUploadSection />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const BulkUploadSection = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      e.target.value = ""; // Clear the input so the same file can be selected again
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Allow drop
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosInstance.post(
        "/project/bulk-upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = response.data;

      if (data?.results && Array.isArray(data.results)) {
        let message = `Bulk Upload ${
          data.results[data.results.length - 1].status
        }:\n\n`;

        data.results.forEach((item: any, index: number) => {
          message += `${index + 1}. Project: ${item.projectNo}\n   Status: ${
            item.status
          }\n   Message: ${item.message}\n\n`;
        });

        alert(message);
      } else {
        alert("Bulk upload completed successfully!");
      }

      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear input manually
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer"
    >
      <div className="flex flex-col items-center justify-center space-y-3">
        <FaUpload className="h-12 w-12 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Drag and drop files here
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">or</p>
        <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
          <span>Browse files</span>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".csv, .xlsx"
          />
        </label>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Supported formats: CSV, Excel
        </p>
      </div>

      {file && (
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                <FaFileExcel className="text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-end mt-4">
        <button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className={`px-4 py-2 rounded-md text-white flex items-center ${
            !file || isUploading
              ? "bg-blue-400 dark:bg-blue-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isUploading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Uploading...
            </>
          ) : (
            <>
              <FaUpload className="mr-2" />
              Upload Projects
            </>
          )}
        </button>
      </div>

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-left">
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
          Download Template
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Use our template file to ensure your data is formatted correctly.
        </p>
        <DownloadTemplateButton />
      </div>
    </div>
  );
};
