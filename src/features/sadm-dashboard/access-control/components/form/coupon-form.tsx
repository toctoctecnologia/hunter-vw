'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { CalendarIcon, Hash, Percent, FileText } from 'lucide-react';

import { CouponListType } from '@/shared/types';

import { newCoupon } from '@/features/sadm-dashboard/access-control/api/coupon';
import { couponSchema, CouponFormData } from '@/features/sadm-dashboard/access-control/components/form/coupon-schema';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { removeNonNumeric } from '@/shared/lib/masks';

interface CouponFormProps {
  onSuccess?: () => void;
}

export function CouponForm({ onSuccess }: CouponFormProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CouponFormData) => newCoupon(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sadm-coupons'] });
      toast.success('Cupom criado com sucesso!');
      onSuccess?.();
    },
  });

  const form = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: '',
      description: '',
      discountPercentage: '',
      couponType: CouponListType.SINGLE_USE,
      expirationDate: '',
    },
  });

  const couponType = form.watch('couponType');
  const showExpirationDate = couponType === CouponListType.DATE_EXPIRATION;

  function onSubmit(formData: CouponFormData) {
    const payload = { ...formData };
    if (payload.couponType === CouponListType.SINGLE_USE) {
      delete payload.expirationDate;
    }
    mutate(payload);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código</FormLabel>
              <FormControl>
                <Input placeholder="Ex: PROMO2026" icon={Hash} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Breve descrição do cupom" icon={FileText} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="discountPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Desconto (%)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: 10"
                    icon={Percent}
                    {...field}
                    onChange={(e) => field.onChange(removeNonNumeric(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="couponType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo do Cupom</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    if (value === CouponListType.SINGLE_USE) {
                      form.setValue('expirationDate', '');
                    }
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={CouponListType.SINGLE_USE}>Uso Único</SelectItem>
                    <SelectItem value={CouponListType.DATE_EXPIRATION}>Expiração por Data</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {showExpirationDate && (
          <FormField
            control={form.control}
            name="expirationDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Expiração</FormLabel>
                <FormControl>
                  <Input type="date" icon={CalendarIcon} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" isLoading={isPending} className="w-full text-sm sm:text-base py-2 sm:py-3">
          Criar cupom
        </Button>
      </form>
    </Form>
  );
}
