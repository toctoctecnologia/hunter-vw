import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { ResponsiveLayout } from '@/components/shell/ResponsiveLayout';
import PageContainer from '@/components/ui/page-container';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  RadioGroup,
  RadioGroupItem
} from '@/components/ui/radio-group';
import {
  ArrowUpRight,
  CalendarDays,
  CreditCard,
  Download,
  Mail,
  RefreshCw,
  ShieldCheck,
  TicketPercent,
  FileText,
  ClipboardCheck,
  CircleAlert
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUser, canAccessBilling } from '@/utils/auth';
import Default403State from '@/components/ui/Default403State';

interface BillingSummary {
  currentPlan: string;
  monthlyCost: number;
  nextInvoiceDate: string;
  outstandingBalance: number;
  couponCode?: string | null;
  couponDiscount?: number;
}

interface UsageMetric {
  label: string;
  value: number;
  limit?: number | null;
  unit?: string;
}

interface BillingUsage {
  period: string;
  metrics: UsageMetric[];
}

interface Invoice {
  id: string;
  number: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'open' | 'overdue';
  url?: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'boleto' | 'pix';
  last4?: string;
  brand?: string;
  holder?: string;
  createdAt: string;
  status: 'pending' | 'verified';
}

interface BillingPlan {
  id: string;
  name: string;
  price: number;
  description?: string;
}

interface FiscalData {
  companyName: string;
  cnpj: string;
  cep: string;
  address: string;
  city?: string;
  state?: string;
  emails?: string[];
}

interface ManualPaymentInstruction {
  bank: string;
  agency: string;
  account: string;
  pixKey?: string;
  message?: string;
}

interface ProrationPreview {
  amountDue: number;
  credit: number;
  nextChargeDate: string;
}

interface CouponValidationResult {
  valid: boolean;
  message: string;
  discountPercentage?: number;
}

interface AuditLogPayload {
  action: string;
  metadata?: Record<string, unknown>;
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

function formatMoney(value: number) {
  return currencyFormatter.format(value ?? 0);
}

function formatDate(value?: string) {
  if (!value) return '—';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(parsed);
}

function validateLuhn(cardNumber: string) {
  const sanitized = cardNumber.replace(/\D/g, '');
  if (sanitized.length < 13) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = sanitized.length - 1; i >= 0; i -= 1) {
    let digit = parseInt(sanitized[i], 10);
    if (Number.isNaN(digit)) return false;
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

function validateExpiry(expiry: string) {
  const match = expiry.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
  if (!match) return false;
  const month = parseInt(match[1], 10);
  const year = parseInt(match[2], 10) + 2000;
  const today = new Date();
  const expiryDate = new Date(year, month, 0);
  return expiryDate >= new Date(today.getFullYear(), today.getMonth(), 1);
}

function validateCvc(cvc: string) {
  return /^\d{3,4}$/.test(cvc.trim());
}

function cleanDigits(value: string) {
  return value.replace(/\D/g, '');
}

function validateCnpj(value: string) {
  const digits = cleanDigits(value);
  if (digits.length !== 14 || /^([0-9])\1+$/.test(digits)) {
    return false;
  }
  const calc = (base: number) => {
    let sum = 0;
    let factor = base;
    for (let i = 0; i < digits.length - (15 - base); i += 1) {
      sum += parseInt(digits.charAt(i), 10) * factor;
      factor -= 1;
      if (factor < 2) factor = 9;
    }
    const result = sum % 11;
    return result < 2 ? 0 : 11 - result;
  };
  const d1 = calc(5);
  const d2 = calc(6);
  return d1 === parseInt(digits.charAt(12), 10) && d2 === parseInt(digits.charAt(13), 10);
}

function validateCep(value: string) {
  return /^\d{5}-?\d{3}$/.test(value.trim());
}

const emailRegex = /^(?:[a-z0-9_+.-]+)@(?:[a-z0-9.-]+)\.[a-z]{2,}$/i;

function parseEmailList(value: string) {
  return value
    .split(/[\n,;]+/)
    .map(email => email.trim())
    .filter(Boolean);
}

function validateEmailList(value: string) {
  const emails = parseEmailList(value);
  if (!emails.length) return false;
  return emails.every(email => emailRegex.test(email));
}

async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T | null> {
  const response = await fetch(input, init);
  if (!response.ok) {
    const message = await response.text().catch(() => 'Erro ao carregar dados.');
    throw new Error(message || 'Erro ao carregar dados.');
  }
  const text = await response.text().catch(() => '');
  if (!text || !text.trim()) {
    return null;
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error('Resposta inválida do servidor.');
  }
}

function PagamentosPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentUser = getCurrentUser();
  const hasAccess = canAccessBilling(currentUser);

  const [summary, setSummary] = useState<BillingSummary | null>(null);
  const [usage, setUsage] = useState<BillingUsage | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [plans, setPlans] = useState<BillingPlan[]>([]);
  const [fiscalData, setFiscalData] = useState<FiscalData | null>(null);
  const [manualInstructions, setManualInstructions] = useState<ManualPaymentInstruction | null>(null);

  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingUsage, setLoadingUsage] = useState(true);
  const [loadingInvoices, setLoadingInvoices] = useState(true);
  const [loadingMethods, setLoadingMethods] = useState(true);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [loadingFiscal, setLoadingFiscal] = useState(true);
  const [loadingInstructions, setLoadingInstructions] = useState(true);

  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [proration, setProration] = useState<ProrationPreview | null>(null);
  const [prorationLoading, setProrationLoading] = useState(false);

  const [methodModalOpen, setMethodModalOpen] = useState(false);
  const [methodType, setMethodType] = useState<'card' | 'boleto' | 'pix'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [boletoEmail, setBoletoEmail] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [methodLoading, setMethodLoading] = useState(false);

  const [fiscalForm, setFiscalForm] = useState({
    companyName: '',
    cnpj: '',
    cep: '',
    address: '',
    city: '',
    state: '',
    emails: ''
  });
  const [fiscalSaving, setFiscalSaving] = useState(false);

  const [couponCode, setCouponCode] = useState('');
  const [couponResult, setCouponResult] = useState<CouponValidationResult | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const [sendInvoiceId, setSendInvoiceId] = useState<string | null>(null);
  const [sendInvoiceEmails, setSendInvoiceEmails] = useState('');
  const [sendLoading, setSendLoading] = useState(false);

  const [auditLoading, setAuditLoading] = useState(false);

  useEffect(() => {
    if (!hasAccess) return;
    let isMounted = true;
    const controller = new AbortController();

    async function loadSummary() {
      setLoadingSummary(true);
      try {
        const data = await fetchJson<BillingSummary>('/billing/summary', {
          signal: controller.signal
        });
        if (isMounted) {
          setSummary(data && typeof data === 'object' && !Array.isArray(data) ? data : null);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          toast({ title: 'Não foi possível carregar o resumo', description: (error as Error).message, variant: 'destructive' });
        }
      } finally {
        if (isMounted) setLoadingSummary(false);
      }
    }

    async function loadUsage() {
      setLoadingUsage(true);
      try {
        const data = await fetchJson<BillingUsage>('/billing/usage', {
          signal: controller.signal
        });
        if (isMounted) {
          setUsage(
            data && typeof data === 'object' && !Array.isArray(data)
              ? { ...data, metrics: Array.isArray(data.metrics) ? data.metrics : [] }
              : null
          );
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          toast({ title: 'Erro ao carregar uso', description: (error as Error).message, variant: 'destructive' });
        }
      } finally {
        if (isMounted) setLoadingUsage(false);
      }
    }

    async function loadInvoices() {
      setLoadingInvoices(true);
      try {
        const data = await fetchJson<Invoice[]>('/billing/invoices', {
          signal: controller.signal
        });
        if (isMounted) setInvoices(Array.isArray(data) ? data : []);
      } catch (error) {
        if (!controller.signal.aborted) {
          toast({ title: 'Erro ao carregar faturas', description: (error as Error).message, variant: 'destructive' });
        }
      } finally {
        if (isMounted) setLoadingInvoices(false);
      }
    }

    async function loadMethods() {
      setLoadingMethods(true);
      try {
        const data = await fetchJson<PaymentMethod[]>('/billing/payment-methods', {
          signal: controller.signal
        });
        if (isMounted) setPaymentMethods(Array.isArray(data) ? data : []);
      } catch (error) {
        if (!controller.signal.aborted) {
          toast({ title: 'Erro ao carregar métodos de pagamento', description: (error as Error).message, variant: 'destructive' });
        }
      } finally {
        if (isMounted) setLoadingMethods(false);
      }
    }

    async function loadPlans() {
      setLoadingPlans(true);
      try {
        const data = await fetchJson<BillingPlan[]>('/billing/plans', {
          signal: controller.signal
        });
        if (isMounted) {
          setPlans(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          toast({ title: 'Erro ao carregar planos', description: (error as Error).message, variant: 'destructive' });
        }
      } finally {
        if (isMounted) setLoadingPlans(false);
      }
    }

    async function loadFiscal() {
      setLoadingFiscal(true);
      try {
        const data = await fetchJson<FiscalData>('/billing/fiscal-data', {
          signal: controller.signal
        });
        if (isMounted) {
          const safeData = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
          setFiscalData(safeData);
          setFiscalForm({
            companyName: safeData?.companyName ?? '',
            cnpj: safeData?.cnpj ?? '',
            cep: safeData?.cep ?? '',
            address: safeData?.address ?? '',
            city: safeData?.city ?? '',
            state: safeData?.state ?? '',
            emails: Array.isArray(safeData?.emails) ? safeData?.emails.join('\n') : ''
          });
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          toast({ title: 'Erro ao carregar dados fiscais', description: (error as Error).message, variant: 'destructive' });
        }
      } finally {
        if (isMounted) setLoadingFiscal(false);
      }
    }

    async function loadManualInstructions() {
      setLoadingInstructions(true);
      try {
        const data = await fetchJson<ManualPaymentInstruction>('/billing/manual-payment', {
          signal: controller.signal
        });
        if (isMounted) {
          setManualInstructions(data && typeof data === 'object' && !Array.isArray(data) ? data : null);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          toast({ title: 'Erro ao carregar instruções de pagamento manual', description: (error as Error).message, variant: 'destructive' });
        }
      } finally {
        if (isMounted) setLoadingInstructions(false);
      }
    }

    loadSummary();
    loadUsage();
    loadInvoices();
    loadMethods();
    loadPlans();
    loadFiscal();
    loadManualInstructions();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [hasAccess, toast]);

  const handleMainTabChange = useCallback((tab: string) => {
    switch (tab) {
      case 'home':
        navigate('/');
        break;
      case 'vendas':
        navigate('/vendas');
        break;
      case 'agenda':
        navigate('/agenda');
        break;
      case 'imoveis':
        navigate('/imoveis');
        break;
      case 'usuarios':
        navigate('/usuarios');
        break;
      case 'distribuicao':
        navigate('/distribuicao');
        break;
      case 'gestao-api':
        navigate('/gestao-api');
        break;
      case 'gestao-roletao':
        navigate('/gestao-roletao');
        break;
      case 'gestao-relatorios':
        navigate('/gestao-relatorios');
        break;
      case 'gestao-acessos':
        navigate('/gestao-acessos');
        break;
      case 'pagamentos':
        navigate('/pagamentos');
        break;
      default:
        break;
    }
  }, [navigate]);

  const currentPlan = useMemo(() => plans?.find(plan => plan.id === summary?.currentPlan) || null, [plans, summary?.currentPlan]);
  const usageMetrics = useMemo(() => (Array.isArray(usage?.metrics) ? usage.metrics : []), [usage]);

  const resetMethodForm = () => {
    setMethodType('card');
    setCardNumber('');
    setCardHolder('');
    setCardExpiry('');
    setCardCvc('');
    setBoletoEmail('');
    setPixKey('');
  };

  const handleSimulateProration = async () => {
    if (!selectedPlanId) {
      toast({ title: 'Selecione um plano', variant: 'destructive' });
      return;
    }
    setProrationLoading(true);
    try {
      const data = await fetchJson<ProrationPreview>('/billing/proration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: selectedPlanId })
      });
      if (!data) {
        throw new Error('Resposta vazia do servidor.');
      }
      setProration(data);
      toast({ title: 'Simulação realizada com sucesso', variant: 'success' });
    } catch (error) {
      toast({ title: 'Não foi possível simular o prorrateio', description: (error as Error).message, variant: 'destructive' });
    } finally {
      setProrationLoading(false);
    }
  };

  const handleChangePlan = async () => {
    if (!selectedPlanId) {
      toast({ title: 'Selecione um plano', variant: 'destructive' });
      return;
    }
    setProrationLoading(true);
    try {
      await fetchJson('/billing/plan/change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: selectedPlanId })
      });
      toast({ title: 'Plano atualizado com sucesso', variant: 'success' });
      setPlanModalOpen(false);
      setSelectedPlanId('');
      setProration(null);
      setLoadingSummary(true);
      const data = await fetchJson<BillingSummary>('/billing/summary');
      setSummary(data && typeof data === 'object' && !Array.isArray(data) ? data : null);
    } catch (error) {
      toast({ title: 'Erro ao atualizar plano', description: (error as Error).message, variant: 'destructive' });
    } finally {
      setProrationLoading(false);
    }
  };

  const handleAddPaymentMethod = async () => {
    setMethodLoading(true);
    try {
      switch (methodType) {
        case 'card': {
          if (!validateLuhn(cardNumber)) {
            throw new Error('Número do cartão inválido. Verifique os dígitos.');
          }
          if (!validateExpiry(cardExpiry)) {
            throw new Error('Validade inválida. Use o formato MM/AA.');
          }
          if (!validateCvc(cardCvc)) {
            throw new Error('CVC inválido.');
          }
          if (!cardHolder.trim()) {
            throw new Error('Informe o titular do cartão.');
          }
          break;
        }
        case 'boleto': {
          if (!validateEmailList(boletoEmail)) {
            throw new Error('Informe ao menos um e-mail válido para envio do boleto.');
          }
          break;
        }
        case 'pix': {
          if (!pixKey.trim()) {
            throw new Error('Informe a chave PIX.');
          }
          break;
        }
        default:
          break;
      }
      const payload = {
        type: methodType,
        card: methodType === 'card' ? {
          number: cardNumber.replace(/\s+/g, ''),
          holder: cardHolder.trim(),
          expiry: cardExpiry,
          cvc: cardCvc
        } : undefined,
        boleto: methodType === 'boleto' ? {
          emails: parseEmailList(boletoEmail)
        } : undefined,
        pix: methodType === 'pix' ? {
          key: pixKey.trim()
        } : undefined
      };
      await fetchJson('/billing/payment-methods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      toast({ title: 'Método de pagamento adicionado', variant: 'success' });
      setMethodModalOpen(false);
      resetMethodForm();
      setLoadingMethods(true);
      const data = await fetchJson<PaymentMethod[]>('/billing/payment-methods');
      setPaymentMethods(Array.isArray(data) ? data : []);
    } catch (error) {
      toast({ title: 'Não foi possível salvar o método de pagamento', description: (error as Error).message, variant: 'destructive' });
    } finally {
      setMethodLoading(false);
    }
  };

  const handleSaveFiscalData = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateCnpj(fiscalForm.cnpj)) {
      toast({ title: 'CNPJ inválido', description: 'Verifique os números informados.', variant: 'destructive' });
      return;
    }
    if (!validateCep(fiscalForm.cep)) {
      toast({ title: 'CEP inválido', description: 'Use o formato 00000-000.', variant: 'destructive' });
      return;
    }
    if (fiscalForm.emails && !validateEmailList(fiscalForm.emails)) {
      toast({ title: 'E-mails inválidos', description: 'Revise a lista de e-mails informada.', variant: 'destructive' });
      return;
    }
    setFiscalSaving(true);
    try {
      const payload: FiscalData = {
        companyName: fiscalForm.companyName,
        cnpj: fiscalForm.cnpj,
        cep: fiscalForm.cep,
        address: fiscalForm.address,
        city: fiscalForm.city,
        state: fiscalForm.state,
        emails: parseEmailList(fiscalForm.emails)
      };
      const data = await fetchJson<FiscalData>('/billing/fiscal-data', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const safeData = data && typeof data === 'object' && !Array.isArray(data) ? data : payload;
      setFiscalData(safeData);
      setFiscalForm({
        companyName: safeData.companyName ?? '',
        cnpj: safeData.cnpj ?? '',
        cep: safeData.cep ?? '',
        address: safeData.address ?? '',
        city: safeData.city ?? '',
        state: safeData.state ?? '',
        emails: Array.isArray(safeData.emails) ? safeData.emails.join('\n') : ''
      });
      toast({ title: 'Dados fiscais atualizados', variant: 'success' });
    } catch (error) {
      toast({ title: 'Erro ao salvar dados fiscais', description: (error as Error).message, variant: 'destructive' });
    } finally {
      setFiscalSaving(false);
    }
  };

  const handleValidateCoupon = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!couponCode.trim()) {
      toast({ title: 'Informe um cupom', variant: 'destructive' });
      return;
    }
    setCouponLoading(true);
    try {
      const data = await fetchJson<CouponValidationResult>('/billing/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim() })
      });
      if (!data) {
        throw new Error('Resposta vazia do servidor.');
      }
      setCouponResult(data);
      toast({ title: data.valid ? 'Cupom válido!' : 'Cupom inválido', description: data.message, variant: data.valid ? 'success' : 'destructive' });
      if (data.valid) {
        setLoadingSummary(true);
        const updatedSummary = await fetchJson<BillingSummary>('/billing/summary');
        setSummary(updatedSummary && typeof updatedSummary === 'object' && !Array.isArray(updatedSummary) ? updatedSummary : null);
      }
    } catch (error) {
      toast({ title: 'Erro ao validar cupom', description: (error as Error).message, variant: 'destructive' });
    } finally {
      setCouponLoading(false);
    }
  };

  const handleDownloadInvoice = async (invoice: Invoice) => {
    try {
      const result = await fetchJson<{ url: string }>(`/billing/invoices/${invoice.id}/download`, {
        method: 'POST'
      });
      const url = result?.url;
      if (url) {
        window.open(url, '_blank');
      } else {
        throw new Error('Link de download indisponível.');
      }
      toast({ title: 'Download iniciado', description: `Baixando a fatura ${invoice.number}` });
    } catch (error) {
      toast({ title: 'Erro ao baixar fatura', description: (error as Error).message, variant: 'destructive' });
    }
  };

  const handleReissueInvoice = async (invoice: Invoice) => {
    try {
      await fetchJson(`/billing/invoices/${invoice.id}/reissue`, {
        method: 'POST'
      });
      toast({ title: 'Fatura reemitida', description: `Uma nova versão da fatura ${invoice.number} será enviada.` });
      setLoadingInvoices(true);
      const data = await fetchJson<Invoice[]>('/billing/invoices');
      setInvoices(Array.isArray(data) ? data : []);
    } catch (error) {
      toast({ title: 'Erro ao reemitir fatura', description: (error as Error).message, variant: 'destructive' });
    }
  };

  const handleSendInvoice = async () => {
    if (!sendInvoiceId) return;
    if (!validateEmailList(sendInvoiceEmails)) {
      toast({ title: 'Lista de e-mails inválida', description: 'Separe múltiplos e-mails por vírgula ou quebra de linha.', variant: 'destructive' });
      return;
    }
    setSendLoading(true);
    try {
      await fetchJson(`/billing/invoices/${sendInvoiceId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails: parseEmailList(sendInvoiceEmails) })
      });
      toast({ title: 'Fatura enviada', variant: 'success' });
      setSendInvoiceId(null);
      setSendInvoiceEmails('');
    } catch (error) {
      toast({ title: 'Erro ao enviar fatura', description: (error as Error).message, variant: 'destructive' });
    } finally {
      setSendLoading(false);
    }
  };

  const handleAuditLog = async (action: string, metadata?: Record<string, unknown>) => {
    setAuditLoading(true);
    try {
      const payload: AuditLogPayload = { action, metadata };
      await fetchJson('/billing/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      toast({ title: 'Evento de auditoria registrado', variant: 'success' });
    } catch (error) {
      toast({ title: 'Erro ao registrar auditoria', description: (error as Error).message, variant: 'destructive' });
    } finally {
      setAuditLoading(false);
    }
  };

  const handleOpenSendInvoiceModal = (invoice: Invoice) => {
    setSendInvoiceId(invoice.id);
    setSendInvoiceEmails(invoice?.status === 'paid' && fiscalData?.emails?.length ? fiscalData.emails.join('\n') : '');
  };

  if (!hasAccess) {
    return (
      <ResponsiveLayout activeTab="pagamentos" setActiveTab={handleMainTabChange}>
        <PageContainer className="py-6">
          <Default403State title="Acesso restrito" description="Você não possui permissão para visualizar os pagamentos." />
        </PageContainer>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout activeTab="pagamentos" setActiveTab={handleMainTabChange}>
      <PageContainer className="py-6 space-y-6">
        <div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pagamentos</h1>
              <p className="text-sm text-gray-600">
                Gerencie planos, faturas, métodos de pagamento e dados fiscais da sua conta.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <Card className="xl:col-span-12">
            <CardHeader>
              <CardTitle>Resumo financeiro</CardTitle>
              <CardDescription>Status atual da assinatura</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingSummary ? (
                <div className="grid gap-4 md:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index.toString()} className="h-24 rounded-2xl" />
                  ))}
                </div>
              ) : summary ? (
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-center gap-4 rounded-2xl border border-orange-100 bg-orange-50/50 p-4">
                    <div className="rounded-xl bg-orange-100 p-3 text-orange-600">
                      <ArrowUpRight className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <Badge className="mt-1 bg-orange-500 hover:bg-orange-500">Período de Teste Ativo</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-2xl border border-gray-200 p-4">
                    <div className="rounded-xl bg-orange-100 p-3 text-orange-600">
                      <CalendarDays className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Próximo vencimento</p>
                      <p className="text-2xl font-semibold leading-none">{formatDate(summary.nextInvoiceDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-2xl border border-gray-200 p-4">
                    <div className="rounded-xl bg-orange-100 p-3 text-orange-600">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Perfil</p>
                      <p className="text-2xl font-semibold leading-none">Administrator</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Nenhuma informação disponível.</p>
              )}
            </CardContent>
          </Card>

          <Card className="xl:col-span-6">
            <CardHeader>
              <CardTitle>Mudança de plano</CardTitle>
              <CardDescription>Gerencie alterações no seu plano atual</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-end">
                <Button onClick={() => setPlanModalOpen(true)}>
                  Alterar plano
                </Button>
              </div>
              <p className="text-sm text-gray-500">Nenhuma mudança de plano pendente.</p>
            </CardContent>
          </Card>

          <Card className="xl:col-span-6">
            <CardHeader>
              <CardTitle>Faturas</CardTitle>
              <CardDescription>Acompanhe cobranças recentes</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingInvoices ? (
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index.toString()} className="h-12 rounded-lg" />
                  ))}
                </div>
              ) : invoices.length ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fatura</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map(invoice => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.number}</TableCell>
                        <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                        <TableCell>{formatMoney(invoice.amount)}</TableCell>
                        <TableCell>
                          <Badge variant={invoice.status === 'paid' ? 'success' : invoice.status === 'overdue' ? 'destructive' : 'secondary'}>
                            {invoice.status === 'paid' ? 'Paga' : invoice.status === 'overdue' ? 'Em atraso' : 'Aberta'}
                          </Badge>
                        </TableCell>
                        <TableCell className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleDownloadInvoice(invoice)}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleOpenSendInvoiceModal(invoice)}>
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleReissueInvoice(invoice)}>
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-gray-500">Nenhuma fatura encontrada.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <Card className="xl:col-span-12">
            <CardHeader>
              <CardTitle>Dados fiscais</CardTitle>
              <CardDescription>Utilizados para emissão de notas fiscais</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingFiscal ? (
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index.toString()} className="h-10 rounded-lg" />
                  ))}
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleSaveFiscalData}>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="sm:col-span-2 space-y-2">
                      <Label htmlFor="companyName">Razão social</Label>
                      <Input
                        id="companyName"
                        value={fiscalForm.companyName}
                        onChange={event => setFiscalForm(prev => ({ ...prev, companyName: event.target.value }))}
                        placeholder="Empresa S.A."
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cnpj">CNPJ</Label>
                      <Input
                        id="cnpj"
                        value={fiscalForm.cnpj}
                        onChange={event => setFiscalForm(prev => ({ ...prev, cnpj: event.target.value }))}
                        placeholder="00.000.000/0001-00"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cep">CEP</Label>
                      <Input
                        id="cep"
                        value={fiscalForm.cep}
                        onChange={event => setFiscalForm(prev => ({ ...prev, cep: event.target.value }))}
                        placeholder="00000-000"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <Label htmlFor="address">Endereço</Label>
                      <Input
                        id="address"
                        value={fiscalForm.address}
                        onChange={event => setFiscalForm(prev => ({ ...prev, address: event.target.value }))}
                        placeholder="Rua Exemplo, 123"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        value={fiscalForm.city}
                        onChange={event => setFiscalForm(prev => ({ ...prev, city: event.target.value }))}
                        placeholder="São Paulo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">Estado</Label>
                      <Input
                        id="state"
                        value={fiscalForm.state}
                        onChange={event => setFiscalForm(prev => ({ ...prev, state: event.target.value }))}
                        placeholder="SP"
                        maxLength={2}
                      />
                    </div>
                    <div className="sm:col-span-2 lg:col-span-3 space-y-2">
                      <Label htmlFor="emails">E-mails para NF (um por linha)</Label>
                      <Textarea
                        id="emails"
                        value={fiscalForm.emails}
                        onChange={event => setFiscalForm(prev => ({ ...prev, emails: event.target.value }))}
                        placeholder="financeiro@empresa.com\nfiscal@empresa.com"
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={fiscalSaving}>
                      {fiscalSaving ? 'Salvando...' : 'Salvar alterações'}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        <Dialog open={planModalOpen} onOpenChange={setPlanModalOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Alterar plano</DialogTitle>
              <DialogDescription>
                Selecione um novo plano e forma de pagamento
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-3 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Ciclo de cobrança</p>
                <div className="mx-auto grid w-full max-w-xs grid-cols-2 rounded-2xl bg-gray-100 p-1">
                  <button type="button" className="rounded-xl border border-gray-300 bg-white px-4 py-3 font-medium text-gray-900">Mensal</button>
                  <button type="button" className="rounded-xl px-4 py-3 font-medium text-gray-700">Anual</button>
                </div>
              </div>

              {loadingPlans ? (
                <Skeleton className="h-32 w-full" />
              ) : (
                <RadioGroup value={selectedPlanId} onValueChange={setSelectedPlanId} className="max-h-[360px] space-y-4 overflow-y-auto pr-2">
                  {plans.map(plan => (
                    <label key={plan.id} htmlFor={`plan-${plan.id}`} className="block cursor-pointer rounded-3xl border border-orange-200 p-6">
                      <div className="flex items-start gap-3">
                        <RadioGroupItem value={plan.id} id={`plan-${plan.id}`} />
                        <div className="space-y-3">
                          <p className="text-3xl font-semibold leading-none">{formatMoney(plan.price)}<span className="text-lg font-normal text-gray-500">/mês</span></p>
                          <p className="text-xl font-semibold">
                            {plan.name}
                          </p>
                          <p className="text-sm text-gray-600">{plan.description ?? 'Plano profissional com recursos para escalar sua operação.'}</p>
                          <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-center gap-2"><span className="rounded-full bg-orange-100 p-1 text-orange-600">✓</span> 300 propriedades</li>
                            <li className="flex items-center gap-2"><span className="rounded-full bg-orange-100 p-1 text-orange-600">✓</span> 1 usuários</li>
                          </ul>
                        </div>
                      </div>
                      {plan.id === plans[1]?.id ? (
                        <div className="mx-auto mt-4 w-fit rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-4 py-1 text-xs font-semibold text-white">Mais popular</div>
                      ) : null}
                    </label>
                  ))}
                </RadioGroup>
              )}
              {proration && (
                <div className="rounded-md bg-orange-50 p-4 text-sm text-orange-700">
                  <p className="font-semibold">Resumo da simulação</p>
                  <ul className="mt-2 space-y-1">
                    <li>Valor proporcional: {formatMoney(proration.amountDue)}</li>
                    <li>Créditos a aplicar: {formatMoney(proration.credit)}</li>
                    <li>Próxima cobrança: {formatDate(proration.nextChargeDate)}</li>
                  </ul>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPlanModalOpen(false)}>Cancelar</Button>
              <Button onClick={handleChangePlan} disabled={prorationLoading}>
                Continuar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={methodModalOpen} onOpenChange={(open) => {
          setMethodModalOpen(open);
          if (!open) {
            resetMethodForm();
          }
        }}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Novo método de pagamento</DialogTitle>
              <DialogDescription>
                Tokenize cartões, boletos automáticos ou chaves PIX para cobranças recorrentes.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <RadioGroup value={methodType} onValueChange={value => setMethodType(value as typeof methodType)} className="flex gap-3">
                <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-lg border border-gray-200 p-3">
                  <RadioGroupItem value="card" id="method-card" />
                  <span className="text-sm">Cartão</span>
                </label>
                <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-lg border border-gray-200 p-3">
                  <RadioGroupItem value="boleto" id="method-boleto" />
                  <span className="text-sm">Boleto</span>
                </label>
                <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-lg border border-gray-200 p-3">
                  <RadioGroupItem value="pix" id="method-pix" />
                  <span className="text-sm">PIX</span>
                </label>
              </RadioGroup>

              {methodType === 'card' && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Número do cartão</Label>
                    <Input
                      id="card-number"
                      value={cardNumber}
                      onChange={event => setCardNumber(event.target.value)}
                      placeholder="0000 0000 0000 0000"
                      inputMode="numeric"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="card-holder">Titular</Label>
                    <Input
                      id="card-holder"
                      value={cardHolder}
                      onChange={event => setCardHolder(event.target.value)}
                      placeholder="Nome impresso"
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="card-expiry">Validade (MM/AA)</Label>
                      <Input
                        id="card-expiry"
                        value={cardExpiry}
                        onChange={event => setCardExpiry(event.target.value)}
                        placeholder="05/28"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="card-cvc">CVC</Label>
                      <Input
                        id="card-cvc"
                        value={cardCvc}
                        onChange={event => setCardCvc(event.target.value)}
                        placeholder="123"
                        inputMode="numeric"
                      />
                    </div>
                  </div>
                </div>
              )}

              {methodType === 'boleto' && (
                <div className="space-y-3">
                  <Label htmlFor="boleto-email">E-mails para envio do boleto</Label>
                  <Textarea
                    id="boleto-email"
                    value={boletoEmail}
                    onChange={event => setBoletoEmail(event.target.value)}
                    placeholder="financeiro@empresa.com\ncontas@empresa.com"
                    rows={3}
                  />
                </div>
              )}

              {methodType === 'pix' && (
                <div className="space-y-3">
                  <Label htmlFor="pix-key">Chave PIX</Label>
                  <Input
                    id="pix-key"
                    value={pixKey}
                    onChange={event => setPixKey(event.target.value)}
                    placeholder="Chave e-mail, telefone ou aleatória"
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setMethodModalOpen(false)}>Cancelar</Button>
              <Button onClick={handleAddPaymentMethod} disabled={methodLoading}>
                {methodLoading ? 'Salvando...' : 'Adicionar método'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={!!sendInvoiceId} onOpenChange={open => {
          if (!open) {
            setSendInvoiceId(null);
            setSendInvoiceEmails('');
          }
        }}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Enviar fatura por e-mail</DialogTitle>
              <DialogDescription>Informe uma ou mais contas para encaminhar a cobrança.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <Label htmlFor="invoice-emails">E-mails (um por linha ou separados por vírgula)</Label>
              <Textarea
                id="invoice-emails"
                value={sendInvoiceEmails}
                onChange={event => setSendInvoiceEmails(event.target.value)}
                placeholder="financeiro@empresa.com\ncontas@empresa.com"
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setSendInvoiceId(null)}>Cancelar</Button>
              <Button onClick={handleSendInvoice} disabled={sendLoading}>
                {sendLoading ? 'Enviando...' : 'Enviar fatura'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageContainer>
    </ResponsiveLayout>
  );
}

export default PagamentosPage;
