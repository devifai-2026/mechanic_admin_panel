import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
export const handleExport = (original_projects: any) => {
  try {
    // Map and clean projects
    const cleanedData = original_projects.map((project: any) => {
      // Destructure to remove ids from root and customer
      const {
        id,
        customer,
        equipments,
        staff,
        revenues,
        store_locations,
        ...rest
      } = project;

      // Remove id from customer, keep partner_name
      const cleanedCustomer = customer
        ? { partner_name: customer.partner_name }
        : {};

      // Flatten nested arrays into strings excluding ids
      const staffNames = staff?.map((s: any) => s.emp_name).join(", ") || "";
      const equipmentNames =
        equipments?.map((e: any) => e.equipment_name).join(", ") || "";
      const revenueDescriptions =
        revenues
          ?.map((r: any) => r.revenue_description || r.revenue_code)
          .join(", ") || "";
      const storeNames =
        store_locations?.map((s: any) => s.store_name).join(", ") || "";
        const storeCodes =
        store_locations?.map((s: any) => s.store_code).join(", ") || "";

      return {
        ...rest,
        customer: cleanedCustomer.partner_name || "",
        staff: staffNames,
        equipments: equipmentNames,
        revenues: revenueDescriptions,
        store_name:storeNames ,
        store_code: storeCodes,
      };
    });

    // Convert cleaned data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(cleanedData);

    // Create workbook and append sheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Projects");

    // Generate Excel buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Create Blob and trigger download
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(blob, "projects_export.xlsx");
    console.log("Export successful!");
  } catch (error) {
    console.error("Error exporting projects:", error);
  }
};
