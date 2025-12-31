import React, { useState, useEffect } from 'react';
import { NewsItem, Opportunity, OpportunityStage } from '../types';
import { fetchWeeklyRussianNews } from '../services/geminiService';
import { RefreshCw, ArrowRight, ExternalLink, Flame, Factory, Zap, Radio, Loader2, Calendar, PlusCircle, Info } from 'lucide-react';

interface NewsFeedProps {
  onConvert: (news: NewsItem) => void;
}

const NewsFeed: React.FC<NewsFeedProps> = ({ onConvert }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    const data = await fetchWeeklyRussianNews();
    setNews(data);
    setLastUpdated(new Date().toLocaleString('zh-CN'));
    setLoading(false);
  };

  // Simulate loading initial data if empty
  useEffect(() => {
    if (news.length === 0) {
      // In a real app, we might check local storage or a backend first
      // fetchNews(); 
    }
  }, []);

  const getSectorIcon = (sector: string) => {
    switch (sector) {
      case 'Waste-to-Energy': return <Flame size={18} className="text-orange-500" />;
      case 'Petrochemical': return <Factory size={18} className="text-purple-500" />;
      case 'Power': return <Zap size={18} className="text-yellow-500" />;
      default: return <Radio size={18} className="text-blue-500" />;
    }
  };

  const getSectorLabel = (sector: string) => {
    switch (sector) {
      case 'Waste-to-Energy': return '垃圾焚烧 / 环保';
      case 'Petrochemical': return '石油化工';
      case 'Power': return '火电 / CCGT';
      default: return '其他工业';
    }
  };

  return (
    <div className="p-6 h-full flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Radio className="text-red-600" /> 俄语区市场情报周报
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            每周自动扫描俄罗斯及独联体国家重点项目动态 (焚烧、电站、石化)
          </p>
        </div>
        
        <div className="flex items-center gap-4">
           {lastUpdated && <span className="text-xs text-slate-400">上次更新: {lastUpdated}</span>}
           <button 
             onClick={fetchNews}
             disabled={loading}
             className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors disabled:opacity-70"
           >
             {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
             获取最新情报
           </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center text-slate-500">
            <Loader2 size={48} className="animate-spin text-indigo-500 mb-4" />
            <p className="font-medium text-lg">AI 正在扫描全网资讯...</p>
            <p className="text-sm mt-2 text-slate-400">目标关键词: Waste-to-Energy, CCGT Russia, Petrochemical New Build</p>
          </div>
        ) : news.length === 0 ? (
          <div className="h-96 flex flex-col items-center justify-center bg-white rounded-2xl border border-dashed border-slate-300 mx-auto max-w-2xl">
            <div className="p-4 bg-slate-50 rounded-full mb-4">
              <Radio size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-700">本周情报尚未生成</h3>
            <p className="text-slate-500 text-sm mt-2 mb-6">点击右上角按钮开始 AI 自动搜寻</p>
            <button 
             onClick={fetchNews}
             className="px-6 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg font-medium text-sm transition-colors"
           >
             立即扫描
           </button>
          </div>
        ) : (
          <>
            {/* Disclaimer for demo/mock data if needed - implied if data source contains '模拟' */}
            {news.some(n => n.source.includes('模拟')) && (
               <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-2 text-xs text-amber-800">
                 <Info size={16} />
                 <span>当前展示为演示数据。配置有效 API Key 后将启用实时搜索功能。</span>
               </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {news.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full group">
                <div className="p-5 flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                      {getSectorIcon(item.sector)}
                      {getSectorLabel(item.sector)}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar size={12} /> {item.date}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-slate-800 text-lg mb-2 leading-tight group-hover:text-indigo-700 transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed line-clamp-4">
                    {item.summary}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-auto">
                    <span>来源: {item.source}</span>
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noreferrer" className="flex items-center hover:text-indigo-600 transition-colors">
                        <ExternalLink size={10} className="ml-1" />
                      </a>
                    )}
                  </div>
                </div>
                
                <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-xl flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-medium">发现潜在商机?</span>
                  <button 
                    onClick={() => onConvert(item)}
                    className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <PlusCircle size={16} /> 转化为商机
                  </button>
                </div>
              </div>
            ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NewsFeed;