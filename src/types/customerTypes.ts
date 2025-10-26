export type Customer = {
  state: string;
  city: string;
  pincode: string;
  id: string;
  partner_name: string;
  partner_address: string;
  partner_gst: string;
  partner_geo_id: string;
  isCustomer: boolean;
  createdAt: string;
  updatedAt: string;
};

export interface CustomerPayload {
  partner_name: string;
  partner_address: string;
  partner_gst: string;
  partner_geo_id: number;
  isCustomer: boolean;
}
