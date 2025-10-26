import React, {
  useEffect,
  useState,
  useRef,
  ChangeEvent,
  FormEvent,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createRevenue,
  updateRevenue,
  fetchRevenueById,
} from "../../apis/revenueApi";
import { toast, ToastContainer } from "react-toastify";
import {
  FaCode,
  FaAlignLeft,
  FaMoneyBill,
  FaUpload,
  FaSpinner,
  FaFileExcel,
  FaTimes,
} from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";
import DownloadTemplateButtonRevenue from "../../utils/helperFunctions/DownloadTemplateRevenueButton";

// Types
interface RevenueFormData {
  revenueCode: string;
  description: string;
  revenueValue: string;
}

interface RevenueUploadResponse {
  revenueCode?: string;
  status: string;
  message?: string;
}

const RevenueFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<RevenueFormData>({
    revenueCode: "",
    description: "",
    revenueValue: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      fetchRevenueById(id)
        .then((data) => {
          setFormData({
            revenueCode: data.revenue_code,
            description: data.revenue_description,
            revenueValue: data.revenue_value.toString(),
          });
        })
        .catch(() => toast.error("Failed to load revenue"))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      revenue_code: formData.revenueCode,
      revenue_description: formData.description,
      revenue_value: Number(formData.revenueValue),
    };
    setLoading(true);
    try {
      if (isEdit && id) {
        await updateRevenue(id, payload);
        toast.success("Revenue updated successfully!");
      } else {
        await createRevenue(payload);
        toast.success("Revenue created successfully!");
      }
      setTimeout(() => navigate("/revenues/view"), 800);
    } catch (error) {
      toast.error("Failed to save revenue");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      e.target.value = "";
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosInstance.post<{
        results: RevenueUploadResponse[];
      }>("/revenue_master/bulk-upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = response.data;
      if (data?.results && Array.isArray(data.results)) {
        let message = `Bulk Upload Completed:\n\n`;
        data.results.forEach((item, index) => {
          message += `${index + 1}. Revenue Code: ${
            item.revenueCode || "N/A"
          }\n   Status: ${item.status}\n   Message: ${item.message || "-"}\n\n`;
        });
        alert(message);
      } else {
        alert("Bulk upload completed successfully!");
      }

      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow">
      <ToastContainer position="bottom-right" autoClose={3000} />
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("single")}
          className={`px-4 py-2 rounded-md ${
            activeTab === "single"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
          }`}
        >
          Single Upload
        </button>
        <button
          onClick={() => setActiveTab("bulk")}
          className={`px-4 py-2 rounded-md ${
            activeTab === "bulk"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
          }`}
        >
          Bulk Upload
        </button>
      </div>

      {activeTab === "single" ? (
        <form onSubmit={handleSubmit} className="grid gap-5">
          <InputField
            icon={<FaCode />}
            label="Revenue Code"
            name="revenueCode"
            value={formData.revenueCode}
            onChange={handleChange}
          />
          <InputField
            icon={<FaAlignLeft />}
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          <InputField
            icon={<FaMoneyBill />}
            label="Revenue Value"
            name="revenueValue"
            type="number"
            value={formData.revenueValue}
            onChange={handleChange}
          />
          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={() => navigate("/revenues/view")}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {loading
                ? isEdit
                  ? "Updating..."
                  : "Creating..."
                : isEdit
                ? "Update"
                : "Create"}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div
            className="border-2 border-dashed p-6 rounded-md text-center"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files.length > 0) {
                setFile(e.dataTransfer.files[0]);
              }
            }}
          >
            <FaUpload className="mx-auto mb-2 text-gray-400 text-2xl" />
            <p className="text-gray-600 dark:text-gray-300">
              Drag & drop your file or
            </p>
            <label className="cursor-pointer inline-block mt-2 bg-blue-600 text-white px-4 py-2 rounded">
              Browse
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".xlsx,.csv"
              />
            </label>

            {file && (
              <div className="mt-4 flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-3 rounded">
                <div className="flex items-center space-x-3">
                  <FaFileExcel className="text-green-600" />
                  <span className="text-sm text-gray-700 dark:text-white">
                    {file.name}
                  </span>
                </div>
                <FaTimes
                  className="cursor-pointer text-gray-500"
                  onClick={() => {
                    setFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end">
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
                  <FaSpinner className="animate-spin mr-2" /> Uploading...
                </>
              ) : (
                <>
                  <FaUpload className="mr-2" /> Upload Revenues
                </>
              )}
            </button>
          </div>

          <div className="mt-6 pt-4 border-t dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
              Download Template
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Use this template to prepare your revenue data.
            </p>
            <DownloadTemplateButtonRevenue />
          </div>
        </div>
      )}
    </div>
  );
};

interface InputFieldProps {
  icon: React.ReactNode;
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  icon,
  label,
  name,
  value,
  onChange,
  type = "text",
}) => (
  <div>
    <label className="flex items-center mb-1 text-gray-700 dark:text-gray-200 font-medium">
      <span className="mr-2">{icon}</span>
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default RevenueFormPage;
