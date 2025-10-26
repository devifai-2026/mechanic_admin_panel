import { FaDownload } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function DownloadTemplateButtonForItemGroup() {
  const handleDownload = () => {
    const worksheetData = [
      ["group_name", "group_code"], // Correct headers for item groups
      ["Electrical Parts", "ELEC001"], // Sample data
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ItemGroupTemplate");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(data, "ItemGroupTemplate.xlsx");
  };

  return (
    <button
      className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
      onClick={handleDownload}
    >
      <FaDownload className="mr-2" />
      Download Item Group Upload Template
    </button>
  );
}
