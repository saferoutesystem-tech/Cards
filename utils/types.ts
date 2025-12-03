// utils/types.ts
export interface LocationItem {
  id: string;
  name: string;
  place: string;
  google_map_location: string | null;
  phone_number: string | null;
  category: string[]; // Array of categories
  priority_level: number;
  image_url: string | null;
  description: string | null;
}

export interface Project {
  id: string;
  name: string;
  place: string;
  google_map_location: string | null;
  phone_number: string | null;
  category: string[];
  priority_level: number;
  image_url: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}
