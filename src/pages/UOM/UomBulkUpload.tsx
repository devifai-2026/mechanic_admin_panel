import React, { useState } from "react";
import { FaUpload, FaFileExcel, FaTimes, FaSpinner } from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";
import DownloadTemplateButtonForUOM from "../../utils/helperFunctions/uom.excel";

const UomBulkUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
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
        "/uom/upload/bulk-upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { status, data } = response;

      if (status === 201 && data?.results && Array.isArray(data.results)) {
        let message = `${data.message || "Bulk Upload Results"}:\n\n`;

        data.results.forEach((item: any, index: number) => {
          message += `${index + 1}. UOM: ${item.unit_code || "N/A"}\n   Status: ${item.status || "unknown"
            }\n   Message: ${item.message || "No message"}\n\n`;
        });

        alert(message);
      } else {
        alert(data?.message || "Bulk upload completed successfully.");
      }

      setFile(null);
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
              onClick={() => setFile(null)}
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
          className={`px-4 py-2 rounded-md text-white flex items-center ${!file || isUploading
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
              Upload UOMs
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
        <DownloadTemplateButtonForUOM />
      </div>
    </div>
  );
};

export default UomBulkUpload;
