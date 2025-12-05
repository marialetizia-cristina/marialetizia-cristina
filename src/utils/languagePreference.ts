export type LanguagePreference = {
  categoryId: number;
  prefixes: string[];
};

// WARNING: The category IDs below follow the current WordPress setup where 36 = English and 37 = Italian.
// Adjust them if the taxonomy configuration changes in the future.

const LANGUAGE_PREFERENCES: LanguagePreference[] = [
  { categoryId: 37, prefixes: ["en", "en-us", "en-gb"] },
  { categoryId: 36, prefixes: ["it", "it-it"] },
];

export const getLanguagePreference = (languageCode?: string): LanguagePreference => {
  const normalized = languageCode?.toLowerCase() ?? "";
  const match = LANGUAGE_PREFERENCES.find(pref =>
    pref.prefixes.some(prefix => normalized.startsWith(prefix))
  );

  return match ?? LANGUAGE_PREFERENCES[1];
};

export const getLanguageCategoryId = (languageCode?: string): number => {
  return getLanguagePreference(languageCode).categoryId;
};
