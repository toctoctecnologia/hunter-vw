import { ProfileFormData } from '@/features/dashboard/access-control/components/form/profile-form/schema';
import { LeadFunnelStages, PropertyDetail } from '@/shared/types';

interface SaveProfile extends ProfileFormData {
  id?: number;
}

interface Profile {
  code: string;
  name: string;
  description: string;
}

interface User {
  uuid: number;
  name: string;
  email: string;
  phone: string;
  profileName: string;
  isActive: boolean;
  createdAt: string;
  rouletteSigned: boolean;
  accessedAt: string;
}

interface UserMetrics {
  totalUsers: number;
  lastMonthGrowthUserPercentage: number;
  activeUsers: number;
  lastThirtyDaysActiveUserGrowthPercentage: number;
  newUsers: number;
  monthlyNewUsersGrowthPercentage: number;
  evaluation: number;
  monthlyGrowthEvaluationAverage: number;
}

interface UserDetailsRecentSale extends PropertyDetail {
  saledAt: string; // '2025-11-23'
  commission: number;
}

interface UserDetailsFunnelItem {
  name: LeadFunnelStages;
  value: number;
}

interface UserDetails {
  propertiesSold: number;
  totalValueSold: number;
  propertyValueAverage: number;
  followUpRate: number;
  name: string;
  email: string;
  profileName: string;
  createdAt: string;
  active: boolean;
  recentSales: UserDetailsRecentSale[];
  funnel: UserDetailsFunnelItem[];
  yearlySales: { month: string; salesCount: number }[];
}

export type { SaveProfile, Profile, User, UserMetrics, UserDetails };
