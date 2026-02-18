import { PaginationState } from '@tanstack/react-table';

import { CouponListItem, Record } from '@/shared/types';

import { api } from '@/shared/lib/api';
import { CouponFormData } from '@/features/sadm-dashboard/access-control/components/form/coupon-schema';

export async function getCoupons(pagination: PaginationState, isActive: boolean, search: string) {
  const params = { page: pagination.pageIndex, size: pagination.pageSize, isActive, search };
  const { data } = await api.get<Record<CouponListItem>>('dashboard/super-admin/coupon/list', { params });
  return data;
}

export async function getCoupon(uuid: string) {
  const { data } = await api.get<CouponListItem>(`dashboard/super-admin/coupon/${uuid}`);
  return data;
}

export async function newCoupon(formData: CouponFormData) {
  await api.post('dashboard/super-admin/coupon', formData);
}

export async function removeCoupon(uuid: string) {
  await api.delete(`dashboard/super-admin/coupon/${uuid}`);
}
