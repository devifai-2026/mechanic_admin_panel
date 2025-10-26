import * as XLSX from "xlsx";

export const handleExportEmployees = (employees: any[]) => {
  const worksheet = XLSX.utils.json_to_sheet(employees);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
  XLSX.writeFile(workbook, "employees.xlsx");
};
