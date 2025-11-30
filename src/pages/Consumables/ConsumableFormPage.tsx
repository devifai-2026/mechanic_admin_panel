import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  createItem,
  fetchItemById,
  updateItem,
} from "../../apis/consumableApi";

import { ItemPostPayload } from "../../types/consumableItemTypes";
import { ItemGroup } from "../../types/itemGroupTypes";
import { OEM } from "../../types/oemTypes";
import { UOM } from "../../types/uomTypes";
import { Account } from "../../types/accountTypes";
import { getAllItemGroups } from "../../apis/intemGroupApi";
import { getAllOEMs } from "../../apis/oemApi";
import { getAllUOMs } from "../../apis/uomApi";
import { getAllAccounts } from "../../apis/accountApi";
import ConsumableBulkUpload from "./ConsumableBulkUpload";

export default function ConsumableFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    itemCode: "",
    name: "",
    description: "",
    type: "",
    make: "",
    uom: "",
    qtyInHand: 0,
    accIn: "",
    accOut: "",
    itemGroup: "",
    revenue: "",
    hsn_number: "",
  });

  const [itemGroups, setItemGroups] = useState<ItemGroup[]>([]);
  const [oems, setOems] = useState<OEM[]>([]);
  const [uoms, setUoms] = useState<UOM[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "bulk">("form");

  const PRODUCT_TYPE_OPTIONS = [
    { label: "Goods", value: "Goods" },
    { label: "Services", value: "Services" },
  ];

  // Filter accounts by group type
  const assetAccounts = accounts.filter(account => 
    account.group?.account_group_name?.toLowerCase() === "assets"
  );
  
  const expenseAccounts = accounts.filter(account => 
    account.group?.account_group_name?.toLowerCase() === "expenses"
  );
  
  const incomeAccounts = accounts.filter(account => 
    account.group?.account_group_name?.toLowerCase() === "income"
  );

  useEffect(() => {
    Promise.all([
      getAllItemGroups(),
      getAllOEMs(),
      getAllUOMs(),
      getAllAccounts(),
    ])
      .then(([groups, oems, uoms, accounts]) => {
        setItemGroups(groups);
        setOems(oems);
        setUoms(uoms);
        setAccounts(accounts);
      })
      .catch(() => toast.error("Failed to fetch dropdown data"));
  }, []);

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      fetchItemById(id)
        .then((data) => {
          setFormData({
            itemCode: data.item_code || "",
            name: data.item_name || "",
            description: data.item_description || "",
            type: data.product_type || "",
            make: data.item_make || "",
            uom: data.unit_of_measurement || "",
            qtyInHand: data.item_qty_in_hand || 0,
            accIn: data.inventory_account_code || "",
            accOut: data.expense_account_code || "",
            itemGroup: data.item_group_id || "",
            revenue: data.revenue_account_code || "",
            hsn_number: data.hsn_number || "",
          });
        })
        .catch(() => toast.error("Failed to load consumable"))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (name === "hsn_number") {
      const numeric = value.replace(/\D/g, "");
      if (numeric.length <= 8) {
        setFormData((prev) => ({ ...prev, [name]: numeric }));
      }
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? 0 : parseFloat(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload: ItemPostPayload = {
      item_code: formData.itemCode,
      item_name: formData.name,
      item_description: formData.description,
      product_type: formData.type,
      item_group_id: formData.itemGroup,
      item_make: formData.make,
      unit_of_measurement: formData.uom,
      item_qty_in_hand: formData.qtyInHand,
      item_avg_cost: 0,
      inventory_account_code: formData.accIn,
      expense_account_code: formData.accOut,
      revenue_account_code: formData.revenue,
      hsn_number: formData.hsn_number,
    };

    try {
      if (isEdit && id) {
        await updateItem(id, payload);
        toast.success("Consumable updated successfully!");
      } else {
        await createItem(payload);
        toast.success("Consumable created successfully!");
      }
      setTimeout(() => navigate("/consumables/view"), 800);
    } catch (err) {
      toast.error("Failed to save consumable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow">
      <ToastContainer position="bottom-right" autoClose={3000} />
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setActiveTab("form")}
          className={`flex items-center px-4 py-2 rounded-md transition-colors ${
            activeTab === "form"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          Consumable Form
        </button>
        {!isEdit && (
          <button
            onClick={() => setActiveTab("bulk")}
            className={`flex items-center px-4 py-2 rounded-md transition-colors ${
              activeTab === "bulk"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            <span className="mr-2">📥</span>
            Bulk Upload
          </button>
        )}
      </div>

      {activeTab === "form" ? (
        <>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            {isEdit ? "Edit Consumable" : "Add New Consumable"}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <InputField
              label="Item Code"
              name="itemCode"
              value={formData.itemCode}
              onChange={handleChange}
              placeholder="Enter item code (e.g., ITM001)"
            />
            <InputField
              label="Item Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter item name"
            />
            <TextAreaField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter item description and specifications"
            />
            <SelectField
              label="Product Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={PRODUCT_TYPE_OPTIONS}
            />
            <SelectField
              label="Item Group"
              name="itemGroup"
              value={formData.itemGroup}
              onChange={handleChange}
              options={itemGroups.map((i) => ({
                label: i.group_name,
                value: i.id,
              }))}
            />
            <SelectField
              label="Item Make"
              name="make"
              value={formData.make}
              onChange={handleChange}
              options={oems.map((o) => ({ label: o.oem_name, value: o.id }))}
            />
            <SelectField
              label="UOM"
              name="uom"
              value={formData.uom}
              onChange={handleChange}
              options={uoms.map((u) => ({ label: u.unit_name, value: u.id }))}
            />
            <InputField
              label="Qty in Hand"
              name="qtyInHand"
              value={formData.qtyInHand}
              onChange={handleChange}
              type="number"
              placeholder="Enter current quantity"
              min="0"
            />
            <InputFieldHSN
              label="HSN Number"
              name="hsn_number"
              value={formData.hsn_number}
              onChange={handleChange}
            />
            <SelectField
              label="Inventory Account"
              name="accIn"
              value={formData.accIn}
              onChange={handleChange}
              options={assetAccounts.map((a) => ({
                label: `${a.account_code} - ${a.account_name}`,
                value: a.id,
              }))}
              helperText="Assets accounts only"
            />
            <SelectField
              label="Expense Account"
              name="accOut"
              value={formData.accOut}
              onChange={handleChange}
              options={expenseAccounts.map((a) => ({
                label: `${a.account_code} - ${a.account_name}`,
                value: a.id,
              }))}
              helperText="Expenses accounts only"
            />
            <SelectField
              label="Revenue Account"
              name="revenue"
              value={formData.revenue}
              onChange={handleChange}
              options={incomeAccounts.map((r) => ({
                label: `${r.account_code} - ${r.account_name}`,
                value: r.id,
              }))}
              helperText="Income accounts only"
            />

            <div className="col-span-1 md:col-span-2 flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={() => navigate("/consumables/view")}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? isEdit
                    ? "Updating..."
                    : "Creating..."
                  : isEdit
                  ? "Update Consumable"
                  : "Create Consumable"}
              </button>
            </div>
          </form>
        </>
      ) : (
        <ConsumableBulkUpload />
      )}
    </div>
  );
}

// Reusable Input Components
interface InputFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  type?: string;
  placeholder?: string;
  min?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  min,
}) => {
  const defaultPlaceholders: Record<string, string> = {
    itemCode: "Enter item code (e.g., ITM001)",
    name: "Enter item name",
    qtyInHand: "Enter current quantity"
  };

  const fieldPlaceholder = placeholder || defaultPlaceholders[name] || `Enter ${label.toLowerCase()}`;

  return (
    <div>
      <label className="mb-1 text-gray-700 dark:text-gray-200 font-medium">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={fieldPlaceholder}
        min={min}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      />
    </div>
  );
};

interface InputFieldHSNProps {
  label: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const InputFieldHSN: React.FC<InputFieldHSNProps> = ({
  label,
  name,
  value,
  onChange,
}) => (
  <div>
    <label className="mb-1 text-gray-700 dark:text-gray-200 font-medium">
      {label}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      maxLength={8}
      pattern="\d{8}"
      inputMode="numeric"
      placeholder="Enter 8-digit HSN number"
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
    />
  </div>
);

interface TextAreaFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder = "",
}) => (
  <div className="md:col-span-2">
    <label className="mb-1 text-gray-700 dark:text-gray-200 font-medium">
      {label}
    </label>
    <textarea
      name={name}
      rows={3}
      value={value}
      onChange={onChange}
      placeholder={placeholder || `Enter ${label.toLowerCase()}`}
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
    />
  </div>
);

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  options: { label: string; value: string }[];
  helperText?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  helperText,
}) => (
  <div>
    <label className="mb-1 text-gray-700 dark:text-gray-200 font-medium">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
    >
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {helperText && (
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        {helperText}
      </p>
    )}
  </div>
);