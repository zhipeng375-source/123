// Strict Fix based on Error Logs
// 修复了所有 Property 'X' does not exist 错误

export enum ProjectStatus {
  PLANNING = 'Planning',
  ONGOING = 'Ongoing', // 修复报错: Property 'ONGOING' missing
  BIDDING = 'Bidding', // 修复报错: Property 'BIDDING' missing
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  ON_HOLD = 'On Hold'
}

export enum TaskStatus {
  NOT_STARTED = 'Not Started', // 修复报错: Property 'NOT_STARTED' missing
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  PAUSED = 'Paused', // 修复报错: Property 'PAUSED' missing
  COMPLETED = 'Completed', // 修复报错: Property 'COMPLETED' missing
  DONE = 'Done'
}

export enum TaskPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export enum OpportunityStage {
  NEW = 'New',
  QUALIFIED = 'Qualified',
  PROPOSAL = 'Proposal',
  NEGOTIATION = 'Negotiation',
  WON = 'Closed Won', // 修复报错: Property 'WON' missing
  LOST = 'Closed Lost', // 修复报错: Property 'LOST' missing
  CLOSED_WON = 'Closed Won',
  CLOSED_LOST = 'Closed Lost'
}

export interface Task {
  id: string;
  name: string; // 修复报错: Property 'name' missing
  title?: string; // 兼容旧代码
  description?: string;
  status?: TaskStatus | string;
  priority?: TaskPriority | string;
  owner?: string; // 修复报错: Property 'owner' missing
  assignee?: string;
  startDate?: string; // 修复报错: Property 'startDate' missing
  endDate?: string; // 修复报错: Property 'endDate' missing
  actualCompletionDate?: string; // 修复报错: Property 'actualCompletionDate' missing
  notes?: string; // 修复报错: Property 'notes' missing
}

export interface Project {
  id: string;
  name: string;
  clientName?: string;
  description?: string;
  location?: string;
  value?: number;
  budget?: number;
  status?: ProjectStatus | string;
  startDate?: string;
  technicalSpecs?: string;
  tasks?: Task[];
  stage?: string;
}

export interface Opportunity {
  id?: string;
  projectName: string;
  clientName: string;
  location?: string;
  address?: string;
  description: string;
  expectedValue: number;
  source?: string;
  stage?: OpportunityStage | string;
  probability?: number;
  
  owner?: string; // 修复报错
  contactPerson?: string; // 修复报错
  phone?: string; // 修复报错
  email?: string; // 修复报错
  expectedSigningDate?: string; // 修复报错
  lastContactDate?: string; // 修复报错
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
