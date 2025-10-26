import { useState } from "react";
import { useLocation, useNavigate, To } from "react-router-dom";
import {
  MdWork,
  MdPeople,
  MdBusiness,
  MdBuild,
  MdAttachMoney,
  MdLocationOn,
  MdInventory,
  MdAccessTime,
  MdSecurity,
  MdArrowBack,
} from "react-icons/md";
import { AiFillPlusCircle } from "react-icons/ai";
import { CgOrganisation } from "react-icons/cg";
import { SiBaremetrics, SiOrigin } from "react-icons/si";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { FaLayerGroup } from "react-icons/fa6";
import { MdAccountBalance } from "react-icons/md";
import { useSidebar } from "../context/SidebarContext";
import UserDropdown from "../components/header/UserDropdown";

type NavItem = {
  name: string;
  icon?: React.ReactNode;
  path?: string;
  subItems?: NavItem[];
};

// Main categories
const mainCategories: NavItem[] = [
  {
    name: "View Master",
    icon: <MdBusiness size={20} />,
  },
  {
    name: "View Transaction",
    icon: <MdAttachMoney size={20} />,
  },
  {
    name: "View Reports",
    icon: <MdAccountBalance size={20} />,
  },
];

// Master items with create/view options
const masterItems: NavItem[] = [
  {
    icon: <MdWork size={20} />,
    name: "Projects",
    path: "/projects/view",
    subItems: [
      { name: "Create Project", path: "/projects/create" },
      { name: "View Projects", path: "/projects/view" },
    ],
  },
  {
    icon: <MdPeople size={20} />,
    name: "Employees",
    path: "/employees/view",
    subItems: [
      { name: "Create Employee", path: "/employees/create" },
      { name: "View Employees", path: "/employees/view" },
    ],
  },
  {
    icon: <MdBusiness size={20} />,
    name: "Partners",
    path: "/partners/view",
    subItems: [
      { name: "Create Partner", path: "/partners/create" },
      { name: "View Partners", path: "/partners/view" },
    ],
  },
  {
    icon: <FaMoneyBillTrendUp size={20} />,
    name: "Revenues",
    path: "/revenues/view",
    subItems: [
      { name: "Create Revenues", path: "/revenues/create" },
      { name: "View Revenues", path: "/revenues/view" },
    ],
  },
  {
    icon: <MdBuild size={20} />,
    name: "Equipments",
    path: "/equipments/view",
    subItems: [
      { name: "Add Equipment", path: "/equipments/create" },
      { name: "View Equipments", path: "/equipments/view" },
    ],
  },
  {
    icon: <MdLocationOn size={20} />,
    name: "Store Locations",
    path: "/store-locations/view",
    subItems: [
      { name: "Add Store", path: "/store-locations/create" },
      { name: "View Stores", path: "/store-locations/view" },
    ],
  },
  {
    icon: <MdInventory size={20} />,
    name: "Consumables",
    path: "/consumables/view",
    subItems: [
      { name: "Add Consumable", path: "/consumable/create" },
      { name: "View Consumables", path: "/consumables/view" },
    ],
  },
  {
    icon: <MdAccessTime size={20} />,
    name: "Shifts",
    path: "/shifts/view",
    subItems: [
      { name: "Create Shift", path: "/shifts/create" },
      { name: "View Shifts", path: "/shifts/view" },
    ],
  },
  {
    icon: <MdSecurity size={20} />,
    name: "Roles",
    path: "/roles/view",
    subItems: [
      { name: "Create Role", path: "/roles/create" },
      { name: "View Roles", path: "/roles/view" },
    ],
  },
  {
    icon: <CgOrganisation size={20} />,
    name: "Organisations",
    path: "/organisations/view",
    subItems: [
      { name: "Create Organisation", path: "/organisations/create" },
      { name: "View Organisations", path: "/organisations/view" },
    ],
  },
  {
    icon: <SiBaremetrics size={20} />,
    name: "Units Of Measurement",
    path: "/uom/view",
    subItems: [
      { name: "Create Uom", path: "/uom/create" },
      { name: "View Uom", path: "/uom/view" },
    ],
  },
  {
    icon: <SiBaremetrics size={20} />,
    name: "OEM",
    path: "/oem/view",
    subItems: [
      { name: "Create OEM", path: "/oem/create" },
      { name: "View OEM", path: "/oem/view" },
    ],
  },
  {
    icon: <FaLayerGroup size={20} />,
    name: "Item Group",
    path: "/itemGroup/view",
    subItems: [
      { name: "Create ItemGroup", path: "/itemGroup/create" },
      { name: "View ItemGroup", path: "/itemGroup/view" },
    ],
  },
  {
    icon: <FaLayerGroup size={20} />,
    name: "Equipment Group",
    path: "/equipmentgroup/view",
    subItems: [
      { name: "Create Equipment Group", path: "/equipmentgroup/create" },
      { name: "View Equipment Group", path: "/equipmentgroup/view" },
    ],
  },
  {
    icon: <MdAccountBalance size={20} />,
    name: "Account",
    path: "/account/view",
    subItems: [
      { name: "Create Account", path: "/account/create" },
      { name: "View Account", path: "/account/view" },
    ],
  },
  {
    icon: <SiOrigin size={20} />,
    name: "Account Group",
    path: "/accountGroup/view",
    subItems: [
      { name: "Create AccountGroup", path: "/accountGroup/create" },
      { name: "View AccountGroup", path: "/accountGroup/view" },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, toggleSidebar } =
    useSidebar();
  const location = useLocation();
  const navigate = useNavigate();

  const [currentView, setCurrentView] = useState<
    "main" | "master" | "transaction" | "reports"
  >("main");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const shouldShowText = isExpanded || isHovered || isMobileOpen;

  const isActive = (path?: string): boolean => {
    if (!path) return false;
    return location.pathname === path;
  };

  const isParentActive = (nav: NavItem): boolean => {
    if (!nav.subItems) return isActive(nav.path);
    return nav.subItems.some((sub) => isActive(sub.path));
  };

  const handleCategoryClick = (category: string) => {
    switch (category) {
      case "View Master":
        setCurrentView("master");
        break;
      case "View Transaction":
        setCurrentView("transaction");
        break;
      case "View Reports":
        setCurrentView("reports");
        break;
      default:
        setCurrentView("main");
    }
  };

  const toggleMenu = (menuName: string) => {
    setOpenMenu((prev) => (prev === menuName ? null : menuName));
  };

  const handleNavigate = (path: string | undefined) => {
    if (path) {
      navigate(path as To);
    }
  };

  console.log({
    setIsHovered,
    toggleMenu,
  });

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 left-0 bg-[#5399f5] text-white dark:bg-gray-800 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 dark:border-gray-700
      ${isExpanded || isMobileOpen ? "w-64" : isHovered ? "w-64" : "w-20"}
      ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0`}
    // onMouseEnter={() => !isExpanded && setIsHovered(true)}
    // onMouseLeave={() => setIsHovered(false)}
    >
      {/* Profile */}
      <div
        className={`py-4 px-4 border-b border-gray-200 dark:border-gray-700 flex items-center ${!shouldShowText ? "justify-center" : "justify-start"
          }`}
      >
        {shouldShowText && (
          <div className="ml-3">
            <UserDropdown />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col overflow-hidden ">
        <nav className="flex-1 px-2 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          <ul className="space-y-1">
            {currentView === "main" ? (
              <>
                {mainCategories.map((category) => (
                  <li key={category.name}>
                    <div
                      onClick={() => handleCategoryClick(category.name)}
                      className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer
                      ${isActive(category.path)
                          ? "bg-white text-black"
                          : "text-white hover:border-2 hover:border-white"
                        }
                      ${!shouldShowText ? "justify-center" : "justify-start"}`}
                    >
                      <span className="text-white">{category.icon}</span>
                      {shouldShowText && (
                        <span className="ml-3">{category.name}</span>
                      )}
                    </div>
                  </li>
                ))}
              </>
            ) : (
              <div className=" h-[80vh] space-y-1">
                {/* Back button */}
                <li>
                  <div
                    onClick={() => setCurrentView("main")}
                    className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer text-white hover:border-2 hover:border-blue-500
                    ${!shouldShowText ? "justify-center" : "justify-start"}`}
                  >
                    <MdArrowBack size={20} />
                    {shouldShowText && (
                      <span className="ml-3">Back to Main Menu</span>
                    )}
                  </div>
                </li>

                {/* Master items */}
                {currentView === "master" && (
                  <>
                    {masterItems.map((item) => {
                      const isOpen = openMenu === item.name;
                      const hasSub = !!item.subItems;
                      const createSub = item.subItems?.find(
                        (sub) =>
                          sub.name.toLowerCase().includes("create") ||
                          sub.name.toLowerCase().includes("add")
                      );

                      return (
                        <li key={item.name}>
                          <div
                            onClick={() => {
                              handleNavigate(item.path);
                            }}
                            className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer
                            ${isParentActive(item)
                                ? "bg-white text-black"
                                : "text-white hover:border-2 hover:border-white"
                              }
                            ${!shouldShowText
                                ? "justify-center"
                                : "justify-between"
                              }`}
                          >
                            <div className="flex items-center">
                              <span
                                className={`text-${isParentActive(item) ? "black" : "white"
                                  }`}
                              >
                                {item.icon}
                              </span>
                              {shouldShowText && (
                                <span className="ml-3">{item.name}</span>
                              )}
                            </div>
                            {shouldShowText &&
                              hasSub &&
                              createSub &&
                              createSub.path && (
                                <AiFillPlusCircle
                                  className={`transform transition-transform duration-200 ${isOpen ? "rotate-90" : ""
                                    } ${isParentActive(item)
                                      ? "text-black"
                                      : "text-white"
                                    } cursor-pointer`}
                                  size={16}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleNavigate(createSub.path);
                                  }}
                                  title={createSub.name}
                                />
                              )}
                          </div>

                          {/* Sub-items */}
                          {isOpen && hasSub && shouldShowText && (
                            <ul className="ml-8 mt-1 space-y-1">
                              {item.subItems?.map((subItem) => (
                                <li key={subItem.name}>
                                  <div
                                    onClick={() => handleNavigate(subItem.path)}
                                    className={`flex items-center px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer
                                    ${isActive(subItem.path)
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-300 hover:border-2 hover:border-blue-500"
                                      }`}
                                  >
                                    {subItem.name}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </>
                )}

                {/* Transaction items (dummy) */}
                {currentView === "transaction" && (
                  <>
                    <li>
                      <div
                        onClick={() => handleNavigate("/diesel-requisition/view")}
                        className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer
      ${isActive("/diesel-requisition/view")
                            ? "bg-white text-black"
                            : "text-white hover:border-2 hover:border-blue-500"}
      ${!shouldShowText ? "justify-center" : "justify-start"}`}
                      >
                        {shouldShowText && (
                          <span className="ml-3">View Diesel Requisition</span>
                        )}
                      </div>
                    </li>
                    <li>
                      <div
                        onClick={() => handleNavigate("/diesel-receipt/view")}
                        className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer
      ${isActive("/diesel-receipt/view")
                            ? "bg-white text-black"
                            : "text-white hover:border-2 hover:border-blue-500"}
      ${!shouldShowText ? "justify-center" : "justify-start"}`}
                      >
                        {shouldShowText && (
                          <span className="ml-3">View Diesel Receipt</span>
                        )}
                      </div>
                    </li>
                    <li>
                      <div
                        onClick={() => handleNavigate("/consumption-sheet/view")}
                        className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer
      ${isActive("/consumption-sheet/view")
                            ? "bg-white text-black"
                            : "text-white hover:border-2 hover:border-blue-500"}
      ${!shouldShowText ? "justify-center" : "justify-start"}`}
                      >
                        {shouldShowText && (
                          <span className="ml-3">View Consumption Sheet</span>
                        )}
                      </div>
                    </li>
                    <li>
                      <div
                        onClick={() => handleNavigate("/maintenance-log/view")}
                        className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer
      ${isActive("/maintenance-log/view")
                            ? "bg-white text-black"
                            : "text-white hover:border-2 hover:border-blue-500"}
      ${!shouldShowText ? "justify-center" : "justify-start"}`}
                      >
                        {shouldShowText && (
                          <span className="ml-3">View Maintenance Log</span>
                        )}
                      </div>
                    </li>
                    <li>
                      <div
                        onClick={() => handleNavigate("/material-transactions/view")}
                        className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer
      ${isActive("/material-transactions/view")
                            ? "bg-white text-black"
                            : "text-white hover:border-2 hover:border-blue-500"}
      ${!shouldShowText ? "justify-center" : "justify-start"}`}
                      >
                        {shouldShowText && (
                          <span className="ml-3">View Material Transactions</span>
                        )}
                      </div>
                    </li>
                    <li>
                      <div
                        onClick={() => handleNavigate("/equipment-transactions/view")}
                        className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer
      ${isActive("/equipment-transactions/view")
                            ? "bg-white text-black"
                            : "text-white hover:border-2 hover:border-blue-500"}
      ${!shouldShowText ? "justify-center" : "justify-start"}`}
                      >
                        {shouldShowText && (
                          <span className="ml-3">View Equipment Transactions</span>
                        )}
                      </div>
                    </li>
                    <li>
                      <div
                        onClick={() => handleNavigate("/dpr/view")}
                        className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer
      ${isActive("/dpr/view")
                            ? "bg-white text-black"
                            : "text-white hover:border-2 hover:border-blue-500"}
      ${!shouldShowText ? "justify-center" : "justify-start"}`}
                      >
                        {shouldShowText && (
                          <span className="ml-3">View Daily Progress Report</span>
                        )}
                      </div>
                    </li>
                    <li>
                      <div
                        onClick={() => handleNavigate("/material-bill-transactions/view")}
                        className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer
      ${isActive("/material-bill-transactions/view")
                            ? "bg-white text-black"
                            : "text-white hover:border-2 hover:border-blue-500"}
      ${!shouldShowText ? "justify-center" : "justify-start"}`}
                      >
                        {shouldShowText && (
                          <span className="ml-3">View Material Bill Transactions</span>
                        )}
                      </div>
                    </li>
                    <li>
                      <div
                        onClick={() => handleNavigate("/expenses/view")}
                        className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer
      ${isActive("/expenses/view")
                            ? "bg-white text-black"
                            : "text-white hover:border-2 hover:border-blue-500"}
      ${!shouldShowText ? "justify-center" : "justify-start"}`}
                      >
                        {shouldShowText && (
                          <span className="ml-3">View All Expenses</span>
                        )}
                      </div>
                    </li>
                    <li>
                      <div
                        onClick={() => handleNavigate("/revenueInvoice/view")}
                        className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer
      ${isActive("/revenueInvoice/view")
                            ? "bg-white text-black"
                            : "text-white hover:border-2 hover:border-blue-500"}
      ${!shouldShowText ? "justify-center" : "justify-start"}`}
                      >
                        {shouldShowText && (
                          <span className="ml-3">View All Revenue Invoice</span>
                        )}
                      </div>
                    </li>
                    <li>
                      <div
                        onClick={() => handleNavigate("/diesel-invoice/view")}
                        className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer
      ${isActive("/diesel-invoice/view")
                            ? "bg-white text-black"
                            : "text-white hover:border-2 hover:border-blue-500"}
      ${!shouldShowText ? "justify-center" : "justify-start"}`}
                      >
                        {shouldShowText && (
                          <span className="ml-3">View All Diesel Invoice</span>
                        )}
                      </div>
                    </li>
                  </>
                )}

                {/* Reports items (dummy) */}
                {currentView === "reports" && (
                  <>
                    <li>
                      <div
                        onClick={() => handleNavigate("/reports/daily-progress")}
                        className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer
          ${isActive("/reports/daily-progress")
                            ? "bg-white text-black"
                            : "text-white hover:border-2 hover:border-blue-500"}
          ${!shouldShowText ? "justify-center" : "justify-start"}`}
                      >
                        {shouldShowText && (
                          <span className="ml-3">Daily Progress Report</span>
                        )}
                      </div>
                    </li>
                    <li>
                      <div
                        onClick={() => handleNavigate("/reports/daily-diesel-consumption")}
                        className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer
          ${isActive("/reports/daily-diesel-consumption")
                            ? "bg-white text-black"
                            : "text-white hover:border-2 hover:border-blue-500"}
          ${!shouldShowText ? "justify-center" : "justify-start"}`}
                      >
                        {shouldShowText && (
                          <span className="ml-3">Daily Diesel Consumption</span>
                        )}
                      </div>
                    </li>
                    <li>
                      <div
                        onClick={() => handleNavigate("/reports/material-consumption")}
                        className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer
          ${isActive("/reports/material-consumption")
                            ? "bg-white text-black"
                            : "text-white hover:border-2 hover:border-blue-500"}
          ${!shouldShowText ? "justify-center" : "justify-start"}`}
                      >
                        {shouldShowText && (
                          <span className="ml-3">Material Consumption Report</span>
                        )}
                      </div>
                    </li>
                    <li>
                      <div
                        onClick={() => handleNavigate("/reports/revenue")}
                        className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer
          ${isActive("/reports/revenue")
                            ? "bg-white text-black"
                            : "text-white hover:border-2 hover:border-blue-500"}
          ${!shouldShowText ? "justify-center" : "justify-start"}`}
                      >
                        {shouldShowText && (
                          <span className="ml-3">Revenue Report</span>
                        )}
                      </div>
                    </li>
                    <li>
                      <div
                        onClick={() => handleNavigate("/reports/equipment")}
                        className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer
          ${isActive("/reports/equipment")
                            ? "bg-white text-black"
                            : "text-white hover:border-2 hover:border-blue-500"}
          ${!shouldShowText ? "justify-center" : "justify-start"}`}
                      >
                        {shouldShowText && (
                          <span className="ml-3">Equipment Report</span>
                        )}
                      </div>
                    </li>
                    <li>
                      <div
                        onClick={() => handleNavigate("/reports/inventory")}
                        className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer
          ${isActive("/reports/inventory")
                            ? "bg-white text-black"
                            : "text-white hover:border-2 hover:border-blue-500"}
          ${!shouldShowText ? "justify-center" : "justify-start"}`}
                      >
                        {shouldShowText && (
                          <span className="ml-3">Inventory Report</span>
                        )}
                      </div>
                    </li>
                    <li>
                      <div
                        onClick={() => handleNavigate("/reports/purchase")}
                        className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer
          ${isActive("/reports/purchase")
                            ? "bg-white text-black"
                            : "text-white hover:border-2 hover:border-blue-500"}
          ${!shouldShowText ? "justify-center" : "justify-start"}`}
                      >
                        {shouldShowText && (
                          <span className="ml-3">Purchase Report</span>
                        )}
                      </div>
                    </li>
                    <li>
                      <div
                        onClick={() => handleNavigate("/reports/sales")}
                        className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer
          ${isActive("/reports/sales")
                            ? "bg-white text-black"
                            : "text-white hover:border-2 hover:border-blue-500"}
          ${!shouldShowText ? "justify-center" : "justify-start"}`}
                      >
                        {shouldShowText && (
                          <span className="ml-3">Sales Report / Revenue</span>
                        )}
                      </div>
                    </li>
                    <li>
                      <div
                        onClick={() => handleNavigate("/reports/expense")}
                        className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer
          ${isActive("/reports/expense")
                            ? "bg-white text-black"
                            : "text-white hover:border-2 hover:border-blue-500"}
          ${!shouldShowText ? "justify-center" : "justify-start"}`}
                      >
                        {shouldShowText && (
                          <span className="ml-3">Expense Report</span>
                        )}
                      </div>
                    </li>
                    <li>
                      <div
                        onClick={() => handleNavigate("/reports/profitability")}
                        className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer
          ${isActive("/reports/profitability")
                            ? "bg-white text-black"
                            : "text-white hover:border-2 hover:border-blue-500"}
          ${!shouldShowText ? "justify-center" : "justify-start"}`}
                      >
                        {shouldShowText && (
                          <span className="ml-3">Profitability Report</span>
                        )}
                      </div>
                    </li>
                    <li>
                      <div
                        onClick={() => handleNavigate("/dashboard")}
                        className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer
          ${isActive("/dashboard")
                            ? "bg-white text-black"
                            : "text-white hover:border-2 hover:border-blue-500"}
          ${!shouldShowText ? "justify-center" : "justify-start"}`}
                      >
                        {shouldShowText && (
                          <span className="ml-3">Dashboard</span>
                        )}
                      </div>
                    </li>
                  </>
                )}
              </div>
            )}
          </ul>
        </nav>

        {/* Bottom */}
        <hr className="border-gray-100 dark:border-gray-700" />
        <button
          onClick={() => {
            toggleSidebar();
          }}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:border-2 hover:border-blue-500 dark:hover:bg-gray-700 transition"
          title={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          <svg
            className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""
              }`}
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              d="M7.5 15l5-5-5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
