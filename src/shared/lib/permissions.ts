import type { UserInformation } from '@/shared/types';

type PermissionItem = { code: string; name: string; description: string };

export const getPermissions = (user: UserInformation | null | undefined): PermissionItem[] | undefined =>
  user?.userInfo?.profile?.permissions;

export const hasFeature = (
  featuresOrUser: PermissionItem[] | UserInformation | null | undefined,
  requiredFeatureCode: string,
) => {
  // Resolve permissions from either a user object or direct permissions array
  let features: PermissionItem[] | undefined;
  if (Array.isArray(featuresOrUser)) {
    features = featuresOrUser;
  } else if (featuresOrUser && typeof featuresOrUser === 'object' && 'userInfo' in featuresOrUser) {
    features = (featuresOrUser as UserInformation)?.userInfo?.profile?.permissions;
  } else {
    features = undefined;
  }

  if (!features) return false;

  if (features.some((feature) => feature.code === '9999')) {
    return true;
  }

  return features.some((feature) => feature.code === requiredFeatureCode);
};
