import { FaDownload } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function DownloadTemplateButton() {
  const handleDownload = () => {
    const worksheetData = [
      [
        "projectNo",
        "customer",
        "orderNo",
        "contractStartDate",
        "contractEndDate",
        "revenueMaster", // user can enter comma-separated IDs here
        "equipments",
      
        "storeLocations",
      ],
      [
        "PRJ-001",
        "SoftSkirl",
        "234",
        "2025-04-30",
        "2025-05-30",
        "REV-002, REV-001", 
        "hydraulic",
        "ST001",
      ],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ProjectTemplate");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(data, "ProjectTemplate.xlsx");
  };

  return (
    <button
      className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
      onClick={handleDownload}
    >
      <FaDownload className="mr-2" />
      Download Excel Template
    </button>
  );
}
