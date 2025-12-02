import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return document.cookie.split("; ").map((cookie) => {
            const [name, ...rest] = cookie.split("=");
            return { name, value: rest.join("=") };
          });
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            document.cookie = `${name}=${value}; path=/; ${
              options?.maxAge ? `max-age=${options.maxAge};` : ""
            } ${options?.domain ? `domain=${options.domain};` : ""} ${
              options?.sameSite ? `samesite=${options.sameSite};` : ""
            } ${options?.secure ? "secure;" : ""}`;
          });
        },
      },
    }
  );
}

// Types for database
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
