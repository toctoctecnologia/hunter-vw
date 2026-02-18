export interface ConnectorSettings {
  credentials: Record<string, string>;
  mapping: { remote: string; local: string }[];
  autoSync: boolean;
  frequency: string;
  lastRun: string | null;
  nextRun: string | null;
}

export interface Connector {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  ativo: boolean;
  categoria: string;
  docUrl: string;
  logoUrl?: string;
  appPath?: string;
  credentialsSchema: Record<string, unknown>;
  defaultMapping: Record<string, string>;
  updatedAt?: string;
  updated_at?: string;
  settings?: ConnectorSettings;
}

import connectorsData from './connectors.json';

export const connectors: Connector[] = connectorsData as Connector[];

export default connectors;
