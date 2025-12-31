import React, { useState } from 'react';
import { Project, Opportunity, ProjectStatus } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { TrendingUp, Briefcase, Activity, AlertCircle, Plus, PenTool, FolderPlus, Settings, Share2 } from 'lucide-react';
import SettingsModal from './SettingsModal';

interface DashboardProps {
  projects: Project[];
  opportunities: Opportunity[];
}

const Dashboard: React.FC<DashboardProps> = ({ projects, opportunities }) => {
  const [showSettings, setShowSettings] = useState(false);
  
  // Empty State Handling
  if (projects.length === 0 && opportunities.length === 0) {
    return (
      <>
        <div className="p-6 md:p-12 flex flex-col items-center justify-center h-full animate-fade-in text-center relative">
          <div className="w-20 h-20 bg-gradient-to-br from-sl-400 to-sl-600 rounded-2xl flex items-center justify-center shadow-lg shadow-sl-200 mb-6 transform rotate-3 hover:rotate-6 transition-transform">
             <Briefcase size={40} className="text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">欢迎, Vacili Sun</h2>
          <p className="text-slate-500 max-w-md mb-8 text-base leading-relaxed">
            系统已就绪。当前数据库为空，您可以立即开始录入双良冷却系统的项目信息，或通过 AI 助手快速采集商机。
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md mb-8">
             <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-sl-300 transition-all cursor-pointer group flex flex-col items-center">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <FolderPlus size={20} />
                </div>
                <h3 className="font-bold text-slate-700 mb-1">新建项目</h3>
                <p className="text-xs text-slate-400">录入正式立项的工程</p>
             </div>

             <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-sl-300 transition-all cursor-pointer group flex flex-col items-center">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <PenTool size={20} />
                </div>
                <h3 className="font-bold text-slate-700 mb-1">快速采集</h3>
                <p className="text-xs text-slate-400">语音记录线索/会议纪要</p>
             </div>
          </div>

          <button 
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-2 text-slate-400 hover:text-sl-600 transition-colors text-sm px-4 py-2 rounded-full hover:bg-slate-100"
          >
             <Share2 size={16} />
             <span>获取手机访问链接</span>
          </button>
        </div>
        {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      </>
    );
  }

  const totalProjectValue = projects.reduce((acc, curr) => acc + curr.budget, 0);
  const potentialValue = opportunities.reduce((acc, curr) => acc + curr.expectedValue, 0);
  const activeProjects = projects.filter(p => p.status === ProjectStatus.ONGOING || p.status === ProjectStatus.BIDDING).length;
  const hotLeads = opportunities.filter(o => o.probability > 50).length;

  const statusData = [
    { name: '规划中', value: projects.filter(p => p.status === ProjectStatus.PLANNING).length, color: '#94a3b8' },
    { name: '投标中', value: projects.filter(p => p.status === ProjectStatus.BIDDING).length, color: '#f59e0b' },
    { name: '进行中', value: projects.filter(p => p.status === ProjectStatus.ONGOING).length, color: '#0ea5e9' },
    { name: '已完工', value: projects.filter(p => p.status === ProjectStatus.COMPLETED).length, color: '#10b981' },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800">管理仪表盘</h2>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <Briefcase size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">项目总金额</p>
            <p className="text-2xl font-bold text-slate-800">¥{(totalProjectValue / 10000).toFixed(2)}亿</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">商机潜在价值</p>
            <p className="text-2xl font-bold text-slate-800">¥{(potentialValue / 10000).toFixed(2)}亿</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">活跃项目</p>
            <p className="text-2xl font-bold text-slate-800">{activeProjects} <span className="text-sm font-normal text-slate-400">个</span></p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">重点跟进商机</p>
            <p className="text-2xl font-bold text-slate-800">{hotLeads} <span className="text-sm font-normal text-slate-400">个</span></p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">项目状态分布</h3>
          {projects.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={60} tick={{fontSize: 12}} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
              暂无图表数据
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">最近动态</h3>
          <div className="space-y-4">
             {opportunities.length > 0 ? opportunities.slice(0, 4).map(op => (
               <div key={op.id} className="flex items-start pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                  <div className={`w-2 h-2 mt-2 rounded-full mr-3 ${op.probability > 50 ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                  <div>
                    <p className="text-sm font-medium text-slate-800 truncate w-48">{op.projectName}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {op.stage} • 预计 ¥{op.expectedValue}万
                    </p>
                  </div>
               </div>
             )) : (
               <div className="text-center py-8 text-slate-400 text-sm">
                  暂无最新动态
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;