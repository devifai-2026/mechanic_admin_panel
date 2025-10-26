export interface MaintenanceLog {
  last_service: string;
  next_due: string;
  notes: string;
}

export interface OtherLog {
  inspections: string[];
}

export interface ProjectTag {
  project_no: string;
  site: string;
}

export interface EquipmentPayload {
  equipment_name: string;
  equipment_sr_no: string;
  additional_id: string;
  purchase_date: string;
  oem: string;
  purchase_cost: number;
  equipment_manual: string;
  maintenance_log: MaintenanceLog;
  other_log: OtherLog;
  project_tag: ProjectTag;
  equipment_group_id: string;
  hsn_number: number;
}

export interface EquipmentResponse extends EquipmentPayload {
  id: string;
  createdAt: string;
  updatedAt: string;
}
