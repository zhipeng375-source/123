export interface Project {
  id: string;
  name: string;
  description?: string;
  location?: string;
  client?: string;
  value?: number;
  stage?: string;
}

export interface Opportunity {
  id?: string;
  projectName: string;
  clientName: string;
  location?: string;
  address?: string; // Compatible alias
  description: string;
  expectedValue: number;
  source?: string;
  stage?: string;
  probability?: number;
}

export enum OpportunityStage {
  NEW = 'New',
  QUALIFIED = 'Qualified',
  PROPOSAL = 'Proposal',
  NEGOTIATION = 'Negotiation',
  CLOSED_WON = 'Closed Won',
  CLOSED_LOST = 'Closed Lost'
}

export interface AnalysisResult {
  riskLevel: 'Low' | 'Medium' | 'High';
  summary: string;
  strategySuggestions: string[];
  missingInfo: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  source: string;
  url: string;
  sector: string;
  isRead: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
