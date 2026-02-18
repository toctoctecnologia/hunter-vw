'use client';

import { useState } from 'react';
import { Plus, Trash2, Ticket } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { CouponListItem, CouponListType } from '@/shared/types';

import { getCoupons, removeCoupon } from '@/features/sadm-dashboard/access-control/api/coupon';

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/shared/components/ui/empty';
import { CouponModal } from '@/features/sadm-dashboard/access-control/components/modal/coupon-modal';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { TypographySmall } from '@/shared/components/ui/typography';
import { Button } from '@/shared/components/ui/button';
import { Loading } from '@/shared/components/loading';
import { Badge } from '@/shared/components/ui/badge';

function formatCouponType(type: CouponListType) {
  const labels: Record<string, string> = {
    [CouponListType.SINGLE_USE]: 'Uso Único',
    [CouponListType.DATE_EXPIRATION]: 'Expiração por Data',
  };
  return labels[type] ?? type;
}

function CouponItem({ coupon }: { coupon: CouponListItem }) {
  const queryClient = useQueryClient();

  const { mutate: handleRemove, isPending } = useMutation({
    mutationFn: () => removeCoupon(coupon.uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sadm-coupons'] });
      toast.success('Cupom removido com sucesso!');
    },
  });

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b last:border-b-0">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <TypographySmall className="font-semibold">{coupon.code}</TypographySmall>
          <Badge variant={coupon.isActive ? 'default' : 'secondary'}>{coupon.isActive ? 'Ativo' : 'Inativo'}</Badge>
          <Badge variant="outline">{formatCouponType(coupon.couponType)}</Badge>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{coupon.discountPercentage}% de desconto</span>
          {coupon.description && <span>· {coupon.description}</span>}
          {coupon.expirationDate && <span>· Expira em: {coupon.expirationDate}</span>}
          <span>· Usos: {coupon.usageCount}</span>
        </div>
      </div>

      <Button size="sm" variant="destructive" onClick={() => handleRemove()} disabled={isPending}>
        <Trash2 className="size-3" />
      </Button>
    </div>
  );
}

export function Coupons() {
  const [showModal, setShowModal] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['sadm-coupons'],
    queryFn: () => getCoupons({ pageIndex: 0, pageSize: 50 }, true, ''),
  });

  const coupons = data?.content ?? [];

  return (
    <>
      <CouponModal open={showModal} onClose={() => setShowModal(false)} />

      <Card>
        <CardHeader>
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl sm:text-2xl">Cupons</CardTitle>
            <Button size="sm" onClick={() => setShowModal(true)}>
              <Plus className="size-4 mr-1" />
              Novo Cupom
            </Button>
          </div>
        </CardHeader>
        <CardContent className="h-full px-0 border-t">
          {isLoading ? (
            <Loading />
          ) : coupons.length > 0 ? (
            <div className="flex flex-col">
              {coupons.map((coupon) => (
                <CouponItem key={coupon.uuid} coupon={coupon} />
              ))}
            </div>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Ticket />
                </EmptyMedia>
                <EmptyTitle>Sem Cupons</EmptyTitle>
                <EmptyDescription>Ainda não existem cupons cadastrados</EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </CardContent>
      </Card>
    </>
  );
}
