import React, { useEffect, useState } from 'react';
import { Project, Opportunity, AnalysisResult } from '../types';
import { analyzeProjectRisk } from '../services/geminiService';
import { X, Loader2, ShieldAlert, CheckCircle2, Lightbulb, AlertTriangle } from 'lucide-react';

interface AnalysisModalProps {
  item: Project | Opportunity | null;
  onClose: () => void;
}

const AnalysisModal: React.FC<AnalysisModalProps> = ({ item, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    if (item) {
      setLoading(true);
      // Determine context based on type
      const isProject = 'status' in item;
      const context = isProject 
        ? "Analyze this ongoing project for technical risks, schedule delays, and budget overruns."
        : "Analyze this sales opportunity for win probability, competitor threats, and next best actions.";

      analyzeProjectRisk(item, context)
        .then(setResult)
        .finally(() => setLoading(false));
    }
  }, [item]);

  if (!item) return null;

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <SparklesIcon className="text-indigo-500" /> 
              AI 智能分析报告
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              对象: {'name' in item ? (item as Project).name : (item as Opportunity).projectName}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <Loader2 size={48} className="animate-spin text-sl-500 mb-4" />
              <p>Gemini 正在深入分析数据...</p>
              <p className="text-xs text-slate-400 mt-2">评估风险因素 • 生成策略建议 • 检查数据完整性</p>
            </div>
          ) : result ? (
            <div className="space-y-6">
              {/* Risk Level Badge */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">综合风险评估</span>
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getRiskColor(result.riskLevel)}`}>
                  {result.riskLevel === 'Low' ? '低风险' : result.riskLevel === 'Medium' ? '中等风险' : '高风险'}
                </span>
              </div>

              {/* Summary */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h4 className="text-sm font-semibold text-slate-800 mb-2 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-sl-600" /> 分析摘要
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {result.summary}
                </p>
              </div>

              {/* Suggestions */}
              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <Lightbulb size={16} className="text-amber-500" /> 策略建议
                </h4>
                <ul className="space-y-2">
                  {result.strategySuggestions.map((s, i) => (
                    <li key={i} className="flex items-start text-sm text-slate-600 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                      <span className="flex-shrink-0 w-5 h-5 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">{i + 1}</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Missing Info */}
              {result.missingInfo.length > 0 && (
                <div>
                   <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-orange-500" /> 需补充信息
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.missingInfo.map((info, i) => (
                      <span key={i} className="px-3 py-1 bg-orange-50 text-orange-700 text-xs rounded-full border border-orange-100">
                        {info}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-red-500">
              <ShieldAlert size={48} className="mx-auto mb-4" />
              <p>分析无法完成，请检查网络或 API 配置。</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
           <button 
             onClick={onClose}
             className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 text-sm font-medium transition-colors"
           >
             关闭
           </button>
        </div>
      </div>
    </div>
  );
};

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={`w-6 h-6 ${className}`}
  >
    <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM9 15a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5v-1.5A.75.75 0 019 15z" clipRule="evenodd" />
  </svg>
);

export default AnalysisModal;
