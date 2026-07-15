// Thin re-exports so page.tsx stays tidy
export {
  getContentPage,
  getFaqs,
  interpolateCmsText,
} from "@/lib/cms";
export { getStoreSettings as getStoreSettingsCompat } from "@/lib/site-settings";
