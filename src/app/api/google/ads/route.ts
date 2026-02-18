import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

type GoogleAdsMetrics = {
  leads: number;
  conversions: number;
  conversionRate: number; // Conversão (%)
  cpl: number; // CPL (Custo Por Lead)
  roi: number; // ROI
  totalCost: number;
  totalConversionsValue: number;
  clicks: number;
};

type CampaignMetrics = {
  conversions?: string;
  costMicros?: string;
  conversionsValue?: string;
  clicks?: string;
};

type CampaignResult = {
  metrics: CampaignMetrics;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accessTokenParam = searchParams.get('access_token');

    if (!accessTokenParam) {
      return NextResponse.json({ error: 'access_token é obrigatório' }, { status: 400 });
    }

    // Mock de dados para testar a interface
    // const mockMetrics: GoogleAdsMetrics = {
    //   leads: 247,
    //   conversions: 247.5,
    //   conversionRate: 4.82,
    //   cpl: 38.45,
    //   roi: 156.73,
    //   totalCost: 9512.75,
    //   totalConversionsValue: 24420.0,
    //   clicks: 5135,
    // };

    // return NextResponse.json({
    //   success: true,
    //   customerId: '1234567890',
    //   period: 'LAST_30_DAYS',
    //   metrics: mockMetrics,
    //   campaigns: 8,
    // });

    // Decodifica o access_token que pode conter caracteres especiais
    const accessToken = decodeURIComponent(accessTokenParam);

    // const developerToken = process.env.GOOGLE_OAUTH_DEVELOPER_TOKEN;
    const developerToken = 'nruuFmJZo2EDVTWk7SnWvw';

    if (!developerToken) {
      return NextResponse.json({ error: 'Developer token não configurado' }, { status: 500 });
    }

    const customersResponse = await axios.get(
      'https://googleads.googleapis.com/v22/customers:listAccessibleCustomers',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'developer-token': developerToken,
        },
      },
    );

    const customerIds = customersResponse.data.resourceNames || [];

    if (customerIds.length === 0) {
      return NextResponse.json({ error: 'Nenhuma conta Google Ads encontrada' }, { status: 404 });
    }

    // Extrai o customer ID do primeiro resourceName (formato: "customers/1234567890")
    const customerId = customerIds[0].split('/')[1];

    // Passo 2: Buscar métricas das campanhas
    const query = `
      SELECT
        campaign.id,
        campaign.name,
        campaign.status,
        metrics.conversions,
        metrics.cost_micros,
        metrics.conversions_value,
        metrics.clicks
      FROM campaign
      WHERE segments.date DURING LAST_30_DAYS
      ORDER BY metrics.conversions DESC
    `;

    const metricsResponse = await axios.post(
      `https://googleads.googleapis.com/v22/customers/${customerId}/googleAds:search`,
      {
        query,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'developer-token': developerToken,
          'Content-Type': 'application/json',
        },
      },
    );

    const metricsData = metricsResponse.data;
    const results = metricsData.results || [];

    console.log('Resultados das campanhas do Google Ads:', results);

    // Passo 3: Calcular as métricas agregadas
    let totalConversions = 0;
    let totalCostMicros = 0;
    let totalConversionsValue = 0;
    let totalClicks = 0;

    results.forEach((result: CampaignResult) => {
      const metrics = result.metrics;
      totalConversions += Number(metrics.conversions || 0);
      totalCostMicros += Number(metrics.costMicros || 0);
      totalConversionsValue += Number(metrics.conversionsValue || 0);
      totalClicks += Number(metrics.clicks || 0);
    });

    // Converter custo de micros para valor real (micros = valor * 1.000.000)
    const totalCost = totalCostMicros / 1000000;

    // Calcular métricas
    const leads = Math.round(totalConversions); // Leads = Conversões
    const conversions = totalConversions;
    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0; // Taxa de conversão
    const cpl = conversions > 0 ? totalCost / conversions : 0; // Custo Por Lead
    const roi = totalCost > 0 ? ((totalConversionsValue - totalCost) / totalCost) * 100 : 0; // ROI em %

    const metrics: GoogleAdsMetrics = {
      leads,
      conversions,
      conversionRate: Number(conversionRate.toFixed(2)),
      cpl: Number(cpl.toFixed(2)),
      roi: Number(roi.toFixed(2)),
      totalCost: Number(totalCost.toFixed(2)),
      totalConversionsValue: Number(totalConversionsValue.toFixed(2)),
      clicks: totalClicks,
    };

    return NextResponse.json({
      success: true,
      customerId,
      period: 'LAST_30_DAYS',
      metrics,
      campaigns: results.length,
    });
  } catch (error) {
    console.error('Erro na rota Google Ads:', axios.isAxiosError(error) ? error.response?.data : error);
    return NextResponse.json(
      {
        error: 'Erro interno ao processar requisição',
        details: axios.isAxiosError(error) ? error.response?.data : String(error),
      },
      { status: 500 },
    );
  }
}
