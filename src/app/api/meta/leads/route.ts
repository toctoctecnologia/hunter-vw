import { NextRequest, NextResponse } from 'next/server';

type MetaLeadsMetrics = {
  leads: number;
  conversions: number;
  conversionRate: number;
  cpl: number;
  roi: number;
  totalCost: number;
  totalConversionsValue: number;
  clicks: number;
  impressions: number;
};

type CampaignInsight = {
  impressions?: string;
  clicks?: string;
  spend?: string;
  actions?: Array<{ action_type: string; value: string }>;
  action_values?: Array<{ action_type: string; value: string }>;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accessToken = searchParams.get('access_token');
    const adAccountId = searchParams.get('ad_account_id');

    if (!accessToken) {
      return NextResponse.json({ error: 'access_token é obrigatório' }, { status: 400 });
    }

    if (!adAccountId) {
      return NextResponse.json({ error: 'ad_account_id é obrigatório' }, { status: 400 });
    }

    // Formata o ad account ID (adiciona 'act_' se não tiver)
    const formattedAdAccountId = adAccountId.startsWith('act_') ? adAccountId : `act_${adAccountId}`;

    // Busca os insights das campanhas dos últimos 30 dias
    const insightsUrl = new URL(`https://graph.facebook.com/v21.0/${formattedAdAccountId}/insights`);
    insightsUrl.searchParams.set('access_token', accessToken);
    insightsUrl.searchParams.set('date_preset', 'last_30d');
    insightsUrl.searchParams.set('fields', 'impressions,clicks,spend,actions,action_values,cost_per_action_type');
    insightsUrl.searchParams.set('level', 'account');

    const insightsResponse = await fetch(insightsUrl.toString());
    const insightsData = await insightsResponse.json();

    if (!insightsResponse.ok || insightsData.error) {
      console.error('Erro ao buscar insights do Meta:', insightsData);
      return NextResponse.json(
        {
          error: 'Erro ao buscar métricas do Meta Ads',
          details: insightsData.error?.message || 'Erro desconhecido',
        },
        { status: 500 },
      );
    }

    // Busca o número de campanhas ativas
    const campaignsUrl = new URL(`https://graph.facebook.com/v21.0/${formattedAdAccountId}/campaigns`);
    campaignsUrl.searchParams.set('access_token', accessToken);
    campaignsUrl.searchParams.set('fields', 'id,name,status');
    campaignsUrl.searchParams.set('limit', '100');

    const campaignsResponse = await fetch(campaignsUrl.toString());
    const campaignsData = await campaignsResponse.json();

    const activeCampaigns = (campaignsData.data || []).filter((c: { status: string }) => c.status === 'ACTIVE').length;

    // Processa os dados de insights
    const insights: CampaignInsight = insightsData.data?.[0] || {};

    const impressions = Number(insights.impressions || 0);
    const clicks = Number(insights.clicks || 0);
    const totalCost = Number(insights.spend || 0);

    // Busca leads das actions (lead, leadgen_grouped, onsite_conversion.lead_grouped)
    const leadActions = ['lead', 'leadgen_grouped', 'onsite_conversion.lead_grouped'];
    let leads = 0;
    let totalConversionsValue = 0;

    if (insights.actions) {
      for (const action of insights.actions) {
        if (leadActions.includes(action.action_type)) {
          leads += Number(action.value || 0);
        }
      }
    }

    if (insights.action_values) {
      for (const actionValue of insights.action_values) {
        if (leadActions.includes(actionValue.action_type)) {
          totalConversionsValue += Number(actionValue.value || 0);
        }
      }
    }

    // Se não encontrou leads específicos, usa conversões gerais
    if (leads === 0 && insights.actions) {
      const conversionAction = insights.actions.find(
        (a: { action_type: string }) =>
          a.action_type === 'omni_complete_registration' || a.action_type === 'complete_registration',
      );
      if (conversionAction) {
        leads = Number(conversionAction.value || 0);
      }
    }

    // Calcula métricas
    const conversions = leads;
    const conversionRate = clicks > 0 ? (leads / clicks) * 100 : 0;
    const cpl = leads > 0 ? totalCost / leads : 0;
    const roi = totalCost > 0 ? ((totalConversionsValue - totalCost) / totalCost) * 100 : 0;

    const metrics: MetaLeadsMetrics = {
      leads,
      conversions,
      conversionRate: Number(conversionRate.toFixed(2)),
      cpl: Number(cpl.toFixed(2)),
      roi: Number(roi.toFixed(2)),
      totalCost: Number(totalCost.toFixed(2)),
      totalConversionsValue: Number(totalConversionsValue.toFixed(2)),
      clicks,
      impressions,
    };

    console.log(metrics);

    return NextResponse.json({
      success: true,
      adAccountId: formattedAdAccountId,
      period: 'LAST_30_DAYS',
      metrics,
      campaigns: activeCampaigns,
    });
  } catch (error) {
    console.error('Erro na rota Meta Leads:', error);
    return NextResponse.json(
      {
        error: 'Erro interno ao processar requisição',
        details: String(error),
      },
      { status: 500 },
    );
  }
}
