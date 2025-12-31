import React, { useState } from 'react';
import { X, Send, PenTool } from 'lucide-react';
import VoiceInput from './VoiceInput';

interface QuickCollectModalProps {
  onSave: (text: string) => void;
  onClose: () => void;
}

const QuickCollectModal: React.FC<QuickCollectModalProps> = ({ onSave, onClose }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSave(text);
      setText('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full md:max-w-lg md:rounded-2xl rounded-t-2xl shadow-2xl p-4 md:p-6 animate-slide-up">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <PenTool size={20} className="text-sl-600" /> 
            快速采集信息
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="relative mb-4">
            <textarea
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sl-500 focus:outline-none resize-none text-slate-800 text-base"
              rows={5}
              placeholder="请直接输入或语音录入项目线索、客户需求或会议纪要..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              autoFocus
            />
            <div className="absolute right-3 bottom-3">
               <VoiceInput onResult={(res) => setText(prev => prev + res)} />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={!text.trim()}
            className="w-full py-3 bg-sl-600 hover:bg-sl-700 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} /> 保存到商机待办
          </button>
        </form>
      </div>
      
      {/* Animation Styles */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default QuickCollectModal;