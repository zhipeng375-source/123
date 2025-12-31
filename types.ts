export enum ProjectStatus {
  PLANNING = '规划中',
  BIDDING = '投标中',
  ONGOING = '进行中',
  COMPLETED = '已完工',
  HALTED = '暂停'
}

export enum TaskStatus {
  NOT_STARTED = '未开始',
  IN_PROGRESS = '进行中',
  COMPLETED = '已完成',
  PAUSED = '已暂停'
}

export enum TaskPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export interface Task {
  id: string;
  name: string;
  owner: string;
  startDate: string;
  endDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  actualCompletionDate?: string;
  notes?: string;
}

export enum OpportunityStage {
  NEW = '线索发现',
  QUALIFIED = '需求确认',
  PROPOSAL = '方案报价',
  NEGOTIATION = '商务谈判',
  WON = '赢单',
  LOST = '输单'
}

export interface Project {
  id: string;
  name: string;
  clientName: string;
  location: string;
  budget: number; // in Wan RMB
  status: ProjectStatus;
  startDate: string;
  description: string;
  technicalSpecs: string; // e.g., "Absorption Chiller, 2000RT"
  tasks: Task[];
}

export interface Opportunity {
  id: string;
  projectId?: string; // Links to a potential project
  projectName: string;
  
  // Contact & Client Info
  clientName: string; // New field for clarity if project not linked yet
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  
  // Business Info
  source?: string;
  description?: string; // Needs description
  expectedValue: number;
  stage: OpportunityStage;
  probability: number; // 0-100
  expectedSigningDate?: string;
  owner: string;
  lastContactDate: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  source: string;
  url?: string;
  sector: 'Waste-to-Energy' | 'Power' | 'Petrochemical' | 'Other';
  isRead: boolean;
}

export interface AnalysisResult {
  riskLevel: 'Low' | 'Medium' | 'High';
  summary: string;
  strategySuggestions: string[];
  missingInfo: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}