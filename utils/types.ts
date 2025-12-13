// utils/types.ts
export interface LocationItem {
  id: string;
  name: string;
  place: string;
  city?: string; // New dedicated city field
  google_map_location: string | null;
  phone_number: string | null;
  category: string[]; // Array of categories
  priority_level: number;
  image_url: string | null;
  description: string | null;
  discount_amount?: number; // Discount percentage (0-100)
}

export interface Project {
  id: string;
  name: string;
  place: string;
  city?: string; // New dedicated city field
  google_map_location: string | null;
  phone_number: string | null;
  category: string[];
  priority_level: number;
  image_url: string | null;
  description: string | null;
  discount_amount?: number;
  created_at: string;
  updated_at: string;
}
