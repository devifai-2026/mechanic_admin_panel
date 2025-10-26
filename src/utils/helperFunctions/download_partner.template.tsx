import { FaDownload } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function DownloadPartnerTemplateButton() {
  const handleDownload = () => {
    const worksheetData = [
      [
        "partner_name",
        "partner_gst",
        "partner_geo_id",
        "partner_address",
        "state",
        "city",
        "pincode",
        "isCustomer ",
      ],
      [
        "SoftSkirl Pvt Ltd",
        "29ABCDE1234F2Z5",
        "123456",
        "123, Tech Park Road, Bangalore",
        "Karnataka",
        "Bengaluru",
        "560103",
        "true",
      ],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "PartnerTemplate");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(data, "PartnerTemplate.xlsx");
  };

  return (
    <button
      className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
      onClick={handleDownload}
    >
      <FaDownload className="mr-2" />
      Download Partner Excel Template
    </button>
  );
}
