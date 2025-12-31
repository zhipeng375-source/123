import React, { useState } from 'react';
import { Opportunity, OpportunityStage } from '../types';
import { MoreHorizontal, User, DollarSign, Sparkles, LayoutGrid, List as ListIcon, Search, Plus, Phone, Calendar, Globe2, Loader2, ArrowRightCircle, Download, Bot, Target } from 'lucide-react';
import OpportunityModal from './OpportunityModal';
import { exportOpportunitiesToCSV } from '../services/exportService';
import DeepResearchModal from './DeepResearchModal';

interface OpportunityBoardProps {
  opportunities: Opportunity[];
  onAnalyze: (opp: Opportunity) => void;
}

const OpportunityBoard: React.FC<OpportunityBoardProps> = ({ opportunities: initialOpp, onAnalyze }) => {
  const [opportunities, setOpportunities] = useState(initialOpp);
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<Opportunity | null>(null);
  
  // AI Research State
  const [isDeepResearchOpen, setIsDeepResearchOpen] = useState(false);

  const stages = Object.values(OpportunityStage);

  const filteredOpps = opportunities.filter(o => 
    o.projectName.includes(searchTerm) || 
    o.clientName.includes(searchTerm) ||
    o.owner.includes(searchTerm)
  );

  const handleSaveOpp = (opp: Opportunity) => {
    let newOpps;
    if (editingOpp) {
       // Check if it was an existing one or a new one from AI lead (if it has ID it exists)
       const exists = opportunities.find(o => o.id === opp.id);
       if (exists) {
         newOpps = opportunities.map(o => o.id === opp.id ? opp : o);
       } else {
         newOpps = [...opportunities, opp];
       }
    } else {
       newOpps = [...opportunities, { ...opp, id: `new_${Date.now()}` }];
    }
    setOpportunities(newOpps);
    setIsModalOpen(false);
    setEditingOpp(null);
  };

  const handleImportLeads = (leads: Partial<Opportunity>[]) => {
    const newOpps = leads.map(lead => ({
      ...lead,
      id: `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      owner: 'AI Agent',
      contactPerson: '需调研',
      phone: '',
      email: '',
      lastContactDate: new Date().toISOString().split('T')[0]
    } as Opportunity));
    
    setOpportunities(prev => [...prev, ...newOpps]);
  };

  const getStageColor = (stage: OpportunityStage) => {
    switch (stage) {
      case OpportunityStage.NEW: return 'border-t-4 border-blue-400';
      case OpportunityStage.QUALIFIED: return 'border-t-4 border-indigo-400';
      case OpportunityStage.PROPOSAL: return 'border-t-4 border-purple-400';
      case OpportunityStage.NEGOTIATION: return 'border-t-4 border-amber-400';
      case OpportunityStage.WON: return 'border-t-4 border-emerald-500';
      case OpportunityStage.LOST: return 'border-t-4 border-slate-300';
    }
  };

  return (
    <div className="p-6 h-full flex flex-col overflow-hidden relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">商机管理</h2>
          <p className="text-slate-500 text-sm mt-1">跟踪销售线索与客户需求</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
             onClick={() => setIsDeepResearchOpen(true)}
             className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
          >
             <Bot size={18} /> Deep Research Agent
          </button>
          {opportunities.length > 0 && (
            <>
              <div className="h-6 w-px bg-slate-300 mx-1 hidden md:block"></div>
              <div className="bg-white p-1 rounded-lg border border-slate-200 flex hidden md:flex">
                 <button onClick={() => setViewMode('board')} className={`p-2 rounded-md ${viewMode === 'board' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400'}`}><LayoutGrid size={18} /></button>
                 <button onClick={() => setViewMode('list')} className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400'}`}><ListIcon size={18} /></button>
              </div>
              <div className="relative hidden sm:block">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input 
                   type="text" 
                   placeholder="搜索商机..." 
                   className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sl-500 w-32 md:w-48 transition-all focus:w-56"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
               </div>
              <button 
                 onClick={() => exportOpportunitiesToCSV(filteredOpps)}
                 className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors"
                 title="导出当前筛选商机"
               >
                 <Download size={18} />
               </button>
            </>
          )}
          <button 
            onClick={() => { setEditingOpp(null); setIsModalOpen(true); }}
            className="bg-sl-600 hover:bg-sl-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus size={18} /> <span className="hidden sm:inline">新增</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {opportunities.length === 0 ? (
          // Empty State
          <div className="h-full flex flex-col items-center justify-center animate-fade-in pb-20">
             <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <Target className="text-indigo-600" size={40} />
             </div>
             <h3 className="text-xl font-bold text-slate-800 mb-2">商机漏斗已清空</h3>
             <p className="text-slate-500 max-w-sm text-center mb-8 text-sm leading-relaxed">
               当前没有正在跟进的商机。您可以手动录入新的销售线索，或者使用 AI Agent 自动挖掘双良冷却系统的潜在项目。
             </p>
             <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg px-4">
                <button 
                  onClick={() => setIsDeepResearchOpen(true)}
                  className="flex-1 flex items-center gap-3 px-5 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all transform hover:-translate-y-1 group"
                >
                   <div className="bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-colors">
                     <Bot size={24} />
                   </div>
                   <div className="text-left">
                      <div className="font-bold text-sm">启动深度调研 Agent</div>
                      <div className="text-xs text-indigo-200 mt-0.5">自动搜索互联网项目</div>
                   </div>
                </button>
                <button 
                  onClick={() => { setEditingOpp(null); setIsModalOpen(true); }}
                  className="flex-1 flex items-center gap-3 px-5 py-4 bg-white border border-slate-200 hover:border-sl-400 hover:bg-slate-50 text-slate-700 rounded-xl shadow-sm transition-all group"
                >
                   <div className="bg-sl-50 p-2 rounded-lg text-sl-600 group-hover:bg-sl-100 transition-colors">
                     <Plus size={24} />
                   </div>
                   <div className="text-left">
                      <div className="font-bold text-sm">手动录入商机</div>
                      <div className="text-xs text-slate-400 mt-0.5">填写详细客户信息</div>
                   </div>
                </button>
             </div>
          </div>
        ) : (
          // Normal View
          viewMode === 'board' ? (
            <div className="flex h-full gap-4 overflow-x-auto pb-4">
              {stages.map(stage => (
                <div key={stage} className="w-80 flex flex-col bg-slate-100/50 rounded-xl border border-slate-200 flex-shrink-0">
                  <div className={`p-3 bg-white rounded-t-xl border-b border-slate-100 flex justify-between items-center ${getStageColor(stage)}`}>
                    <h3 className="font-semibold text-slate-700 text-sm">{stage}</h3>
                    <span className="bg-slate-100 text-slate-500 text-xs px-2 py-0.5 rounded-full">
                      {filteredOpps.filter(o => o.stage === stage).length}
                    </span>
                  </div>
                  
                  <div className="flex-1 p-3 overflow-y-auto space-y-3 no-scrollbar">
                    {filteredOpps.filter(o => o.stage === stage).map(opp => (
                      <div 
                          key={opp.id} 
                          onClick={() => { setEditingOpp(opp); setIsModalOpen(true); }}
                          className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer group relative"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-semibold text-sl-600 bg-sl-50 px-2 py-0.5 rounded">{opp.probability}% 赢率</span>
                          <button className="text-slate-300 hover:text-slate-500">
                            <MoreHorizontal size={16} />
                          </button>
                        </div>
                        <h4 className="font-medium text-slate-800 mb-1 line-clamp-2">{opp.projectName}</h4>
                        <p className="text-xs text-slate-500 mb-2 truncate">{opp.clientName}</p>
                        
                        <div className="flex items-center text-slate-600 text-sm mb-3 font-semibold">
                          <DollarSign size={14} className="mr-0.5" />
                          <span>{opp.expectedValue} 万</span>
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                          <div className="flex items-center text-xs text-slate-400">
                            <User size={14} className="mr-1" />
                            {opp.owner}
                          </div>
                          <div className="text-xs text-slate-400">
                            {new Date(opp.lastContactDate).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                          </div>
                        </div>
                        
                        {/* AI Button */}
                        <div className="absolute top-2 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button 
                                onClick={(e) => { e.stopPropagation(); onAnalyze(opp); }}
                                className="p-1.5 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100"
                                title="AI 智能分析"
                             >
                                <Sparkles size={14} />
                             </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-auto h-full">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3">项目名称</th>
                    <th className="px-6 py-3">客户信息</th>
                    <th className="px-6 py-3">阶段 & 赢率</th>
                    <th className="px-6 py-3">预计金额 (万)</th>
                    <th className="px-6 py-3">签约日期</th>
                    <th className="px-6 py-3">负责人</th>
                    <th className="px-6 py-3 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOpps.map(opp => (
                    <tr key={opp.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => { setEditingOpp(opp); setIsModalOpen(true); }}>
                      <td className="px-6 py-4">
                         <div className="font-medium text-slate-800">{opp.projectName}</div>
                         <div className="text-xs text-slate-400 mt-1 truncate max-w-xs">{opp.description || '无描述'}</div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="font-medium text-slate-700">{opp.clientName}</div>
                         <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                            {opp.contactPerson && <span className="flex items-center gap-0.5"><User size={12}/>{opp.contactPerson}</span>}
                            {opp.phone && <span className="flex items-center gap-0.5"><Phone size={12}/>{opp.phone}</span>}
                         </div>
                      </td>
                      <td className="px-6 py-4">
                         <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-xs font-medium mb-1">{opp.stage}</span>
                         <div className="text-xs text-slate-500">{opp.probability}% 赢率</div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-700">
                         ¥{opp.expectedValue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs">
                         <div className="flex items-center gap-1">
                            <Calendar size={14}/>
                            {opp.expectedSigningDate || '-'}
                         </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                         {opp.owner}
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button 
                           onClick={(e) => { e.stopPropagation(); onAnalyze(opp); }}
                           className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                           title="AI 分析"
                         >
                           <Sparkles size={16} />
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      {isModalOpen && (
        <OpportunityModal 
          opportunity={editingOpp} 
          onSave={handleSaveOpp} 
          onClose={() => { setIsModalOpen(false); setEditingOpp(null); }} 
        />
      )}

      {/* New Deep Research Modal */}
      {isDeepResearchOpen && (
        <DeepResearchModal 
          onClose={() => setIsDeepResearchOpen(false)}
          onImportLeads={handleImportLeads}
        />
      )}
    </div>
  );
};

export default OpportunityBoard;