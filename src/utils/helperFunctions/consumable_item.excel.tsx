import { FaDownload } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function DownloadTemplateButtonForConsumableItems() {
  const handleDownload = () => {
    const worksheetData = [
      [
        "item_code",
        "item_name",
        "item_description",
        "product_type", // "Goods" or "Services"
        "item_group_name",
        "item_make_name",
        "unit_of_measurement_name",
        "item_qty_in_hand",
        "item_avg_cost",
        "hsn_number",
        "inventory_account_code_name",
        "expense_account_code_name",
        "revenue_account_code_name",
      ],
      [
        "test2",
        "Subhojit Dutta",
        "test",
        "Goods",
        "sdsad",          // From item_group_id
        "sadsadsa",           // From item_make
        "23123",                // From unit_of_measurement
        12,
        0,
        "12345678",
        "sadsad",   // From inventory_account_code
        "sadsad",     // From expense_account_code
        "REV-003",     // From revenue_account_code
      ],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ConsumableItemsTemplate");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(data, "ConsumableItemsTemplate.xlsx");
  };

  return (
    <button
      className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
      onClick={handleDownload}
    >
      <FaDownload className="mr-2" />
      Download Consumable Items Upload Template
    </button>
  );
}
