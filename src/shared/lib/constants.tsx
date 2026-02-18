import { CreditCard, QrCode, Barcode } from 'lucide-react';
import { PaymentBillingType } from '@/shared/types';

const APPOINTMENT_COLORS = [
  { value: '#ef4444', label: 'Vermelho' },
  { value: '#f97316', label: 'Laranja' },
  { value: '#eab308', label: 'Amarelo' },
  { value: '#22c55e', label: 'Verde' },
  { value: '#3b82f6', label: 'Azul' },
  { value: '#8b5cf6', label: 'Roxo' },
  { value: '#ec4899', label: 'Rosa' },
  { value: '#64748b', label: 'Cinza' },
];

const API_SWAGGER_URL = 'https://api.huntercrm.com.br/swagger-ui/index.html#/';

const BILLING_OPTIONS = [
  {
    value: PaymentBillingType.PIX,
    label: 'PIX',
    description: 'Pagamento instantâneo',
    icon: QrCode,
  },
  {
    value: PaymentBillingType.BOLETO,
    label: 'Boleto',
    description: 'Vencimento em 3 dias úteis',
    icon: Barcode,
  },
  {
    value: PaymentBillingType.CREDIT_CARD,
    label: 'Cartão de Crédito',
    description: 'Pagamento imediato',
    icon: CreditCard,
  },
];

export { APPOINTMENT_COLORS, API_SWAGGER_URL, BILLING_OPTIONS };
