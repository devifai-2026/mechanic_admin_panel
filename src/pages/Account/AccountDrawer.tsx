import { FaTimes, FaTag, FaCalendarAlt, FaLayerGroup } from "react-icons/fa";
import { useState } from "react";

const AccountDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  account: any;
}> = ({ isOpen, onClose, account }) => {
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen || !account) return null;

  const filteredFields = [
    {
      title: "Account Code",
      value: account.account_code,
      icon: <FaTag />,
    },
    {
      title: "Account Group Name",
      value: account.group?.account_group_name || "-",
      icon: <FaLayerGroup />,
    },
    {
      title: "Account Group Code",
      value: account.group?.account_group_code || "-",
      icon: <FaLayerGroup />,
    },
    {
      title: "Created At",
      value: account.createdAt
        ? new Date(account.createdAt).toLocaleString()
        : "-",
      icon: <FaCalendarAlt />,
    },
    {
      title: "Updated At",
      value: account.updatedAt
        ? new Date(account.updatedAt).toLocaleString()
        : "-",
      icon: <FaCalendarAlt />,
    },
  ].filter((field) =>
    field.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[99999] ">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-opacity-30 transition-opacity "
        onClick={onClose}
        style={{ zIndex: 1 }}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-800 shadow-2xl transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ zIndex: 2 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
          aria-label="Close drawer"
        >
          <FaTimes
            className="text-gray-500 hover:text-red-500 dark:text-gray-300"
            size={20}
          />
        </button>

        <div className="p-6 pt-12 flex-grow overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {account.account_name}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">Account Details</p>
          </div>

          {/* 👇 Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search field title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredFields.map((field, index) => (
              <DrawerInfo
                key={index}
                title={field.title}
                icon={field.icon}
                value={field.value}
              />
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DrawerInfo: React.FC<{
  title: string;
  value: any;
  icon: React.ReactNode;
}> = ({ title, value, icon }) => (
  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
    <div className="flex items-center mb-3">
      <div className="text-gray-500 dark:text-gray-300 mr-2">{icon}</div>
      <h3 className="font-semibold text-gray-700 dark:text-white">{title}</h3>
    </div>
    <p className="text-gray-800 dark:text-gray-200 pl-6">{value || "-"}</p>
  </div>
);

export default AccountDrawer;
