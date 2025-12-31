import React, { useState, useEffect } from 'react';
import { Project, ProjectStatus } from '../types';
import { X, Building2, MapPin, Calendar, Wrench } from 'lucide-react';
import VoiceInput from './VoiceInput';

interface ProjectModalProps {
  project: Project | null;
  onSave: (project: Project) => void;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onSave, onClose }) => {
  const initialData: Partial<Project> = {
    name: '',
    clientName: '',
    location: '',
    budget: 0,
    status: ProjectStatus.PLANNING,
    startDate: new Date().toISOString().split('T')[0],
    description: '',
    technicalSpecs: '',
    tasks: []
  };

  const [formData, setFormData] = useState<Partial<Project>>(initialData);

  useEffect(() => {
    if (project) {
      setFormData(project);
    }
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.clientName) {
      // Ensure tasks is initialized
      const finalData = { ...formData, tasks: formData.tasks || [] } as Project;
      onSave(finalData);
    }
  };

  const handleVoiceInput = (field: keyof Project, text: string) => {
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
      {/* Modal Container: Full screen on mobile, centered rounded on desktop */}
      <div className="bg-white w-full h-full md:h-auto md:max-h-[90vh] md:w-full md:max-w-2xl md:rounded-2xl shadow-xl overflow-y-auto flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-10 flex-shrink-0">
          <h3 className="text-lg font-bold text-slate-800">{project ? '编辑项目' : '新建项目'}</h3>
          <button onClick={onClose}><X size={24} className="text-slate-400 hover:text-slate-600" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Basic Info */}
          <div>
            <SectionHeader icon={Building2} title="基本信息" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1 md:col-span-2">
                <label className="label-text">项目名称 <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input 
                    type="text" required
                    className="input-field pr-10"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="例如：新建数据中心冷却系统一期"
                  />
                  <div className="absolute right-1 top-1/2 -translate-y-1/2">
                    <VoiceInput onResult={(text) => handleVoiceInput('name', text)} />
                  </div>
                </div>
              </div>
              <div>
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
                 <label className="label-text">项目预算 (万)</label>
                 <input 
                   type="number"
                   className="input-field"
                   value={formData.budget}
                   onChange={e => setFormData({...formData, budget: Number(e.target.value)})}
                 />
              </div>
              <div>
                 <label className="label-text">项目状态</label>
                 <select 
                   className="input-field bg-white"
                   value={formData.status}
                   onChange={e => setFormData({...formData, status: e.target.value as ProjectStatus})}
                 >
                    {Object.values(ProjectStatus).map(s => <option key={s} value={s}>{s}</option>)}
                 </select>
              </div>
              <div>
                  <label className="label-text">启动日期</label>
                  <input 
                    type="date" className="input-field"
                    value={formData.startDate}
                    onChange={e => setFormData({...formData, startDate: e.target.value})}
                  />
               </div>
            </div>
          </div>

          {/* Location & Specs */}
          <div>
            <SectionHeader icon={MapPin} title="地点与技术" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className="label-text">项目地点</label>
                  <div className="relative">
                    <input 
                      type="text" className="input-field pr-10"
                      value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                    />
                     <div className="absolute right-1 top-1/2 -translate-y-1/2">
                      <VoiceInput onResult={(text) => handleVoiceInput('location', text)} />
                     </div>
                  </div>
               </div>
               <div className="col-span-1 md:col-span-2">
                  <label className="label-text">关键技术参数</label>
                  <div className="relative">
                    <input 
                      type="text" className="input-field pr-10"
                      value={formData.technicalSpecs}
                      onChange={e => setFormData({...formData, technicalSpecs: e.target.value})}
                      placeholder="例如：溴化锂机组, 磁悬浮..."
                    />
                     <div className="absolute right-1 top-1/2 -translate-y-1/2">
                      <VoiceInput onResult={(text) => handleVoiceInput('technicalSpecs', text)} />
                     </div>
                  </div>
               </div>
               <div className="col-span-1 md:col-span-2">
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="label-text mb-0">项目描述</label>
                    <VoiceInput onResult={(text) => handleVoiceInput('description', text)} />
                  </div>
                  <textarea 
                    rows={3} className="input-field"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
               </div>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-auto flex-shrink-0 bg-white pb-6 md:pb-0">
             <button type="button" onClick={onClose} className="px-5 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg font-medium">取消</button>
             <button type="submit" className="px-5 py-2.5 bg-sl-600 hover:bg-sl-700 text-white rounded-lg font-medium shadow-sm transition-colors">保存项目</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Reuse helper CSS class from OpportunityModal
const style = document.createElement('style');
style.textContent = `
  .label-text { @apply block text-xs font-semibold text-slate-600 mb-1.5; }
  .input-field { @apply w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sl-500 focus:outline-none text-sm text-slate-800 placeholder-slate-400; }
`;
document.head.appendChild(style);

export default ProjectModal;
