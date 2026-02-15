export const locales = ["he", "en"] as const;
export const defaultLocale = "he";
export type Locale = (typeof locales)[number];
