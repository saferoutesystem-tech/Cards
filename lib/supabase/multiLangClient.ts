// lib/supabase/multiLangClient.ts
"use client";

import { createBrowserClient } from "@supabase/ssr";
import { Language } from "@/contexts/LanguageContext";

// Table name mapping based on language
const getTableName = (baseTable: string, language: Language): string => {
  const tableMap: Record<string, Record<Language, string>> = {
    projects: {
      en: "projects",
      ar: "projects_ar",
      ku: "projects_ku",
    },
    discount_cards: {
      en: "discount_cards",
      ar: "discount_cards",
      ku: "discount_cards",
    },
  };

  return tableMap[baseTable]?.[language] || baseTable;
};

export function createMultiLangClient(language: Language) {
  const client = createBrowserClient(
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

  // Return a wrapper that automatically uses the correct table
  return {
    from: (table: string) => client.from(getTableName(table, language)),
    auth: client.auth,
    storage: client.storage,
  };
}
