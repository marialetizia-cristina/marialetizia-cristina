export const normalizeLanguage = (value?: string | null): string => {
  if (!value) {
    return "";
  }

  const lower = value.toLowerCase();
  const [primary] = lower.split(/[\-_]/);
  return primary || lower;
};

export const coerceNumericId = (value?: number | string | null): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
};

export const resolveTranslationId = (
  translations: Record<string, number | string | null> | undefined,
  preferredLanguage: string
): number | undefined => {
  if (!translations) {
    return undefined;
  }

  const target = normalizeLanguage(preferredLanguage);

  for (const [languageKey, value] of Object.entries(translations)) {
    const normalizedKey = normalizeLanguage(languageKey);
    if (!normalizedKey || normalizedKey !== target) {
      continue;
    }

    const numericId = coerceNumericId(value);
    if (numericId !== undefined) {
      return numericId;
    }
  }

  return undefined;
};
