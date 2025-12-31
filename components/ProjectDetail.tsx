import React, { useState } from 'react';
import { Project, Task, TaskStatus, TaskPriority } from '../types';
import { ArrowLeft, Calendar, User, Plus, Search, Filter, BarChart3, ListTodo, Clock, CheckCircle2, FileText, Download, UploadCloud } from 'lucide-react';
import TaskModal from './TaskModal';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  onUpdateProject: (updatedProject: Project) => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack, onUpdateProject }) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'files'>('tasks');
  const [viewMode, setViewMode] = useState<'list' | 'gantt'>('list');
  const [tasks, setTasks] = useState<Task[]>(project.tasks || []);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterOwner, setFilterOwner] = useState('ALL');

  const completedCount = tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
  const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const handleSaveTask = (task: Task) => {
    let newTasks;
    if (editingTask) {
      newTasks = tasks.map(t => t.id === task.id ? task : t);
    } else {
      newTasks = [...tasks, { ...task, id: Date.now().toString() }];
    }
    setTasks(newTasks);
    onUpdateProject({ ...project, tasks: newTasks });
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const filteredTasks = tasks.filter(t => filterOwner === 'ALL' || t.owner.includes(filterOwner));

  // Simple Gantt Helpers
  const getGanttDates = () => {
    if (tasks.length === 0) return { start: new Date(), end: new Date(), totalDays: 1 };
    const starts = tasks.map(t => new Date(t.startDate).getTime());
    const ends = tasks.map(t => new Date(t.endDate).getTime());
    const min = Math.min(...starts);
    const max = Math.max(...ends);
    const start = new Date(min - 86400000 * 2);
    const end = new Date(max + 86400000 * 5);
    const totalDays = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
    return { start, end, totalDays };
  };

  const { start: gStart, end: gEnd, totalDays } = getGanttDates();

  const getLeftPos = (dateStr: string) => {
    const d = new Date(dateStr).getTime();
    const diff = (d - gStart.getTime()) / (1000 * 3600 * 24);
    return (diff / totalDays) * 100;
  };

  const getWidth = (startStr: string, endStr: string) => {
    const s = new Date(startStr).getTime();
    const e = new Date(endStr).getTime();
    const duration = (e - s) / (1000 * 3600 * 24);
    return Math.max((duration / totalDays) * 100, 0.5); 
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH: return 'bg-red-50 text-red-600 border-red-100';
      case TaskPriority.MEDIUM: return 'bg-amber-50 text-amber-600 border-amber-100';
      case TaskPriority.LOW: return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="px-4 md:px-6 py-4 bg-white border-b border-slate-200 shadow-sm z-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="flex items-start gap-3">
              <button onClick={onBack} className="mt-1 p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-slate-800 flex flex-wrap items-center gap-2">
                  {project.name}
                  <span className="text-xs font-normal text-slate-500 border border-slate-200 px-2 py-0.5 rounded-full bg-slate-50">
                    {project.status}
                  </span>
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1"><User size={12} /> {project.clientName}</span>
                  <span className="flex items-center gap-1"><Calendar size={12} /> {project.startDate}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto pl-11 md:pl-0">
               <div className="text-left md:text-right">
                 <p className="text-xs text-slate-400 mb-1">总体进度</p>
                 <div className="flex items-center gap-2 w-32 md:w-48">
                   <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-sl-500 rounded-full transition-all duration-500" style={{width: `${progress}%`}}></div>
                   </div>
                   <span className="text-sm font-bold text-sl-600">{progress}%</span>
                 </div>
               </div>
               <button 
                 onClick={() => { setEditingTask(null); setIsTaskModalOpen(true); }}
                 className="bg-sl-600 hover:bg-sl-700 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors whitespace-nowrap"
               >
                 <Plus size={16} /> <span className="hidden sm:inline">任务</span>
               </button>
            </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex gap-6 mt-6 border-b border-slate-100">
           <button 
             onClick={() => setActiveTab('tasks')}
             className={`pb-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'tasks' ? 'border-sl-600 text-sl-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
           >
             任务管理
           </button>
           <button 
             onClick={() => setActiveTab('files')}
             className={`pb-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'files' ? 'border-sl-600 text-sl-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
           >
             文档中心
           </button>
        </div>
      </div>

      {activeTab === 'tasks' && (
        <>
            {/* Toolbar */}
            <div className="px-4 md:px-6 py-3 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div className="flex bg-white p-1 rounded-lg border border-slate-200 w-full md:w-auto">
                    <button 
                        onClick={() => setViewMode('list')}
                        className={`flex-1 md:flex-none justify-center px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <ListTodo size={16} /> 列表
                    </button>
                    <button 
                        onClick={() => setViewMode('gantt')}
                        className={`flex-1 md:flex-none justify-center px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${viewMode === 'gantt' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <BarChart3 size={16} /> 甘特图
                    </button>
                </div>

                <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input 
                    type="text" 
                    placeholder="过滤负责人..." 
                    className="pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sl-500 w-full md:w-48"
                    value={filterOwner === 'ALL' ? '' : filterOwner}
                    onChange={(e) => setFilterOwner(e.target.value || 'ALL')}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-4 md:p-6 pb-20">
                {viewMode === 'list' ? (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                            <tr>
                            <th className="px-6 py-3">任务名称</th>
                            <th className="px-6 py-3">负责人</th>
                            <th className="px-6 py-3">优先级</th>
                            <th className="px-6 py-3">起止日期</th>
                            <th className="px-6 py-3">状态</th>
                            <th className="px-6 py-3 text-right">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredTasks.map(task => (
                            <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-3 font-medium text-slate-800">{task.name}</td>
                                <td className="px-6 py-3 flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                                    {task.owner.charAt(0)}
                                </div>
                                {task.owner}
                                </td>
                                <td className="px-6 py-3">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                                    {task.priority || TaskPriority.MEDIUM}
                                </span>
                                </td>
                                <td className="px-6 py-3 text-slate-500">
                                <div className="flex flex-col text-xs">
                                    <span>{task.startDate}</span>
                                    <span>{task.endDate}</span>
                                </div>
                                </td>
                                <td className="px-6 py-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium border
                                    ${task.status === TaskStatus.COMPLETED ? 'bg-green-50 text-green-700 border-green-100' : 
                                    task.status === TaskStatus.IN_PROGRESS ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                    task.status === TaskStatus.PAUSED ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                                    'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                    {task.status}
                                </span>
                                </td>
                                <td className="px-6 py-3 text-right">
                                <button 
                                    onClick={() => { setEditingTask(task); setIsTaskModalOpen(true); }}
                                    className="text-indigo-600 hover:text-indigo-800 font-medium text-xs"
                                >
                                    编辑
                                </button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-3">
                        {filteredTasks.map(task => (
                            <div key={task.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm" onClick={() => { setEditingTask(task); setIsTaskModalOpen(true); }}>
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-slate-800 text-sm flex-1 mr-2">{task.name}</h4>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium border flex-shrink-0 ${getPriorityColor(task.priority)}`}>
                                        {task.priority || TaskPriority.MEDIUM}
                                    </span>
                                </div>
                                
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                        {task.owner.charAt(0)}
                                    </div>
                                    <span className="text-xs text-slate-500">{task.owner}</span>
                                </div>
                                
                                <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                                    <div className="text-xs text-slate-400">
                                        {task.endDate} 截止
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border
                                        ${task.status === TaskStatus.COMPLETED ? 'bg-green-50 text-green-700 border-green-100' : 
                                        task.status === TaskStatus.IN_PROGRESS ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                        task.status === TaskStatus.PAUSED ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                                        'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                        {task.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
                ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6 overflow-x-auto">
                    <div className="min-w-[800px]">
                        {/* Timeline Header */}
                        <div className="flex border-b border-slate-100 pb-2 mb-4">
                        <div className="w-48 flex-shrink-0 font-semibold text-slate-700 pl-2">任务名称</div>
                        <div className="flex-1 relative h-6">
                            <span className="absolute left-0 text-xs text-slate-400">{gStart.toLocaleDateString()}</span>
                            <span className="absolute right-0 text-xs text-slate-400">{gEnd.toLocaleDateString()}</span>
                        </div>
                        </div>
                        {/* Timeline Rows */}
                        <div className="space-y-4">
                        {filteredTasks.map(task => (
                            <div key={task.id} className="flex items-center group relative h-8">
                                <div className="w-48 flex-shrink-0 text-sm font-medium text-slate-700 truncate pr-4 pl-2">{task.name}</div>
                                <div className="flex-1 relative h-full bg-slate-50 rounded-md">
                                    <div 
                                    className={`absolute top-1.5 h-5 rounded-md shadow-sm border text-xs text-white flex items-center px-2 truncate
                                        ${task.status === TaskStatus.COMPLETED ? 'bg-green-500 border-green-600' : 
                                        task.status === TaskStatus.IN_PROGRESS ? 'bg-blue-500 border-blue-600' :
                                        task.status === TaskStatus.PAUSED ? 'bg-amber-400 border-amber-500' : 
                                        'bg-slate-400 border-slate-500'}`}
                                    style={{ 
                                        left: `${getLeftPos(task.startDate)}%`, 
                                        width: `${getWidth(task.startDate, task.endDate)}%`
                                    }}
                                    >
                                    {task.status === TaskStatus.COMPLETED && <CheckCircle2 size={12} className="mr-1" />}
                                    {task.owner}
                                    </div>
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
                )}
            </div>
        </>
      )}

      {activeTab === 'files' && (
          <div className="flex-1 p-4 md:p-6 overflow-auto pb-20">
              <div className="bg-white rounded-xl border border-slate-200 p-6 min-h-[400px]">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-slate-800">项目文档</h3>
                      <button className="flex items-center gap-2 bg-sl-50 text-sl-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-sl-100 transition-colors">
                          <UploadCloud size={16} /> 上传文件
                      </button>
                  </div>
                  
                  {/* Mock File List */}
                  <div className="space-y-3">
                      {[
                          { name: '冷却系统初步设计图纸_v1.0.pdf', size: '12.5 MB', date: '2024-05-10', type: 'PDF' },
                          { name: '设备采购清单.xlsx', size: '245 KB', date: '2024-05-12', type: 'Excel' },
                          { name: '双良节能工程服务合同.pdf', size: '4.2 MB', date: '2024-04-28', type: 'PDF' },
                          { name: '现场勘测报告.docx', size: '1.8 MB', date: '2024-05-01', type: 'Word' },
                      ].map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                              <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${
                                      file.type === 'PDF' ? 'bg-red-50 text-red-500' :
                                      file.type === 'Excel' ? 'bg-green-50 text-green-500' :
                                      'bg-blue-50 text-blue-500'
                                  }`}>
                                      {file.type}
                                  </div>
                                  <div>
                                      <p className="text-sm font-medium text-slate-800">{file.name}</p>
                                      <p className="text-xs text-slate-400">{file.size} • {file.date}</p>
                                  </div>
                              </div>
                              <button className="text-slate-400 hover:text-sl-600 p-2">
                                  <Download size={18} />
                              </button>
                          </div>
                      ))}
                  </div>
                  
                  <div className="mt-8 text-center text-slate-400 text-sm border-t border-slate-100 pt-8">
                      <FileText size={32} className="mx-auto mb-2 opacity-50" />
                      暂无更多文档
                  </div>
              </div>
          </div>
      )}

      {isTaskModalOpen && (
        <TaskModal 
          task={editingTask} 
          onSave={handleSaveTask} 
          onClose={() => { setIsTaskModalOpen(false); setEditingTask(null); }} 
        />
      )}
    </div>
  );
};

export default ProjectDetail;
