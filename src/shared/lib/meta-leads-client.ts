/**
 * Meta Leads API - Exemplos de Uso
 *
 * Este arquivo contém exemplos de como usar a API do Meta
 * após o usuário ter conectado sua conta.
 */

import { getMetaConnection, isMetaTokenExpired, MetaConnectionData } from '@/shared/lib/meta-oauth';

// ============================================================
// TYPES
// ============================================================

export interface MetaLeadGenForm {
  id: string;
  name: string;
  status: string;
  leads_count?: number;
  created_time: string;
}

export interface MetaLeadFieldData {
  name: string;
  values: string[];
}

export interface MetaLead {
  id: string;
  created_time: string;
  ad_id?: string;
  ad_name?: string;
  adset_id?: string;
  adset_name?: string;
  campaign_id?: string;
  campaign_name?: string;
  form_id?: string;
  field_data: MetaLeadFieldData[];
  is_organic?: boolean;
}

export interface MetaPageInfo {
  id: string;
  name: string;
  username?: string;
  followers_count?: number;
  fan_count?: number;
  link?: string;
}

export interface MetaCampaign {
  id: string;
  name: string;
  status: string;
  objective?: string;
  daily_budget?: string;
}

export interface FormattedLead {
  externalId: string;
  source: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  metadata: {
    adId?: string;
    adName?: string;
    adsetId?: string;
    adsetName?: string;
    campaignId?: string;
    campaignName?: string;
    formId?: string;
    isOrganic?: boolean;
    rawFieldData: Record<string, string>;
  };
}

/**
 * Cliente para interagir com Meta Graph API
 */
export class MetaLeadsClient {
  private connection: MetaConnectionData | null;

  constructor() {
    this.connection = getMetaConnection();
  }

  /**
   * Verifica se há uma conexão válida
   */
  isConnected(): boolean {
    if (!this.connection) return false;
    return !isMetaTokenExpired();
  }

  /**
   * Obtém o access token
   */
  private getAccessToken(): string {
    if (!this.connection) {
      throw new Error('Meta não está conectado');
    }
    if (isMetaTokenExpired()) {
      throw new Error('Token do Meta expirou. Reconecte sua conta.');
    }
    return this.connection.tokens.access_token;
  }

  /**
   * Busca todos os formulários de lead da conta de anúncios
   */
  async getLeadGenForms(): Promise<MetaLeadGenForm[]> {
    const token = this.getAccessToken();
    const adAccountId = this.connection?.accountData.ad_account_id;

    if (!adAccountId) {
      throw new Error('Conta de anúncios não configurada');
    }

    const url = `https://graph.facebook.com/v21.0/${adAccountId}/leadgen_forms?access_token=${token}&fields=id,name,status,leads_count,created_time`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      throw new Error(`Erro ao buscar formulários: ${data.error.message}`);
    }

    return data.data || [];
  }

  /**
   * Busca leads de um formulário específico
   */
  async getLeadsFromForm(formId: string, limit = 100): Promise<MetaLead[]> {
    const token = this.getAccessToken();

    const url = `https://graph.facebook.com/v21.0/${formId}/leads?access_token=${token}&limit=${limit}&fields=id,created_time,field_data`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      throw new Error(`Erro ao buscar leads: ${data.error.message}`);
    }

    return data.data || [];
  }

  /**
   * Busca detalhes de um lead específico
   */
  async getLeadDetails(leadId: string): Promise<MetaLead> {
    const token = this.getAccessToken();

    const url = `https://graph.facebook.com/v21.0/${leadId}?access_token=${token}&fields=id,created_time,ad_id,ad_name,adset_id,adset_name,campaign_id,campaign_name,form_id,field_data,is_organic`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      throw new Error(`Erro ao buscar lead: ${data.error.message}`);
    }

    return data;
  }

  /**
   * Busca informações da página conectada
   */
  async getPageInfo(): Promise<MetaPageInfo> {
    const token = this.getAccessToken();
    const pageId = this.connection?.accountData.page_id;

    if (!pageId) {
      throw new Error('Página não configurada');
    }

    const url = `https://graph.facebook.com/v21.0/${pageId}?access_token=${token}&fields=id,name,username,followers_count,fan_count,link`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      throw new Error(`Erro ao buscar página: ${data.error.message}`);
    }

    return data;
  }

  /**
   * Busca campanhas ativas da conta de anúncios
   */
  async getActiveCampaigns(): Promise<MetaCampaign[]> {
    const token = this.getAccessToken();
    const adAccountId = this.connection?.accountData.ad_account_id;

    if (!adAccountId) {
      throw new Error('Conta de anúncios não configurada');
    }

    const url = `https://graph.facebook.com/v21.0/${adAccountId}/campaigns?access_token=${token}&fields=id,name,status,objective,daily_budget&filtering=[{"field":"status","operator":"IN","value":["ACTIVE","PAUSED"]}]`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      throw new Error(`Erro ao buscar campanhas: ${data.error.message}`);
    }

    return data.data || [];
  }

  /**
   * Formata dados do lead para o formato do CRM
   */
  formatLeadForCRM(lead: MetaLead): FormattedLead {
    const fieldData = lead.field_data || [];
    const formattedData: Record<string, string> = {};

    // Converte field_data para objeto chave-valor
    fieldData.forEach((field: MetaLeadFieldData) => {
      formattedData[field.name] = field.values[0] || '';
    });

    return {
      externalId: lead.id,
      source: 'meta_lead_ads',
      createdAt: lead.created_time,
      // Campos comuns de leads
      name: formattedData.full_name || formattedData.first_name || '',
      email: formattedData.email || '',
      phone: formattedData.phone_number || formattedData.phone || '',
      // Metadados
      metadata: {
        adId: lead.ad_id,
        adName: lead.ad_name,
        adsetId: lead.adset_id,
        adsetName: lead.adset_name,
        campaignId: lead.campaign_id,
        campaignName: lead.campaign_name,
        formId: lead.form_id,
        isOrganic: lead.is_organic,
        rawFieldData: formattedData,
      },
    };
  }
}

// ============================================================
// EXEMPLOS DE USO
// ============================================================

/**
 * Exemplo 1: Buscar e exibir todos os formulários
 */
export async function exampleGetForms() {
  const client = new MetaLeadsClient();

  if (!client.isConnected()) {
    console.error('Meta não está conectado');
    return;
  }

  try {
    const forms = await client.getLeadGenForms();
    console.log('Formulários encontrados:', forms);
    return forms;
  } catch (error) {
    console.error('Erro:', error);
  }
}

/**
 * Exemplo 2: Buscar leads de um formulário específico
 */
export async function exampleGetLeads(formId: string) {
  const client = new MetaLeadsClient();

  if (!client.isConnected()) {
    console.error('Meta não está conectado');
    return;
  }

  try {
    const leads = await client.getLeadsFromForm(formId);
    console.log('Leads encontrados:', leads);

    // Formata leads para o CRM
    const formattedLeads = leads.map((lead) => client.formatLeadForCRM(lead));
    console.log('Leads formatados:', formattedLeads);

    return formattedLeads;
  } catch (error) {
    console.error('Erro:', error);
  }
}

/**
 * Exemplo 3: Sincronizar todos os leads de todos os formulários
 */
export async function exampleSyncAllLeads() {
  const client = new MetaLeadsClient();

  if (!client.isConnected()) {
    throw new Error('Meta não está conectado');
  }

  try {
    // 1. Busca todos os formulários
    const forms = await client.getLeadGenForms();
    console.log(`Encontrados ${forms.length} formulários`);

    const allLeads = [];

    // 2. Para cada formulário, busca os leads
    for (const form of forms) {
      console.log(`Buscando leads do formulário: ${form.name}`);
      const leads = await client.getLeadsFromForm(form.id);

      // 3. Formata e adiciona à lista
      const formattedLeads = leads.map((lead) => ({
        ...client.formatLeadForCRM(lead),
        formName: form.name,
      }));

      allLeads.push(...formattedLeads);
    }

    console.log(`Total de leads sincronizados: ${allLeads.length}`);

    // 4. Aqui você enviaria para o backend
    // await api.post('/leads/bulk-create', { leads: allLeads });

    return allLeads;
  } catch (error) {
    console.error('Erro ao sincronizar leads:', error);
    throw error;
  }
}

/**
 * Exemplo 4: Hook React para usar em componentes
 */
export function useMetaLeads() {
  const client = new MetaLeadsClient();

  return {
    isConnected: client.isConnected(),
    getForms: () => client.getLeadGenForms(),
    getLeads: (formId: string) => client.getLeadsFromForm(formId),
    getLeadDetails: (leadId: string) => client.getLeadDetails(leadId),
    getPageInfo: () => client.getPageInfo(),
    getCampaigns: () => client.getActiveCampaigns(),
    syncAllLeads: () => exampleSyncAllLeads(),
  };
}
