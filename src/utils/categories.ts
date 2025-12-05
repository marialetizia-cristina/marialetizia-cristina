export const CASE_STUDY_CATEGORY_IDS = new Set<number>([15, 64]);

export const isCaseStudyCategory = (categories?: number[] | null): boolean => {
  if (!categories || categories.length === 0) {
    return false;
  }

  return categories.some(id => CASE_STUDY_CATEGORY_IDS.has(id));
};
