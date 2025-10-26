import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  createAccount,
  getAccountById,
  updateAccount,
} from "../../apis/accountApi";
import { getAllAccountGroups } from "../../apis/accountGroupApi";
import { CreateAccountPayload, Account } from "../../types/accountTypes";
import { AccountGroup } from "../../types/accountGroupTypes";
import AccountBulkUpload from "./AccountBulkUpload";
import { FaUpload } from "react-icons/fa6";

export default function AccountFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<CreateAccountPayload>({
    account_code: "",
    account_name: "",
    account_group: "",
  });
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<AccountGroup[]>([]);
  const [activeTab, setActiveTab] = useState<"form" | "bulk">("form");

  useEffect(() => {
    getAllAccountGroups().then(setGroups);
  }, []);

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      getAccountById(id)
        .then((data: Account) => {
          setFormData({
            account_code: data.account_code || "",
            account_name: data.account_name || "",
            account_group: data.account_group || "",
          });
        })
        .catch(() => toast.error("Failed to load Account"))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit && id) {
        await updateAccount({ id, ...formData });
        toast.success("Account updated successfully!");
      } else {
        await createAccount(formData);
        toast.success("Account created successfully!");
      }
      setTimeout(() => navigate("/account/view"), 800);
    } catch (err) {
      toast.error("Failed to save Account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow">
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
          Account Form
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
        <>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            {isEdit ? "Edit Account" : "Add New Account"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
            <InputField
              label="Account Name"
              name="account_name"
              value={formData.account_name}
              onChange={handleChange}
            />
            <InputField
              label="Account Code"
              name="account_code"
              value={formData.account_code}
              onChange={handleChange}
            />
            <SelectField
              label="Account Group"
              name="account_group"
              value={formData.account_group}
              onChange={handleChange}
              options={groups}
            />
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={() => navigate("/account/view")}
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
        </>
      ) : (
        <AccountBulkUpload />
      )}
    </div>
  );
}

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  name: string;
  value: any;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  type?: string;
}) => (
  <div>
    <label className="mb-1 text-gray-700 dark:text-gray-200 font-medium">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
    />
  </div>
);

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  options: { id: string; account_group_name: string }[];
}) => (
  <div>
    <label className="mb-1 text-gray-700 dark:text-gray-200 font-medium">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
      required
    >
      <option value="">Select Group</option>
      {options.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt.account_group_name}
        </option>
      ))}
    </select>
  </div>
);
