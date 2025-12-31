import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, TaskPriority } from '../types';
import { X } from 'lucide-react';
import VoiceInput from './VoiceInput';

interface TaskModalProps {
  task: Task | null;
  onSave: (task: Task) => void;
  onClose: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<Task>>({
    name: '',
    owner: '',
    startDate: '',
    endDate: '',
    status: TaskStatus.NOT_STARTED,
    priority: TaskPriority.MEDIUM,
    notes: '',
    actualCompletionDate: ''
  });

  useEffect(() => {
    if (task) {
      setFormData(task);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.owner && formData.startDate && formData.endDate) {
      onSave(formData as Task);
    }
  };

  const handleVoiceInput = (field: keyof Task, text: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] ? `${prev[field]} ` : '') + text
    }));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-fade-in md:p-4">
      <div className="bg-white w-full h-full md:h-auto md:max-w-md md:rounded-xl shadow-xl overflow-y-auto flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 flex-shrink-0">
          <h3 className="font-bold text-slate-800">{task ? '编辑任务' : '添加新任务'}</h3>
          <button onClick={onClose}><X size={24} className="text-slate-400 hover:text-slate-600" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1 overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">任务名称</label>
            <div className="relative">
              <input 
                type="text" required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sl-500 focus:outline-none pr-10"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2">
                <VoiceInput onResult={(text) => handleVoiceInput('name', text)} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">负责人</label>
                <input 
                  type="text" required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sl-500 focus:outline-none"
                  value={formData.owner}
                  onChange={e => setFormData({...formData, owner: e.target.value})}
                />
             </div>
             <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">优先级</label>
                <select 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sl-500 focus:outline-none bg-white"
                  value={formData.priority}
                  onChange={e => setFormData({...formData, priority: e.target.value as TaskPriority})}
                >
                   {Object.values(TaskPriority).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
             </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">状态</label>
                <select 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sl-500 focus:outline-none bg-white"
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value as TaskStatus})}
                >
                   {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
             </div>
             <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">开始日期</label>
                <input 
                  type="date" required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sl-500 focus:outline-none"
                  value={formData.startDate}
                  onChange={e => setFormData({...formData, startDate: e.target.value})}
                />
             </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">计划截止</label>
                <input 
                  type="date" required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sl-500 focus:outline-none"
                  value={formData.endDate}
                  onChange={e => setFormData({...formData, endDate: e.target.value})}
                />
             </div>
              {formData.status === TaskStatus.COMPLETED && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">实际完成日期</label>
                  <input 
                    type="date"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sl-500 focus:outline-none"
                    value={formData.actualCompletionDate}
                    onChange={e => setFormData({...formData, actualCompletionDate: e.target.value})}
                  />
                </div>
              )}
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
               <label className="block text-xs font-semibold text-slate-600">备注</label>
               <VoiceInput onResult={(text) => handleVoiceInput('notes', text)} />
            </div>
            <textarea 
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sl-500 focus:outline-none"
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
            />
          </div>
          <div className="pt-2 flex justify-end gap-3 flex-shrink-0 mt-auto pb-6 md:pb-0">
             <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">取消</button>
             <button type="submit" className="px-4 py-2 bg-sl-600 hover:bg-sl-700 text-white rounded-lg">保存</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
