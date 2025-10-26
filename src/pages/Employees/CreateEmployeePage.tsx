import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaUpload,
  FaPlus,
  FaSpinner,
  FaTimes,
  FaDownload,
} from "react-icons/fa";
import { EmployeeForm } from "../../components/employee/EmployeeForm";
import {
  createEmployee,
  fetchEmployeeById,
  updateEmployee,
} from "../../apis/employyeApi";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const CreateEmployeePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"form" | "bulk">("form");
  const [isLoading, setIsLoading] = useState(false);
  const [editData, setEditData] = useState<any | null>(null);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!id) return;

    const fetchEmployee = async () => {
      try {
        setIsLoading(true);
        const response = await fetchEmployeeById(id);
        setEditData(response);
      } catch (error) {
        console.error("Failed to fetch employee", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true);

      if (editData && id) {
        await updateEmployee(id, data);
        toast.success("Employee updated successfully!");
        setTimeout(() => navigate("/employees/view"), 800);
      } else {
        await createEmployee(data);
        toast.success("Employee created successfully!");
        setTimeout(() => navigate("/employees/view"), 800);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message || "Failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <ToastContainer position="bottom-right" autoClose={3000} />

      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Create Employee
          </h1>
          <button
            onClick={() => navigate("/employees/view")}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <span>Back to Employees</span>
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("form")}
                className={`flex items-center px-6 py-4 text-sm font-medium ${activeTab === "form"
                  ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  } transition-colors`}
              >
                <FaPlus className="mr-2" />
                Single Employee
              </button>
              <button
                onClick={() => setActiveTab("bulk")}
                className={`flex items-center px-6 py-4 text-sm font-medium ${activeTab === "bulk"
                  ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  } transition-colors`}
              >
                <FaUpload className="mr-2" />
                Bulk Upload
              </button>
            </nav>
          </div>

          <div className="p-8">
            {activeTab === "form" ? (
              <EmployeeForm
                loading={isLoading}
                initialData={editData}
                onSubmit={handleSubmit}
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
  const [file, setFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const dummyData = {
    emp_id: "EMP20701",
    emp_name: "Abir Roy",
    blood_group: "O+",
    age: 31,
    adress: "123 Main St, City",
    state: "West Bengal",
    city: "Kolkata",
    pincode: "743124",
    aadhar_number: "592274465400",
    dob: "1998-08-19",
    is_active: true,
    shiftcode: "SHIFT-M2",
    role_name: "mechanic",
    organisations: "SoftSkirll",
    acc_holder_name: "Sayan Paul",
    acc_no: "20369767980",
    app_access_role:
      "siteIncharge/mechanicIncharge/mechanic/storeManager/projectManager",
    bank_name: "SBI",
    ifsc_code: "SBIN0000123",
  };

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
    if (e.dataTransfer.files.length > 0) {
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

      const response = await fetch(
        "http://www.devifai.website/api/master/super/admin/employee/bulk-upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (data.errors?.length > 0) {
          toast.error(
            <div
              dangerouslySetInnerHTML={{
                __html:
                  "Upload failed:<br/>" +
                  data.errors
                    .map((err: any) => `${err.row}: ${err.message}`)
                    .join("<br/>"),
              }}
            />
          );
        } else {
          toast.success(
            `Bulk upload completed successfully! Created ${data.createdCount} employees.`
          );
          setFile(null);
        }
      } else {
        toast.error(data.message || "Upload failed.");
      }
    } catch (error: any) {
      toast.error(error.message || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet([dummyData]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employee Template");

    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    saveAs(blob, "employee_template.xlsx");
  };

  return (
    <div className="space-y-6">
      {/* Upload UI */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-400"
      >
        <input
          type="file"
          accept=".csv,.xlsx"
          onChange={handleFileChange}
          className="hidden"
          id="bulk-upload"
        />
        <label htmlFor="bulk-upload" className="cursor-pointer block">
          <FaUpload className="mx-auto text-blue-600 text-2xl" />
          <p className="mt-2 text-sm text-gray-600">Browse or drag and drop Excel file</p>
        </label>
        <p className="text-xs text-gray-400">Supported formats: CSV, XLSX</p>
      </div>

      {/* Selected File Display */}
      {file && (
        <div className="p-4 bg-white dark:bg-gray-700 rounded-md flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold">{file.name}</p>
            <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
          </div>
          <button onClick={() => setFile(null)} className="text-red-500">
            <FaTimes />
          </button>
        </div>
      )}

      {/* Upload Button */}
      <div className="flex justify-end">
        <button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className={`px-5 py-2 rounded-md text-white ${
            !file || isUploading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isUploading ? (
            <>
              <FaSpinner className="animate-spin inline-block mr-2" />
              Uploading...
            </>
          ) : (
            <>
              <FaUpload className="inline-block mr-2" />
              Upload
            </>
          )}
        </button>
      </div>

      {/* Download Template */}
      <div className="mt-6 border-t pt-6">
        <h3 className="text-md font-semibold mb-2">Download Sample Template</h3>
        <button
          onClick={handleDownload}
          className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
        >
          <FaDownload className="mr-2" />
          Download Template
        </button>
      </div>
    </div>
  );
};

