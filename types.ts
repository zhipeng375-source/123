// 全量补全版 types.ts - 修复所有 TS 报错

// 1. 枚举定义 (Enums)
export enum ProjectStatus {
  PLANNING = 'Planning',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  ON_HOLD = 'On Hold'
}

export enum TaskStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
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
  CLOSED_WON = 'Closed Won',
  CLOSED_LOST = 'Closed Lost',
  WON = 'Closed Won', // 兼容性别名
  LOST = 'Closed Lost' // 兼容性别名
}

// 2. 接口定义 (Interfaces)

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus | string;
  priority: TaskPriority | string;
  assignee?: string;
  dueDate?: string;
}

export interface Project {
  id: string;
  name: string;
  clientName?: string;     // 修复: Property 'clientName' missing
  description?: string;
  location?: string;
  value?: number;
  budget?: number;         // 修复: Property 'budget' missing
  status?: ProjectStatus | string; // 修复: Property 'status' missing
  startDate?: string;      // 修复: Property 'startDate' missing
  technicalSpecs?: string; // 修复: Property 'technicalSpecs' missing
  tasks?: Task[];          // 修复: Property 'tasks' missing
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
  
  // 修复: 补全缺失的联系人和所有者字段
  owner?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  expectedSigningDate?: string;
  lastContactDate?: string;
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
