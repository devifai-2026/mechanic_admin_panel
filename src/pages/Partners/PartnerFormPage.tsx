import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createCustomer,
  fetchCustomerById,
  updateCustomer,
} from "../../apis/customerApi";
import { toast, ToastContainer } from "react-toastify";
import {
  FaUser,
  FaMapMarkerAlt,
  FaReceipt,
  FaGlobe,
  FaUpload,
} from "react-icons/fa";
import PartnerBulkUpload from "./PartnerBulkUpload";
import { State, City, IState, ICity } from "country-state-city";

type FormDataType = {
  partner_name: string;
  partner_address: string;
  partner_gst: string;
  partner_geo_id: string | number;
  isCustomer: boolean;
  state: string;
  city: string;
  pincode: string;
};

type ParamsType = {
  id?: string;
};

export default function PartnerFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<ParamsType>();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<FormDataType>({
    partner_name: "",
    partner_address: "",
    partner_gst: "",
    partner_geo_id: "",
    isCustomer: true,
    state: "",
    city: "",
    pincode: "",
  });

  console.log({ formData });

  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "bulk">("form");

  useEffect(() => {
    const indianStates = State.getStatesOfCountry("IN");
    setStates(indianStates);
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      const indianStates = State.getStatesOfCountry("IN");
      setStates(indianStates);

      if (isEdit && id) {
        setLoading(true);
        try {
          const data = await fetchCustomerById(id);

          setFormData((prev) => ({
            ...prev,
            partner_name: data.partner_name,
            partner_address: data.partner_address,
            partner_gst: data.partner_gst,
            partner_geo_id: data.partner_geo_id,
            isCustomer: data.isCustomer,
            state: data.state,
            city: data.city,
            pincode: data.pincode,
          }));

          const selectedState = indianStates.find((s) => s.name === data.state);
          if (selectedState) {
            const citiesInState = City.getCitiesOfState(
              "IN",
              selectedState.isoCode
            );
            setCities(citiesInState);
          } else {
            setCities([]);
          }
        } catch (err) {
          toast.error("Failed to load partner");
        } finally {
          setLoading(false);
        }
      }
    };

    loadInitialData();
  }, [id, isEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStateCode = e.target.value;
    const selectedState = states.find(
      (s) => s.isoCode === selectedStateCode || formData.state
    );
    const stateName = selectedState?.name || "";
    const citiesInState = City.getCitiesOfState(
      "IN",
      selectedStateCode || formData.city
    );
    console.log({ citiesInState });
    setCities(citiesInState);

    setFormData((prev) => ({
      ...prev,
      state: stateName,
      city: "",
    }));
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      city: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        partner_geo_id: Number(formData.partner_geo_id),
      };

      if (isEdit && id) {
        await updateCustomer(id, payload);
        toast.success("Partner updated successfully!");
      } else {
        await createCustomer(payload);
        toast.success("Partner created successfully!");
      }

      setTimeout(() => {
        navigate("/partners/view");
      }, 800);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          (isEdit ? "Failed to update partner." : "Failed to create partner.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
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
          <FaUser className="mr-2" /> Single Partner
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
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
            <FaUser className="text-blue-600" /> {isEdit ? "Edit" : "Create"}{" "}
            Partner
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Partner Name */}
            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                <span className="inline-flex items-center gap-2">
                  <FaUser /> Partner Name
                </span>
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="partner_name"
                  value={formData.partner_name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* GST */}
            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                <span className="inline-flex items-center gap-2">
                  <FaReceipt /> GST
                </span>
              </label>
              <div className="relative">
                <FaReceipt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="partner_gst"
                  value={formData.partner_gst}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Geo ID */}
            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                <span className="inline-flex items-center gap-2">
                  <FaGlobe /> Geo ID
                </span>
              </label>
              <div className="relative">
                <FaGlobe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  name="partner_geo_id"
                  value={formData.partner_geo_id}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                <span className="inline-flex items-center gap-2">
                  <FaMapMarkerAlt /> Address
                </span>
              </label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                <textarea
                  name="partner_address"
                  value={formData.partner_address}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* State, City, Pincode */}
            <div className="flex flex-wrap gap-4">
              {/* State */}
              <div className="flex-1 min-w-[150px]">
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                  State
                </label>
                <select
                  value={
                    states.find((s) => s.name === formData.state)?.isoCode || ""
                  }
                  onChange={handleStateChange}
                  className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state.isoCode} value={state.isoCode}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div className="flex-1 min-w-[150px]">
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                  City
                </label>
                <select
                  value={formData.city}
                  onChange={handleCityChange}
                  disabled={!formData.state}
                  className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select City</option>
                  {cities.map((city) => {
                    console.log({ city }); // ✅ valid here
                    return (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Pincode */}
              <div className="flex-1 min-w-[150px]">
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isCustomer"
                checked={formData.isCustomer}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="text-gray-700 dark:text-gray-200">
                Is Customer
              </label>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate("/partners/view")}
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
        <PartnerBulkUpload />
      )}
    </div>
  );
}
