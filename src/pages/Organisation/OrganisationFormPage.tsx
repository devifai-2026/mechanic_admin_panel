import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { OrganisationPostPayload } from "../../types/organisationTypes";
import {
  createOrganisation,
  getOrganisationById,
  updateOrganisation,
} from "../../apis/organisationApi";
import OrganisationBulkUpload from "./OrganisationBulkUpload";

export default function OrganisationFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<OrganisationPostPayload>({
    org_name: "",
    org_code: "",
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "bulk">("form");

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      getOrganisationById(id)
        .then((data) => {
          setFormData({
            org_name: data.org_name || "",
            org_code: data.org_code || "",
          });
        })
        .catch(() => toast.error("Failed to load organisation"))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        await updateOrganisation(id, formData);
        toast.success("Organisation updated successfully!");
      } else {
        await createOrganisation(formData);
        toast.success("Organisation created successfully!");
      }
      setTimeout(() => navigate("/organisations/view"), 800);
    } catch (err) {
      toast.error("Failed to save organisation");
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
          Organisation Form
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
            <span className="mr-2">
              <svg
                width="1em"
                height="1em"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v3.1a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-3.1a.5.5 0 0 1 1 0v3.1A1.5 1.5 0 0 1 15 15H1a1.5 1.5 0 0 1-1.5-1.5v-3.1a.5.5 0 0 1 .5-.5z" />
                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 1 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
              </svg>
            </span>
            Bulk Upload
          </button>
        )}
      </div>
      {activeTab === "form" ? (
        <>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            {isEdit ? "Edit Organisation" : "Add New Organisation"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
            <InputField
              label="Organisation Name"
              name="org_name"
              value={formData.org_name}
              onChange={handleChange}
            />
            <InputField
              label="Organisation Code"
              name="org_code"
              value={formData.org_code}
              onChange={handleChange}
            />
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={() => navigate("/organisations/view")}
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
        <OrganisationBulkUpload />
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
