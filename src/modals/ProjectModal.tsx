import React, { useState, useEffect, useRef } from "react";
import {
  FaSave,
  FaCalendarAlt,
  FaUserTie,
  FaFileAlt,
  FaClock,
  FaChevronLeft,
  FaPrint,
  FaShare,
  FaEllipsisV,
  FaPlus,
} from "react-icons/fa";
import { Customer } from "../types/customerTypes";
import { fetchCustomers } from "../apis/customerApi";
import { fetchRevenues } from "../apis/revenueApi";
import { fetchEquipments } from "../apis/equipmentApi";
import { MultiSelect } from "../components/projects/MultiSelect";

type ProjectViewProps = {
  onClose: () => void;
  onSubmit: (data: any) => void;
  project?: any;
  mode?: "view" | "edit" | "create";
};

type Option = {
  value: string;
  text: string;
  selected: boolean;
};

export const ProjectView: React.FC<ProjectViewProps> = ({
  onClose,
  onSubmit,
  project,
  mode = "view",
}) => {
  const [formData, setFormData] = useState({
    projectNo: "",
    customer: "",
    orderNo: "",
    contractStartDate: "",
    contractTenure: "",
    revenueMaster: [],
    equipments: [],
    staff: [],
    storeLocations: [],
  });

  const [activeTab, setActiveTab] = useState("details");
  const [editMode, setEditMode] = useState(
    mode === "edit" || mode === "create"
  );
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [revenueOptions, setRevenueOptions] = useState<Option[]>([]);
  const [equipmentOptions, setEquipmentOptions] = useState<Option[]>([]);

  // Fetch equipments
  useEffect(() => {
    const getEquipments = async () => {
      try {
        const equipments = await fetchEquipments();
        setEquipmentOptions(
          equipments.map((eq: any) => ({
            value: eq.id,
            text: eq.equipment_name,
            selected: false,
          }))
        );
      } catch (err) {
        console.error("Error loading equipments", err);
      }
    };
    getEquipments();
  }, []);

  // Fetch customers
  useEffect(() => {
    const getCustomers = async () => {
      try {
        const data = await fetchCustomers();
        setCustomers(data);
      } catch (err) {
        console.error("Error loading customers", err);
      }
    };

    getCustomers();
  }, []);

  // Fetch revenues
  useEffect(() => {
    const getRevenues = async () => {
      try {
        const revenues = await fetchRevenues();
        setRevenueOptions(
          revenues.map((rev) => ({
            value: rev.id,
            text: `${rev.revenue_code} - ${rev.revenue_description}`,
            selected: false,
          }))
        );
      } catch (err) {
        console.error("Error loading revenues", err);
      }
    };
    getRevenues();
  }, []);

  // Update form data when project prop changes
  useEffect(() => {
    if (project) {
      setFormData({
        projectNo: project.projectNo || "",
        customer: project.customer || "",
        orderNo: project.orderNo || "",
        contractStartDate: project.contractStart || "",
        contractTenure: project.tenure || "",
        revenueMaster: project.revenueMaster || [],
        equipments: project.equipments || [],
        staff: project.staff || [],
        storeLocations: project.storeLocations || [],
      });
    } else if (mode === "create") {
      setFormData({
        projectNo: "",
        customer: "",
        orderNo: "",
        contractStartDate: "",
        contractTenure: "",
        revenueMaster: [],
        equipments: [],
        staff: [],
        storeLocations: [],
      });
    }
  }, [project, mode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (name: string, values: string[]) => {
    setFormData((prev) => ({ ...prev, [name]: values }));
  };

  const dummyOptions = {
    customer: ["Partner A", "Partner B"],
    tenure: ["3 months", "6 months", "12 months"],
  };

  const multiOptions = {
    revenueMaster: revenueOptions,
    equipments: equipmentOptions,
    staff: [
      { value: "emp1", text: "Alice", selected: false },
      { value: "emp2", text: "Bob", selected: false },
      { value: "emp3", text: "Charlie", selected: false },
    ],
    storeLocations: [
      { value: "loc1", text: "Mumbai", selected: false },
      { value: "loc2", text: "Delhi", selected: false },
      { value: "loc3", text: "Chennai", selected: false },
    ],
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Left Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <FaChevronLeft className="mr-2" />
            <span>Back to Projects</span>
          </button>
        </div>

        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            {project ? project.projectNo : "New Project"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {project ? "Project" : "Create new project"}
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <ul>
            <li>
              <button
                onClick={() => setActiveTab("details")}
                className={`w-full text-left px-4 py-3 flex items-center ${
                  activeTab === "details"
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <FaFileAlt className="mr-3" />
                Details
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("revenues")}
                className={`w-full text-left px-4 py-3 flex items-center ${
                  activeTab === "revenues"
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <FaFileAlt className="mr-3" />
                Revenues
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("equipments")}
                className={`w-full text-left px-4 py-3 flex items-center ${
                  activeTab === "equipments"
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <FaFileAlt className="mr-3" />
                Equipments
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("team")}
                className={`w-full text-left px-4 py-3 flex items-center ${
                  activeTab === "team"
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <FaUserTie className="mr-3" />
                Team
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            {mode === "create"
              ? "Create New Project"
              : `Project ${project?.projectNo}`}
          </h1>

          <div className="flex space-x-2">
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
              >
                <FaSave className="mr-2" />
                Edit
              </button>
            )}

            <button className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
              <FaPrint className="text-gray-600 dark:text-gray-300" />
            </button>

            <button className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
              <FaShare className="text-gray-600 dark:text-gray-300" />
            </button>

            <button className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
              <FaEllipsisV className="text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-white dark:bg-gray-900">
          {activeTab === "details" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit(formData);
                if (mode === "create") onClose();
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Project No */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Project No
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="projectNo"
                      value={formData.projectNo}
                      onChange={handleChange}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="PRJ-001"
                      disabled={!editMode}
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-400">
                      #
                    </span>
                  </div>
                </div>

                {/* Customer */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Customer
                  </label>
                  <div className="relative">
                    <select
                      name="customer"
                      value={formData.customer}
                      onChange={handleChange}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white appearance-none"
                      disabled={!editMode}
                    >
                      <option value="">Select customer</option>
                      {customers.map((cust) => (
                        <option key={cust.id} value={cust.id}>
                          {cust.partner_name}
                        </option>
                      ))}
                    </select>
                    <FaUserTie className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-400" />
                  </div>
                </div>

                {/* Order No */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Order No
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="orderNo"
                      value={formData.orderNo}
                      onChange={handleChange}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="ORD-001"
                      disabled={!editMode}
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-400">
                      #
                    </span>
                  </div>
                </div>

                {/* Contract Start Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Contract Start Date
                  </label>
                  <div
                    className="relative"
                    onClick={() =>
                      editMode && dateInputRef.current?.showPicker()
                    }
                    style={{ cursor: editMode ? "pointer" : "default" }}
                  >
                    <input
                      type="date"
                      name="contractStartDate"
                      value={formData.contractStartDate}
                      onChange={handleChange}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      ref={dateInputRef}
                      onClick={(e) => e.stopPropagation()}
                      disabled={!editMode}
                    />
                    <FaCalendarAlt
                      className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-400"
                      onClick={() =>
                        editMode && dateInputRef.current?.showPicker()
                      }
                      style={{ cursor: editMode ? "pointer" : "default" }}
                    />
                  </div>
                </div>

                {/* Contract Tenure */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Contract Tenure
                  </label>
                  <div className="relative">
                    <select
                      name="contractTenure"
                      value={formData.contractTenure}
                      onChange={handleChange}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white appearance-none"
                      disabled={!editMode}
                    >
                      <option value="">Select tenure</option>
                      {dummyOptions.tenure.map((tenure, idx) => (
                        <option key={idx} value={tenure}>
                          {tenure}
                        </option>
                      ))}
                    </select>
                    <FaClock className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-400" />
                  </div>
                </div>
              </div>

              {editMode && (
                <div className="flex justify-end mt-6 space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (mode === "create") {
                        onClose();
                      } else {
                        setEditMode(false);
                      }
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
                  >
                    <FaSave className="mr-2" />
                    {mode === "create" ? "Create Project" : "Save Changes"}
                  </button>
                </div>
              )}
            </form>
          )}

          {activeTab === "revenues" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Revenue Master
                </h2>
                {editMode && (
                  <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center">
                    <FaPlus className="mr-1" size={12} />
                    Add Revenue
                  </button>
                )}
              </div>

              <MultiSelect
                label="Revenue Master"
                options={multiOptions.revenueMaster}
                defaultSelected={formData.revenueMaster}
                onChange={(values :any) =>
                  handleMultiSelectChange("revenueMaster", values)
                }
                disabled={!editMode}
              />
            </div>
          )}

          {activeTab === "equipments" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Equipments
                </h2>
                {editMode && (
                  <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center">
                    <FaPlus className="mr-1" size={12} />
                    Add Equipment
                  </button>
                )}
              </div>

              <MultiSelect
                label="Equipments"
                options={multiOptions.equipments}
                defaultSelected={formData.equipments}
                onChange={(values) =>
                  handleMultiSelectChange("equipments", values)
                }
                disabled={!editMode}
              />
            </div>
          )}

          {activeTab === "team" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Team Members
                </h2>
                {editMode && (
                  <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center">
                    <FaPlus className="mr-1" size={12} />
                    Add Member
                  </button>
                )}
              </div>

              <MultiSelect
                label="Staff"
                options={multiOptions.staff}
                defaultSelected={formData.staff}
                onChange={(values) => handleMultiSelectChange("staff", values)}
                disabled={!editMode}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

