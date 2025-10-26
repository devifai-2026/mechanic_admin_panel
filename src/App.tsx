import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ComponentChildren } from "preact";

import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import { Projects } from "./pages/Projects/Projects";
import { Employees } from "./pages/Employees/Employees";
import { Partners } from "./pages/Partners/Partners";
import { Equipments } from "./pages/Equipments/Equipments";
import { Revenue } from "./pages/Revenue/Revenue";
import { StoreLocation } from "./pages/StoreLocation/StoreLocation";
import { Consumable } from "./pages/Consumables/Consumable";
import { Shifts } from "./pages/Shifts/Shifts";
import { Roles } from "./pages/Roles/Roles";
import { CreateProjectPage } from "./pages/Projects/CreateProject";
import { CreateEmployeePage } from "./pages/Employees/CreateEmployeePage";
import PartnerFormPage from "./pages/Partners/PartnerFormPage";
import EquipmentFormPage from "./pages/Equipments/EquipmentFormPage";
import RevenueFormPage from "./pages/Revenue/RevenueFormPage";
import StoreFormPage from "./pages/StoreLocation/StoreFormPage";
import ShiftFormPage from "./pages/Shifts/ShiftFormPage";
import RoleFormPage from "./pages/Roles/RoleFormPage";
import ConsumableFormPage from "./pages/Consumables/ConsumableFormPage";
import { Organisations } from "./pages/Organisation/Organisations";
import OrganisationFormPage from "./pages/Organisation/OrganisationFormPage";
import UomFormPage from "./pages/UOM/UomFormPage";
import { Uom } from "./pages/UOM/Uom";
import { ItemGroupPage } from "./pages/ItemGroup/ItemGroupPage";
import ItemGroupFormPage from "./pages/ItemGroup/ItemGroupFormPage";
import { OemPage } from "./pages/OEM/OemPage";
import OemFormPage from "./pages/OEM/OemFormPage";
import { AccountGroupPage } from "./pages/AccountGroup/AccountGroupPage";
import AccountGroupFormPage from "./pages/AccountGroup/AccountGroupFormPage";
import { AccountPage } from "./pages/Account/AccountPage";
import AccountFormPage from "./pages/Account/AccountFormPage";
import ProjectDetailPage from "./pages/Projects/ProjectDetailPage";
import { DieselRequisition } from "./pages/Transactions/Diesel_Requisitions/DieselRequisition";
import DieselRequisitionDetailsPage from "./pages/Transactions/Diesel_Requisitions/DieselRequisitionDetailsPage";
import AddEmployeeProject from "./pages/AddEmployee_Project/AddEmployeeProject";
import { EquipmentGroup } from "./pages/EquipmentGroup/EquipmentGroup";
import EquipmentGroupCreate from "./pages/EquipmentGroup/EquipmentGroupCreate";
import EquipmentGroupFormPage from "./pages/EquipmentGroup/EquipmentGroupFormPage";
import { EditEmployees } from "./pages/Projects/EditEmployees";
import { DieselReceipt } from "./pages/Transactions/Diesel_Receipt/DieselReceipt";
import DieselReceiptDetailsPage from "./pages/Transactions/Diesel_Receipt/DieselReceiptDetailsPage";
import { ConsumptionSheet } from "./pages/Transactions/Consumption_Sheet/ConsumptionSheet";
import ConsumptionSheetDetailpage from "./pages/Transactions/Consumption_Sheet/ConsumptionSheetDetailsPage";
import { MaintenanceLog } from "./pages/Transactions/Maintenance_Log/MaintenanceLog";
import MaintenanceLogDetailsPage from "./pages/Transactions/Maintenance_Log/MaintenanceLogDetails";
import { DailyProgressReport } from "./pages/Transactions/DPR/DailyProgressReport";
import DailyProgressReportDetails from "./pages/Transactions/DPR/DailyProgressReportDetails";
import { MaterialTransactions } from "./pages/Transactions/View_Material_In/MaterialTransacttions";
import MaterialTransactionPageDetails from "./pages/Transactions/View_Material_In/MaterialTransactionPageDetails";
import LogoutButton from "./layout/LogoutButton";
import { MaterialBillTransaction } from "./pages/Transactions/MaterialBill/MaterialBillTransaction";
import MaterialBillTransactionDetails from "./pages/Transactions/MaterialBill/MaterialBillTransactionDetails";
import { AllExpenses } from "./pages/Transactions/Expenses/AllExpenses";
import ExpenseDetails from "./pages/Transactions/Expenses/ExpenseDetails";
import { RevenueInvoice } from "./pages/Transactions/Revenue/RevenueInvoice";
import RevenueInvoiceDetails from "./pages/Transactions/Revenue/RevenueInvoiceDetails";
import { EquipmentTransactions } from "./pages/Transactions/EquipmentTransactions/EquipmentTransactions";
import EquipmentTransactionsDetails from "./pages/Transactions/EquipmentTransactions/EquipmentTransactionsDetails";
import { DieselInvoice } from "./pages/Transactions/DieselInvoice/DieselInvoice";
import DieselInvoiceDetails from "./pages/Transactions/DieselInvoice/DieselInvoiceDetails";

function ProtectedRoute({ children }: { children: ComponentChildren }) {
  const user = localStorage.getItem("token");
  return user ? <>{children}</> : <Navigate to="/signin" replace />;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Protected Routes wrapped inside ProtectedRoute */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index path="/" element={<Home />} />
          <Route index path="/dashboard" element={<Home />} />
          {/* Other Pages */}
          <Route path="/profile" element={<UserProfiles />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/blank" element={<Blank />} />
          <Route path="/projects/view" element={<Projects />} />
          <Route path="/projects/create" element={<CreateProjectPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/projects/edit/:id" element={<CreateProjectPage />} />
          <Route
            path="/projects/add/employees/:id"
            element={<AddEmployeeProject />}
          />
          <Route
            path="/projects/edit/employees/:id"
            element={<EditEmployees />}
          />
          <Route path="/employees/view" element={<Employees />} />
          <Route path="/employees/create" element={<CreateEmployeePage />} />
          <Route path="/employees/edit/:id" element={<CreateEmployeePage />} />
          <Route path="/partners/create" element={<PartnerFormPage />} />
          <Route path="/partners/edit/:id" element={<PartnerFormPage />} />
          <Route path="/partners/view" element={<Partners />} />
          <Route path="/equipments/view" element={<Equipments />} />
          // For create
          <Route path="/equipments/create" element={<EquipmentFormPage />} />
          // For edit
          <Route path="/equipments/edit/:id" element={<EquipmentFormPage />} />
          <Route path="/revenues/view" element={<Revenue />} />
          <Route path="/revenues/create" element={<RevenueFormPage />} />
          <Route path="/revenues/edit/:id" element={<RevenueFormPage />} />
          <Route path="/store-locations/view" element={<StoreLocation />} />
          <Route path="/store-locations/create" element={<StoreFormPage />} />
          <Route path="/store-locations/edit/:id" element={<StoreFormPage />} />
          <Route path="/consumables/view" element={<Consumable />} />
          <Route path="/consumable/create" element={<ConsumableFormPage />} />
          <Route path="/consumable/edit/:id" element={<ConsumableFormPage />} />
          <Route path="/shifts/view" element={<Shifts />} />
          <Route path="/shifts/create" element={<ShiftFormPage />} />
          <Route path="/shifts/edit/:id" element={<ShiftFormPage />} />
          <Route path="/roles/view" element={<Roles />} />
          <Route path="/roles/create" element={<RoleFormPage />} />
          <Route path="/roles/edit/:id" element={<RoleFormPage />} />
          <Route path="/organisations/view" element={<Organisations />} />
          <Route
            path="/organisations/create"
            element={<OrganisationFormPage />}
          />
          <Route
            path="/organisation/edit/:id"
            element={<OrganisationFormPage />}
          />
          <Route path="/uom/create" element={<UomFormPage />} />
          <Route path="/uom/edit/:id" element={<UomFormPage />} />
          <Route path="/uom/view" element={<Uom />} />
          <Route path="/equipmentgroup/view" element={<EquipmentGroup />} />
          <Route
            path="/equipmentgroup/create"
            element={<EquipmentGroupCreate />}
          />
          <Route
            path="/equipment-group/edit/:id"
            element={<EquipmentGroupFormPage />}
          />
          <Route path="/itemGroup/create" element={<ItemGroupFormPage />} />
          <Route path="/itemGroup/edit/:id" element={<ItemGroupFormPage />} />
          <Route path="/itemGroup/view" element={<ItemGroupPage />} />
          <Route path="/oem/create" element={<OemFormPage />} />
          <Route path="/oem/edit/:id" element={<OemFormPage />} />
          <Route path="/oem/view" element={<OemPage />} />
          <Route
            path="/diesel-requisition/view"
            element={<DieselRequisition />}
          />
          <Route path="/diesel-receipt/view" element={<DieselReceipt />} />
          <Route
            path="/diesel-requisition/:id"
            element={<DieselRequisitionDetailsPage />}
          />
          <Route
            path="/diesel-receipt/:id"
            element={<DieselReceiptDetailsPage />}
          />
          <Route
            path="/consumption-sheet/view"
            element={<ConsumptionSheet />}
          />
          <Route path="/maintenance-log/view" element={<MaintenanceLog />} />3
          <Route
            path="/maintenance-log/:id"
            element={<MaintenanceLogDetailsPage />}
          />
          <Route path="/equipment-transactions/view" element={<EquipmentTransactions />} />
          <Route path="/equipment-transactions/:id" element={<EquipmentTransactionsDetails />} />
          <Route path="/diesel-invoice/view" element={<DieselInvoice />} />
          <Route path="/diesel-invoice/:id" element={<DieselInvoiceDetails />} />
          <Route
            path="/maintenance-log/:id"
            element={<MaintenanceLogDetailsPage />}
          />
          <Route path="/dpr/view" element={<DailyProgressReport />} />
          <Route
            path="/material-transactions/view"
            element={<MaterialTransactions />}
          />
          <Route
            path="/material-transactions/:id"
            element={<MaterialTransactionPageDetails />}
          />

          <Route
            path="/material-bill-transactions/view"
            element={<MaterialBillTransaction />}
          />
          <Route
            path="/material-bill-transactions/:id"
            element={< MaterialBillTransactionDetails />}
          />

          <Route
            path="/expenses/view"
            element={<AllExpenses />}
          />
          <Route
            path="/expenses/:id"
            element={< ExpenseDetails />}
          />
          <Route
            path="/revenueInvoice/view"
            element={<RevenueInvoice />}
          />
          <Route
            path="/revenueInvoice-detail/:id"
            element={<RevenueInvoiceDetails />}
          />
          <Route path="/dpr/:id" element={<DailyProgressReportDetails />} />
          <Route
            path="/consumption-sheet/:id"
            element={<ConsumptionSheetDetailpage />}
          />
          <Route
            path="/accountGroup/create"
            element={<AccountGroupFormPage />}
          />
          <Route
            path="/accountGroup/edit/:id"
            element={<AccountGroupFormPage />}
          />
          <Route path="/accountGroup/view" element={<AccountGroupPage />} />
          <Route path="/account/create" element={<AccountFormPage />} />
          <Route path="/account/edit/:id" element={<AccountFormPage />} />
          <Route path="/account/view" element={<AccountPage />} />
          {/* Forms */}
          <Route path="/form-elements" element={<FormElements />} />
          {/* Tables */}
          <Route path="/basic-tables" element={<BasicTables />} />
          {/* UI Elements */}
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/avatars" element={<Avatars />} />
          <Route path="/badge" element={<Badges />} />
          <Route path="/buttons" element={<Buttons />} />
          <Route path="/images" element={<Images />} />
          <Route path="/videos" element={<Videos />} />
          {/* Charts */}
          <Route path="/line-chart" element={<LineChart />} />
          <Route path="/bar-chart" element={<BarChart />} />
        </Route>

        {/* Public Routes (Auth) */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/logout" element={<LogoutButton />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
