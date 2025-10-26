import { FaDownload } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function DownloadTemplateButtonForOrganisations() {
  const handleDownload = () => {
    // Correct headers and example row based on backend expectations
    const worksheetData = [
      ["org_name", "org_code", ],
      [
        "Acme Corp",
        "ACME001",
      ],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "OrganisationTemplate");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(data, "OrganisationTemplate.xlsx");
  };

  return (
    <button
      className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
      onClick={handleDownload}
    >
      <FaDownload className="mr-2" />
      Download Organisation Upload Template
    </button>
  );
}
