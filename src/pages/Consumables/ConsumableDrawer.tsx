import {
  FaTimes,
  FaTag,
  FaToolbox,
  FaIndustry,
  FaCubes,
  FaChartLine,
  FaDownload,
  FaUpload,
} from "react-icons/fa";

const ConsumableDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  item: any;
}> = ({ isOpen, onClose, item }) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-[99999]">
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

        {/* Content container - flex-grow to fill height and scroll if needed */}
        <div className="p-6 pt-12 flex-grow">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg mr-4">
              <FaToolbox
                className="text-blue-600 dark:text-blue-300"
                size={24}
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {item.item_name}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Consumable Details
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DrawerInfo
              title="Item Code"
              icon={<FaTag />}
              value={item.item_code}
            />
            <DrawerInfo
              title="Description"
              icon={<FaTag />}
              value={item.item_description}
            />
            <DrawerInfo
              title="Type"
              icon={<FaToolbox />}
              value={item.product_type}
            />
            <DrawerInfo
              title="Group"
              icon={<FaToolbox />}
              value={item.itemGroup?.group_name}
            />
            <DrawerInfo
              title="Make"
              icon={<FaIndustry />}
              value={item.oem?.oem_name}
            />
            <DrawerInfo
              title="UOM"
              icon={<FaCubes />}
              value={item.uom?.unit_name}
            />
            <DrawerInfo
              title="Qty In Hand"
              icon={<FaChartLine />}
              value={item.item_qty_in_hand}
            />
            <DrawerInfo
              title="Avg Cost"
              icon={<FaChartLine />}
              value={`₹${item.item_avg_cost}`}
            />
            <DrawerInfo
              title="Acc. In"
              icon={<FaDownload />}
              value={item.inventoryAccount?.account_name}
            />
            <DrawerInfo
              title="Acc. Out"
              icon={<FaUpload />}
              value={item.expenseAccount?.account_name}
            />
            <DrawerInfo
              title="Revenue Account"
              icon={<FaChartLine />}
              value={item.revenueAccount?.revenue_description}
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

export default ConsumableDrawer;
