import { FaDownload } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function DownloadTemplateButtonForEquipment() {
    const handleDownload = () => {
        const worksheetData = [
            [
                "equipment_name",
                "equipment_sr_no",
                "additional_id",
                "purchase_date",
                "oem",
                "purchase_cost",
                "equipment_manual",
                "maintenance_log",
                "other_log",
                "project_tag",
                "equipment_group",
            ],
            [
                "Excavator",
                "EXC123456",
                "N/A",
                "2024-01-15",
                "Caterpillar",
                "150000",
                "manual_link.pdf",
                "log_link.pdf",
                "other_log_link.pdf",
                "ProjectX",
                "Power Backup Systems 2",
            ],
        ];

        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "EquipmentTemplate");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        const data = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        });

        saveAs(data, "EquipmentTemplate.xlsx");
    };

    return (
        <button
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            onClick={handleDownload}
        >
            <FaDownload className="mr-2" />
            Download Equipment Upload Template
        </button>
    );
}
