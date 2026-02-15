export const locales = ["en", "he"] as const;
export const defaultLocale = "en";
export type Locale = (typeof locales)[number];
