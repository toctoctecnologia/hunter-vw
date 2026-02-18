import { api } from '@/shared/lib/api';
import { CouponValidationData } from '@/shared/types';

export async function validateCoupon(code: string) {
  const { data } = await api.get<CouponValidationData>(`coupon/validate?code=${code}`);
  return data;
}
