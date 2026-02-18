'use client';

import { useEffect, useState } from 'react';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { AlertCircle, Check, Loader2, Tag, X } from 'lucide-react';

import { validateCoupon } from '@/features/dashboard/payments/api/coupon';
import { CouponValidationData } from '@/shared/types';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

interface CouponCodeFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name?: Path<T>;
}

export function CouponCodeField<T extends FieldValues>({ form, name }: CouponCodeFieldProps<T>) {
  const fieldName = name ?? ('couponCode' as Path<T>);

  const [couponState, setCouponState] = useState<{
    isLoading: boolean;
    data: CouponValidationData | null;
    error: string | null;
  }>({ isLoading: false, data: null, error: null });

  const fieldValue = form.watch(fieldName);

  useEffect(() => {
    if (!fieldValue && (couponState.data || couponState.error)) {
      setCouponState({ isLoading: false, data: null, error: null });
    }
  }, [fieldValue, couponState.data, couponState.error]);

  const handleValidateCoupon = async () => {
    const code = (form.getValues(fieldName) as string)?.trim();
    if (!code) return;

    setCouponState({ isLoading: true, data: null, error: null });
    try {
      const data = await validateCoupon(code);
      if (data.valid) {
        setCouponState({ isLoading: false, data, error: null });
      } else {
        setCouponState({ isLoading: false, data: null, error: data.message || 'Cupom inválido.' });
      }
    } catch {
      setCouponState({ isLoading: false, data: null, error: 'Erro ao validar cupom. Tente novamente.' });
    }
  };

  const handleRemoveCoupon = () => {
    form.setValue(fieldName, '' as T[Path<T>]);
    setCouponState({ isLoading: false, data: null, error: null });
  };

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Cupom de desconto</FormLabel>
          <div className="flex gap-2">
            <div className="flex-1">
              <FormControl>
                <Input
                  {...field}
                  placeholder="Digite o código do cupom"
                  disabled={!!couponState.data || couponState.isLoading}
                />
              </FormControl>
            </div>
            {couponState.data ? (
              <Button type="button" variant="outline" size="icon" onClick={handleRemoveCoupon} className="shrink-0">
                <X className="size-4" />
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={handleValidateCoupon}
                disabled={!field.value?.trim() || couponState.isLoading}
                className="shrink-0"
              >
                {couponState.isLoading ? <Loader2 className="size-4 animate-spin" /> : <Tag className="size-4" />}
                Aplicar
              </Button>
            )}
          </div>
          {couponState.data && (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950/30 dark:text-green-300">
              <Check className="size-4 shrink-0" />
              <p>
                Cupom <strong>{couponState.data.code}</strong> aplicado — {couponState.data.discountPercentage}% de
                desconto
                {couponState.data.description && ` (${couponState.data.description})`}
              </p>
            </div>
          )}
          {couponState.error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
              <AlertCircle className="size-4 shrink-0" />
              <p>{couponState.error}</p>
            </div>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
