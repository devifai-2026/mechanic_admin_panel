import { FaDownload } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function DownloadTemplateButtonForAccount() {
    const handleDownload = () => {
        const worksheetData = [
            ["account_code", "account_name", "account_group"], // headers
            ["ACT-001", "Sales Account", "Assets"],           // example row
            ["ACT-002", "Purchase Account", "Assets"],       // another example
        ];

        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "AccountTemplate");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        const data = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        });

        saveAs(data, "AccountTemplate.xlsx");
    };

    return (
        <button
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            onClick={handleDownload}
        >
            <FaDownload className="mr-2" />
            Download Account Upload Template
        </button>
    );
}
