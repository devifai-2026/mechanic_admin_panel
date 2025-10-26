import React, { useState, useRef } from "react";
import {
  FaUpload,
  FaSpinner,
  FaFileExcel,
  FaTimes,
  FaDownload,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axiosInstance from "../../utils/axiosInstance";

const EquipmentgroupBulkUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      e.target.value = ""; // allow same file selection again
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
        "/equipmentGroup/bulk-upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const data = response.data;
      if (data?.results) {
        let message = `Bulk Upload Completed:\n\n`;
        data.results.forEach((item: any, index: number) => {
          message += `${index + 1}. Group Code: ${
            item.group_code || "N/A"
          }\n   Status: ${item.status}\n   Message: ${item.message || "-"}\n\n`;
        });
        alert(message);
      } else {
        alert("Bulk upload completed successfully!");
      }

      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const worksheetData = [
      ["group_name", "group_code"],
      ["Heavy Equipment", "HEQ001"],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "EquipmentGroupTemplate");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(blob, "EquipmentGroupTemplate.xlsx");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Equipment Group Bulk Upload
      </h2>

      {/* Drag-and-Drop */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer"
      >
        <FaUpload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 dark:text-gray-300">
          Drag and drop your Excel file here
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">or</p>

        <label className="cursor-pointer inline-block mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
          Browse File
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".csv, .xlsx"
          />
        </label>

        {file && (
          <div className="bg-gray-100 dark:bg-gray-700 mt-4 p-3 rounded flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaFileExcel className="text-green-600" />
              <span className="text-sm text-gray-700 dark:text-white">
                {file.name}
              </span>
            </div>
            <FaTimes
              className="text-gray-500 cursor-pointer"
              onClick={() => {
                setFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
            />
          </div>
        )}
      </div>

      {/* Upload Button */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className={`px-4 py-2 rounded-md text-white flex items-center ${
            !file || isUploading
              ? "bg-blue-400 cursor-not-allowed"
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
              Upload Groups
            </>
          )}
        </button>
      </div>

      {/* Download Template */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-md font-semibold text-gray-800 dark:text-white mb-2">
          Download Excel Template
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Use the provided format to upload multiple equipment groups.
        </p>
        <button
          onClick={handleDownloadTemplate}
          className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          <FaDownload className="mr-2" />
          Download Template
        </button>
      </div>
    </div>
  );
};

export default EquipmentgroupBulkUpload;
