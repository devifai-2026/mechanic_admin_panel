// src/types/projectTypes.ts

export type Project = {
  id: string;
  projectNo: string;
  customer: string;
  orderNo: string;
  contractStartDate: string;
  contractTenure: string;
  revenueMaster: string[]; // array of revenue master IDs
  equipments: string[]; // array of equipment IDs
  staff: string[]; // array of staff IDs
  storeLocations: string[]; // array of store location IDs
  createdAt: string;
  updatedAt: string;
};

export interface ProjectPayload {
  projectNo: string;
  customer: string;
  orderNo: string;
  contractStartDate: string;
  contractTenure: string;
  revenueMaster: string[];
  equipments: string[];
  staff: string[];
  storeLocations: string[];
}
