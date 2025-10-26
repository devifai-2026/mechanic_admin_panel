import { FaDownload } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function DownloadTemplateButtonForAccountGroup() {
    const handleDownload = () => {
        const worksheetData = [
            ["account_group_code", "account_group_name"],  // headers matching backend
            ["AG-001", "Assets_Extra"],                           // example row
            ["AG-002", "Liabilities"],                      // example row
        ];

        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "AccountGroupTemplate");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        const data = new Blob([excelBuffer], {
            type:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        });

        saveAs(data, "AccountGroupTemplate.xlsx");
    };

    return (
        <button
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            onClick={handleDownload}
        >
            <FaDownload className="mr-2" />
            Download Account Group Upload Template
        </button>
    );
}
