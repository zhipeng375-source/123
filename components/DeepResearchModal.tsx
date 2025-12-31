import React, { useState, useEffect, useRef } from 'react';
import { Chat } from "@google/genai";
import { Opportunity, ChatMessage, OpportunityStage } from '../types';
import { createResearchChat, MockChat } from '../services/geminiService';
import { X, Send, Bot, User, Sparkles, Plus, Loader2, Globe, BrainCircuit } from 'lucide-react';
import VoiceInput from './VoiceInput';

interface DeepResearchModalProps {
  onClose: () => void;
  onImportLeads: (leads: Partial<Opportunity>[]) => void;
}

const DeepResearchModal: React.FC<DeepResearchModalProps> = ({ onClose, onImportLeads }) => {
  const [chatSession, setChatSession] = useState<Chat | MockChat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [extractedLeads, setExtractedLeads] = useState<Partial<Opportunity>[]>([]);
  const [isMockMode, setIsMockMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Chat
    try {
      const chat = createResearchChat();
      setChatSession(chat);
      setMessages([
        { role: 'model', text: '你好！我是双良商机挖掘 Agent。请告诉我你想调研的区域或行业（例如：“搜集俄罗斯最近的化工项目” 或 “查找国内新建数据中心”）。' }
      ]);
    } catch (e: any) {
      if (e.message === 'API_KEY_MISSING') {
        console.warn("Using Mock Chat");
        setIsMockMode(true);
        setChatSession(new MockChat());
        setMessages([
          { role: 'model', text: '【演示模式】API Key 未配置。已启动模拟 Agent，您可以输入“查找俄罗斯项目”来体验功能。' }
        ]);
      } else {
        setMessages([{ role: 'model', text: `启动失败: ${e.message}` }]);
      }
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || !chatSession) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      // Send message to Gemini (or Mock)
      // @ts-ignore - MockChat has compatible signature
      const result = await chatSession.sendMessage({ message: userMsg });
      
      // 1. Handle Function Calls (Extracted Leads)
      const functionCalls = result.functionCalls;
      if (functionCalls && functionCalls.length > 0) {
        const newLeads: Partial<Opportunity>[] = [];
        
        // Execute tool responses
        const functionResponses = functionCalls.map((call: any) => {
           if (call.name === 'saveOpportunity') {
             const args = call.args as any;
             newLeads.push({
               projectName: args.projectName,
               clientName: args.clientName,
               address: args.location,
               description: args.description,
               expectedValue: args.expectedValue || 5000,
               source: `AI 深度调研: ${args.sourceUrl || 'Web'}`,
               stage: OpportunityStage.NEW,
               probability: 20
             });
             return {
               id: call.id,
               name: call.name,
               response: { status: 'success', saved: true }
             };
           }
           return { id: call.id, name: call.name, response: {} };
        });

        // Update UI with new leads
        if (newLeads.length > 0) {
          setExtractedLeads(prev => [...prev, ...newLeads]);
        }

        // Send tool response back to model
        // @ts-ignore
        const finalResponse = await chatSession.sendToolResponse({ functionResponses });
        setMessages(prev => [...prev, { role: 'model', text: finalResponse.text || '已为您整理上述商机。' }]);

      } else {
        // Normal text response
        setMessages(prev => [...prev, { role: 'model', text: result.text || '未能获取相关信息。' }]);
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: '连接超时或 API 错误。请稍后再试。' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const importLead = (lead: Partial<Opportunity>) => {
    onImportLeads([lead]);
    setExtractedLeads(prev => prev.filter(l => l !== lead)); // Remove from list after import
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-6xl h-[85vh] rounded-2xl shadow-2xl flex overflow-hidden border border-slate-200">
        
        {/* Left Side: Chat Interface */}
        <div className="flex-1 flex flex-col bg-slate-50 border-r border-slate-200">
          {/* Header */}
          <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
               <div className={`p-2 rounded-lg ${isMockMode ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
                 <BrainCircuit size={20} />
               </div>
               <div>
                 <h3 className="font-bold text-slate-800">Deep Research Agent {isMockMode && <span className="text-xs font-normal text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">演示模式</span>}</h3>
                 <p className="text-xs text-slate-500 flex items-center gap-1">
                   <Globe size={10} /> Google Search Grounding Enabled
                 </p>
               </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-indigo-600 text-white'}`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'bg-white border border-slate-200 text-slate-800 rounded-tr-none' : 'bg-white border border-indigo-100 text-slate-800 shadow-sm rounded-tl-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                 <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center flex-shrink-0"><Bot size={16} /></div>
                 <div className="bg-white border border-indigo-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2 text-sm text-indigo-600">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="font-medium">深度思考与搜索中...</span>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-200">
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="输入调研指令，例如：调研俄罗斯远东地区最近半年的新建化工厂项目..."
                className="w-full pl-4 pr-12 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none h-14 max-h-32 shadow-sm text-sm"
              />
              <div className="absolute right-2 top-2 flex flex-col gap-1">
                 <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={18} />
                </button>
                <VoiceInput 
                   onResult={(text) => setInput(prev => prev + text)} 
                   className="hover:bg-slate-100"
                />
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-center">
              Agent 将自动调用 Google 搜索并提取关键项目信息至右侧列表
            </p>
          </div>
        </div>

        {/* Right Side: Extracted Leads */}
        <div className="w-[400px] bg-white flex flex-col">
           <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50">
             <div className="flex items-center gap-2 text-indigo-900 font-bold">
               <Sparkles size={18} className="text-indigo-500" />
               已提取商机 ({extractedLeads.length})
             </div>
             <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
               <X size={20} />
             </button>
           </div>

           <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
             {extractedLeads.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center border-2 border-dashed border-slate-200 rounded-xl m-4">
                 <Bot size={48} className="mb-4 text-slate-200" />
                 <p className="text-sm font-medium">暂无提取数据</p>
                 <p className="text-xs mt-1">请在左侧对话框中指示 Agent 搜索特定项目，它会自动为您整理卡片。</p>
               </div>
             ) : (
               extractedLeads.map((lead, idx) => (
                 <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group relative animate-fade-in-up">
                    <h4 className="font-bold text-slate-800 text-sm mb-1 pr-6">{lead.projectName}</h4>
                    <p className="text-xs text-slate-500 mb-2">{lead.clientName}</p>
                    <div className="text-xs bg-slate-100 p-2 rounded mb-3 text-slate-600 leading-relaxed">
                       {lead.description}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                       <span className="text-xs font-bold text-indigo-600">预估 ¥{lead.expectedValue}万</span>
                       <button 
                         onClick={() => importLead(lead)}
                         className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-full transition-colors"
                       >
                         <Plus size={14} /> 入库
                       </button>
                    </div>
                 </div>
               ))
             )}
           </div>
        </div>

      </div>
    </div>
  );
};

// Helper style for animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up {
    animation: fadeInUp 0.3s ease-out forwards;
  }
`;
document.head.appendChild(style);

export default DeepResearchModal;