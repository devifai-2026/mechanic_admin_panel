import { FaTimes, FaTag, FaCalendarAlt } from "react-icons/fa";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${String(date.getDate()).padStart(2, "0")}-${date.toLocaleString("default", {
    month: "short",
  })}-${date.getFullYear()}`;
};

const EquipmentDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  equipmentGroup: any;
}> = ({ isOpen, onClose, equipmentGroup }) => {
  if (!isOpen || !equipmentGroup) return null;

  return (
    <div className="fixed inset-0 z-[99999] pointer-events-none">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-opacity-30 transition-opacity pointer-events-auto"
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

        <div className="p-6 pt-12 flex-grow">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {equipmentGroup.equipment_group}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">Equipment Group Details</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DrawerInfo
              title="Group Code"
              icon={<FaTag />}
              value={equipmentGroup.equip_grp_code}
            />
            <DrawerInfo
              title="Created At"
              icon={<FaCalendarAlt />}
              value={
                equipmentGroup.createdAt
                  ? formatDate(equipmentGroup.createdAt)
                  : "-"
              }
            />
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

export default EquipmentDrawer;
