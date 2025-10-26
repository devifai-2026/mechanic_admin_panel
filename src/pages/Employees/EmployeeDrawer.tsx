import {
  FaCheck,
  FaClock,
  FaMapMarkerAlt,
  FaTimes,
  FaTint,
  FaUser,
  FaUserShield,
} from "react-icons/fa";

const EmployeeDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  employee: any;
}> = ({ isOpen, onClose, employee }) => {
  if (!isOpen || !employee) return null;
  console.log({ employee });
  return (
    <div className="fixed inset-0 z-[99999] ">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-opacity-30 transition-opacity pointer-events-auto"
        onClick={onClose}
        style={{ zIndex: 1 }}
      />
      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-800 shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ zIndex: 2 }}
      >
        <div className="relative h-full flex flex-col">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close drawer"
          >
            <FaTimes
              className="text-gray-500 hover:text-red-500 dark:text-gray-300"
              size={20}
            />
          </button>
          <div className="p-6 overflow-y-auto pt-12">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg mr-4">
                <FaUser
                  className="text-blue-600 dark:text-blue-300"
                  size={24}
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {employee.emp_name} {employee.emp_id}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Employee Details
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <FaIdCard className="text-gray-500 dark:text-gray-300 mr-2" />
                  <h3 className="font-semibold text-gray-700 dark:text-white">
                    Emp ID
                  </h3>
                </div>
                <p className="text-gray-800 dark:text-gray-200 pl-6">
                  {employee.emp_id}
                </p>
              </div> */}
              {/* <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <FaUserTie className="text-gray-500 dark:text-gray-300 mr-2" />
                  <h3 className="font-semibold text-gray-700 dark:text-white">
                    Position
                  </h3>
                </div>
                <p className="text-gray-800 dark:text-gray-200 pl-6">
                  {employee.position}
                </p>
              </div> */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <FaTint className="text-gray-500 dark:text-gray-300 mr-2" />
                  <h3 className="font-semibold text-gray-700 dark:text-white">
                    Blood Group
                  </h3>
                </div>
                <p className="text-gray-800 dark:text-gray-200 pl-6">
                  {employee.bloodGroup}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <FaUserShield className="text-gray-500 dark:text-gray-300 mr-2" />
                  <h3 className="font-semibold text-gray-700 dark:text-white">
                    Role
                  </h3>
                </div>
                <p className="text-gray-800 dark:text-gray-200 pl-6">
                  {employee.role}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <FaUserShield className="text-gray-500 dark:text-gray-300 mr-2" />
                  <h3 className="font-semibold text-gray-700 dark:text-white">
                    App Role
                  </h3>
                </div>
                <p className="text-gray-800 dark:text-gray-200 pl-6">
                  {employee.app_access_role}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <FaClock className="text-gray-500 dark:text-gray-300 mr-2" />
                  <h3 className="font-semibold text-gray-700 dark:text-white">
                    Shift
                  </h3>
                </div>
                <p className="text-gray-800 dark:text-gray-200 pl-6">
                  {employee.shift}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <FaMapMarkerAlt className="text-gray-500 dark:text-gray-300 mr-2" />
                  <h3 className="font-semibold text-gray-700 dark:text-white">
                    Address
                  </h3>
                </div>
                <p className="text-gray-800 dark:text-gray-200 pl-6">
                  {employee.address}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <FaTint className="text-gray-500 dark:text-gray-300 mr-2" />
                  <h3 className="font-semibold text-gray-700 dark:text-white">
                    State
                  </h3>
                </div>
                <p className="text-gray-800 dark:text-gray-200 pl-6">
                  {employee.state}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <FaTint className="text-gray-500 dark:text-gray-300 mr-2" />
                  <h3 className="font-semibold text-gray-700 dark:text-white">
                    City
                  </h3>
                </div>
                <p className="text-gray-800 dark:text-gray-200 pl-6">
                  {employee.city}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <FaTint className="text-gray-500 dark:text-gray-300 mr-2" />
                  <h3 className="font-semibold text-gray-700 dark:text-white">
                    Pincode
                  </h3>
                </div>
                <p className="text-gray-800 dark:text-gray-200 pl-6">
                  {employee.pincode}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <FaUser className="text-gray-500 dark:text-gray-300 mr-2" />
                  <h3 className="font-semibold text-gray-700 dark:text-white">
                    Age
                  </h3>
                </div>
                <p className="text-gray-800 dark:text-gray-200 pl-6">
                  {employee.age}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <FaCheck className="text-gray-500 dark:text-gray-300 mr-2" />
                  <h3 className="font-semibold text-gray-700 dark:text-white">
                    Active
                  </h3>
                </div>
                <p className="text-gray-800 dark:text-gray-200 pl-6">
                  {employee.active === true || employee.active === "Yes"
                    ? "Yes"
                    : "No"}
                </p>
              </div>
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  Bank Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-white mb-1">
                      Account Holder Name
                    </h4>
                    <p className="text-gray-800 dark:text-gray-200">
                      {employee.acc_holder_name || "N/A"}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-white mb-1">
                      Bank Name
                    </h4>
                    <p className="text-gray-800 dark:text-gray-200">
                      {employee.bank_name || "N/A"}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-white mb-1">
                      Account Number
                    </h4>
                    <p className="text-gray-800 dark:text-gray-200">
                      {employee.acc_no || "N/A"}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-white mb-1">
                      IFSC Code
                    </h4>
                    <p className="text-gray-800 dark:text-gray-200">
                      {employee.ifsc_code || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-span-1 md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-white mb-1">
                      Aadhar Number
                    </h4>
                    <p className="text-gray-800 dark:text-gray-200">
                      {employee.aadhar_number || "N/A"}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-white mb-1">
                      Date of Birth *
                    </h4>
                    <p className="text-gray-800 dark:text-gray-200">
                      {employee.dob
                        ? new Date(employee.dob).toLocaleDateString("en-GB")
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
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
    </div>
  );
};

export default EmployeeDrawer;
