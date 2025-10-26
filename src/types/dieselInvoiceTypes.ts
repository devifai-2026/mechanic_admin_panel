export interface DieselInvoice {
  id: string;
  project_id: string;
  dieselReceiptId: string;
  is_invoiced: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  formItems: {
    id: string;
    diesel_invoice_id: string;
    item: string;
    qty: number;
    uom: string;
    unit_rate: number;
    total_value: number;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    consumableItem: {
      id: string;
      item_name: string;
      item_code: string;
    };
    unitOfMeasure: {
      id: string;
      unit_name: string;
      unit_code: string;
    };
  }[];
  project: {
    id: string;
    project_no: string;
  };
}
