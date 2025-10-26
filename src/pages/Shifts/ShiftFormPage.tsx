import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createShift, updateShift, fetchShiftById } from "../../apis/shiftApi";
import { toast, ToastContainer } from "react-toastify";
import { FaCode, FaClock } from "react-icons/fa";
import { FaUpload } from "react-icons/fa6";
import ShiftBulkUpload from "./ShiftBulkUpload";

export default function ShiftFormPage() {
  const fromTimeRef = useRef<HTMLInputElement>(null);
  const toTimeRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    shiftCode: "",
    shift_from_time: "",
    shift_to_time: "",
  });
  const [loading, setLoading] = useState(false);
  // Add this state at the top of your component
  const [activeTab, setActiveTab] = useState<"form" | "bulk">("form");

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      fetchShiftById(id)
        .then((data) => {
          setFormData({
            shiftCode: data.shift_code,
            shift_from_time: data.shift_from_time,
            shift_to_time: data.shift_to_time,
          });
        })
        .catch(() => toast.error("Failed to load shift"))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      shift_code: formData.shiftCode,
      shift_from_time: formData.shift_from_time,
      shift_to_time: formData.shift_to_time,
    };
    setLoading(true);
    try {
      if (isEdit && id) {
        await updateShift(id, payload);
        toast.success("Shift updated successfully!");
      } else {
        await createShift(payload);
        toast.success("Shift created successfully!");
      }
      setTimeout(() => navigate("/shifts/view"), 800);
    } catch (error) {
      toast.error("Failed to save shift");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow">
      <ToastContainer position="bottom-right" autoClose={3000} />
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setActiveTab("form")}
          className={`flex items-center px-4 py-2 rounded-md transition ${
            activeTab === "form"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
          }`}
        >
          Shift Form
        </button>
        {!isEdit && (
          <button
            onClick={() => setActiveTab("bulk")}
            className={`flex items-center px-4 py-2 rounded-md transition ${
              activeTab === "bulk"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
            }`}
          >
            <FaUpload className="mr-2" /> Bulk Upload
          </button>
        )}
      </div>
      {activeTab === "form" ? (
        <form onSubmit={handleSubmit} className="grid gap-5">
          <InputField
            icon={<FaCode />}
            label="Shift Code"
            name="shiftCode"
            value={formData.shiftCode}
            onChange={handleChange}
          />
          <div className="relative">
            <InputField
              icon={<FaClock />}
              label="From Time"
              name="shift_from_time"
              value={formData.shift_from_time}
              onChange={handleChange}
              type="time"
              inputRef={fromTimeRef}
            />
            <FaClock
              className="absolute right-3 top-9 text-gray-400 cursor-pointer"
              onClick={() => fromTimeRef.current?.showPicker?.()}
              style={{ pointerEvents: "auto" }}
            />
          </div>
          <div className="relative">
            <InputField
              icon={<FaClock />}
              label="To Time"
              name="shift_to_time"
              value={formData.shift_to_time}
              onChange={handleChange}
              type="time"
              inputRef={toTimeRef}
            />
            <FaClock
              className="absolute right-3 top-9 text-gray-400 cursor-pointer"
              onClick={() => toTimeRef.current?.showPicker?.()}
              style={{ pointerEvents: "auto" }}
            />
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/shifts/view")}
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
        <ShiftBulkUpload />
      )}
    </div>
  );
}

// Reusable Input Field Component
const InputField = ({
  icon,
  label,
  name,
  value,
  onChange,
  type = "text",
  inputRef,
}: any) => (
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
      ref={inputRef}
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);
