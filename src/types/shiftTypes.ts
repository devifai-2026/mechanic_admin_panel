export interface Shift {
  id: string;
  shift_code: string;
  shift_from_time: string; // Format: "HH:mm:ss"
  shift_to_time: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShiftPayload {
  shift_code: string;
  shift_from_time: string;
  shift_to_time: string;
}
