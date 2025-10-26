import React from "react";
import { FaDownload } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const DownloadTemplateButtonRevenue: React.FC = () => {
  const handleDownload = () => {
    const worksheetData = [
      ["revenueCode", "description", "revenueValue"],
      ["REV-001", "Monthly Subscription", "1000"],
      ["REV-002", "Consulting Fees", "2500"],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "RevenueTemplate");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(blob, "RevenueTemplate.xlsx");
  };

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
    >
      <FaDownload className="mr-2" />
      Download Excel Template
    </button>
  );
};

export default DownloadTemplateButtonRevenue;
