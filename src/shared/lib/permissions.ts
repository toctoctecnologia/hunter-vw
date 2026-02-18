export const hasFeature = (
  features:
    | {
        code: string;
        name: string;
        description: string;
      }[]
    | undefined,
  requiredFeatureCode: string,
) => {
  if (!features) return false;

  if (features.some((feature) => feature.code === '9999')) {
    return true;
  }

  return features.some((feature) => feature.code === requiredFeatureCode);
};
