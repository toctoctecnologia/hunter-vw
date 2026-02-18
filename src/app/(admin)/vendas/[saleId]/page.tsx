import SaleHeader from '@/features/sales/components/SaleHeader';
import SaleNegotiationTimeline from '@/features/sales/components/SaleNegotiationTimeline';
import SaleDistributionChart from '@/features/sales/components/SaleDistributionChart';
import { getMockSaleDetail } from '@/features/sales/mocks/saleDetail.mock';

interface PageProps {
  params: { saleId: string };
}

export default function SaleDetailPage({ params }: PageProps) {
  const sale = getMockSaleDetail(params.saleId);

  if (!sale) {
    return <div className="p-4">Venda não encontrada</div>;
  }

  return (
    <div className="space-y-6 p-4">
      <SaleHeader sale={sale} />
      <div className="grid gap-6 md:grid-cols-2">
        <SaleNegotiationTimeline events={sale.negotiation} />
        <SaleDistributionChart shares={sale.distribution} />
      </div>
    </div>
  );
}
