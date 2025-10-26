export interface EquipmentGroupPayload {
  equip_grp_code: string;
  equipment_group: string;
}

export interface EquipmentGroupResponse extends EquipmentGroupPayload {
  id: string;
  createdAt: string;
  updatedAt: string;
}


export type EquipmentGroupOption = {
  value: string;
  label: string;
};