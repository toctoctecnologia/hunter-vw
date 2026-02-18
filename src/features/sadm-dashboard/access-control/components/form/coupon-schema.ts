import z from 'zod';
import { CouponListType } from '@/shared/types';

const couponSchema = z
  .object({
    code: z.string().min(1, { message: 'Código é obrigatório' }),
    description: z.string().optional(),
    discountPercentage: z.string().min(1, { error: 'Desconto deve ser no mínimo 1' }),
    couponType: z.nativeEnum(CouponListType, {
      message: 'Tipo do cupom é obrigatório',
    }),
    expirationDate: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.couponType === CouponListType.DATE_EXPIRATION && !data.expirationDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Data de expiração é obrigatória para cupons com expiração por data',
        path: ['expirationDate'],
      });
    }
  });

type CouponFormData = z.infer<typeof couponSchema>;

export { couponSchema, type CouponFormData };
