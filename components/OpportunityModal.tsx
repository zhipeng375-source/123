import React, { useState, useEffect } from 'react';
import { Opportunity, OpportunityStage } from '../types';
import { X, Building2, UserCircle, Briefcase, Calendar } from 'lucide-react';
import VoiceInput from './VoiceInput';

interface OpportunityModalProps {
  opportunity: Opportunity | null;
  onSave: (opp: Opportunity) => void;
  onClose: () => void;
}

const OpportunityModal: React.FC<OpportunityModalProps> = ({ opportunity, onSave, onClose }) => {
  // Initialize with safe defaults
  const initialData: Partial<Opportunity> = {
    projectName: '',
    clientName: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    source: '',
    description: '',
    expectedValue: 0,
    stage: OpportunityStage.NEW,
    probability: 10,
    expectedSigningDate: '',
    owner: '',
    lastContactDate: new Date().toISOString().split('T')[0]
  };

  const [formData, setFormData] = useState<Partial<Opportunity>>(initialData);

  useEffect(() => {
    if (opportunity) {
      setFormData(opportunity);
    }
  }, [opportunity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.projectName && formData.clientName) {
      onSave(formData as Opportunity);
    }
  };

  const handleVoiceInput = (field: keyof Opportunity, text: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] ? `${prev[field]} ` : '') + text
    }));
  };

  const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
    <div className="flex items-center gap-2 text-sl-600 font-semibold text-sm border-b border-slate-100 pb-2 mb-4 mt-2">
      <Icon size={16} /> {title}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-fade-in md:p-4">
      <div className="bg-white w-full h-full md:h-auto md:max-h-[90vh] md:w-full md:max-w-2xl md:rounded-2xl shadow-xl overflow-y-auto flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-10 flex-shrink-0">
          <h3 className="text-lg font-bold text-slate-800">{opportunity ? '编辑商机详情' : '录入新商机'}</h3>
          <button onClick={onClose}><X size={24} className="text-slate-400 hover:text-slate-600" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Basic Info */}
          <div>
            <SectionHeader icon={Briefcase} title="项目概况" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1 md:col-span-2">
                <label className="label-text">项目名称 <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input 
                    type="text" required
                    className="input-field pr-10"
                    value={formData.projectName}
                    onChange={e => setFormData({...formData, projectName: e.target.value})}
                    placeholder="例如：新建厂房冷却系统一期"
                  />
                  <div className="absolute right-1 top-1/2 -translate-y-1/2">
                    <VoiceInput onResult={(text) => handleVoiceInput('projectName', text)} />
                  </div>
                </div>
              </div>
              <div>
                 <label className="label-text">预计金额 (万)</label>
                 <input 
                   type="number"
                   className="input-field"
                   value={formData.expectedValue}
                   onChange={e => setFormData({...formData, expectedValue: Number(e.target.value)})}
                 />
              </div>
              <div>
                 <label className="label-text">商机阶段</label>
                 <select 
                   className="input-field bg-white"
                   value={formData.stage}
                   onChange={e => setFormData({...formData, stage: e.target.value as OpportunityStage})}
                 >
                    {Object.values(OpportunityStage).map(s => <option key={s} value={s}>{s}</option>)}
                 </select>
              </div>
            </div>
          </div>

          {/* Client Info */}
          <div>
            <SectionHeader icon={Building2} title="客户信息" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="col-span-1 md:col-span-2">
                  <label className="label-text">客户名称 <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input 
                      type="text" required
                      className="input-field pr-10"
                      value={formData.clientName}
                      onChange={e => setFormData({...formData, clientName: e.target.value})}
                    />
                    <div className="absolute right-1 top-1/2 -translate-y-1/2">
                      <VoiceInput onResult={(text) => handleVoiceInput('clientName', text)} />
                    </div>
                  </div>
               </div>
               <div>
                  <label className="label-text">联系人</label>
                  <input 
                    type="text" className="input-field"
                    value={formData.contactPerson}
                    onChange={e => setFormData({...formData, contactPerson: e.target.value})}
                  />
               </div>
               <div>
                  <label className="label-text">联系电话</label>
                  <input 
                    type="tel" className="input-field"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
               </div>
               <div>
                  <label className="label-text">电子邮箱</label>
                  <input 
                    type="email" className="input-field"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
               </div>
               <div>
                  <label className="label-text">商机来源</label>
                  <input 
                    type="text" className="input-field"
                    value={formData.source}
                    onChange={e => setFormData({...formData, source: e.target.value})}
                    placeholder="如：展会、转介绍..."
                  />
               </div>
               <div className="col-span-1 md:col-span-2">
                  <label className="label-text">公司地址</label>
                  <input 
                    type="text" className="input-field"
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                  />
               </div>
            </div>
          </div>

          {/* Details & Sales */}
          <div>
            <SectionHeader icon={UserCircle} title="销售跟进" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className="label-text">负责人</label>
                  <input 
                    type="text" className="input-field"
                    value={formData.owner}
                    onChange={e => setFormData({...formData, owner: e.target.value})}
                  />
               </div>
               <div>
                  <label className="label-text">赢单概率 (%)</label>
                  <input 
                    type="number" min="0" max="100" className="input-field"
                    value={formData.probability}
                    onChange={e => setFormData({...formData, probability: Number(e.target.value)})}
                  />
               </div>
               <div>
                  <label className="label-text">预计签约日期</label>
                  <input 
                    type="date" className="input-field"
                    value={formData.expectedSigningDate}
                    onChange={e => setFormData({...formData, expectedSigningDate: e.target.value})}
                  />
               </div>
               <div>
                  <label className="label-text">最后联系日期</label>
                  <input 
                    type="date" className="input-field"
                    value={formData.lastContactDate}
                    onChange={e => setFormData({...formData, lastContactDate: e.target.value})}
                  />
               </div>
               <div className="col-span-1 md:col-span-2">
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="label-text mb-0">客户需求描述</label>
                    <VoiceInput onResult={(text) => handleVoiceInput('description', text)} />
                  </div>
                  <textarea 
                    rows={3} className="input-field"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="描述客户的核心痛点、技术要求等..."
                  />
               </div>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-auto flex-shrink-0 bg-white pb-6 md:pb-0">
             <button type="button" onClick={onClose} className="px-5 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg font-medium">取消</button>
             <button type="submit" className="px-5 py-2.5 bg-sl-600 hover:bg-sl-700 text-white rounded-lg font-medium shadow-sm transition-colors">保存信息</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Helper CSS class
const style = document.createElement('style');
style.textContent = `
  .label-text { @apply block text-xs font-semibold text-slate-600 mb-1.5; }
  .input-field { @apply w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sl-500 focus:outline-none text-sm text-slate-800 placeholder-slate-400; }
`;
document.head.appendChild(style);

export default OpportunityModal;
