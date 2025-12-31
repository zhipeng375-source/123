import React, { useState } from 'react';
import { Project, ProjectStatus, TaskStatus } from '../types';
import { Search, Filter, Cpu, MapPin, Sparkles, ChevronRight, Plus, Download, Calendar, FolderPlus } from 'lucide-react';
import { exportProjectsToCSV } from '../services/exportService';

interface ProjectListProps {
  projects: Project[];
  onAnalyze: (project: Project) => void;
  onViewDetail: (project: Project) => void;
  onCreateProject: () => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onAnalyze, onViewDetail, onCreateProject }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.includes(searchTerm) || p.clientName.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.ONGOING: return 'bg-blue-100 text-blue-700';
      case ProjectStatus.BIDDING: return 'bg-amber-100 text-amber-700';
      case ProjectStatus.COMPLETED: return 'bg-green-100 text-green-700';
      case ProjectStatus.PLANNING: return 'bg-slate-100 text-slate-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const calculateProgress = (project: Project) => {
    if (!project.tasks || project.tasks.length === 0) return 0;
    const completed = project.tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
    return Math.round((completed / project.tasks.length) * 100);
  };

  return (
    <div className="p-4 md:p-6 h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">项目列表</h2>
          <p className="text-slate-500 text-xs md:text-sm mt-1">管理所有冷却系统工程项目信息及进度</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
           <div className="relative w-full md:w-auto">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <input 
               type="text" 
               placeholder="搜索项目..." 
               className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sl-500 w-full md:w-56 text-sm"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
           <div className="flex gap-2">
             <div className="relative flex-1 md:flex-none">
               <select 
                 className="w-full pl-3 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sl-500 appearance-none bg-white text-sm"
                 value={statusFilter}
                 onChange={(e) => setStatusFilter(e.target.value)}
               >
                 <option value="ALL">所有状态</option>
                 {Object.values(ProjectStatus).map(s => <option key={s} value={s}>{s}</option>)}
               </select>
               <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
             </div>
             <button 
               onClick={onCreateProject}
               className="bg-sl-600 hover:bg-sl-700 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 shadow-sm transition-colors whitespace-nowrap"
             >
               <Plus size={16} /> <span className="hidden sm:inline">新建</span>
             </button>
           </div>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center animate-fade-in">
          <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4">
             <FolderPlus size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-700 mb-2">暂无项目数据</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6">
            您还没有创建任何项目，或者没有符合筛选条件的项目。
          </p>
          <button 
            onClick={onCreateProject}
            className="bg-sl-600 hover:bg-sl-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-md transition-transform hover:scale-105"
          >
            <Plus size={18} /> 创建第一个项目
          </button>
        </div>
      ) : (
        <>
          {/* Desktop View: Table */}
          <div className="hidden md:block flex-1 overflow-auto bg-white rounded-xl shadow-sm border border-slate-200">
            <table className="w-full text-left text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-xs tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">项目名称</th>
                  <th className="px-6 py-4">客户 & 地点</th>
                  <th className="px-6 py-4">预算 (万)</th>
                  <th className="px-6 py-4">状态 & 进度</th>
                  <th className="px-6 py-4">关键技术</th>
                  <th className="px-6 py-4 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProjects.map(project => {
                  const progress = calculateProgress(project);
                  return (
                  <tr key={project.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => onViewDetail(project)}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 group-hover:text-sl-600 transition-colors flex items-center">
                        {project.name}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{project.startDate} 启动</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">{project.clientName}</div>
                      <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                        <MapPin size={12} /> {project.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-medium">
                      ¥{project.budget.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-between mb-1">
                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                            {project.status}
                         </span>
                         <span className="text-xs font-medium text-slate-500">{progress}%</span>
                      </div>
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-sl-500 rounded-full" style={{ width: `${progress}%` }}></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-slate-500 max-w-[200px] truncate" title={project.technicalSpecs}>
                        <Cpu size={14} className="flex-shrink-0" />
                        <span className="truncate">{project.technicalSpecs}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                            onClick={(e) => { e.stopPropagation(); onAnalyze(project); }}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="AI 分析"
                        >
                            <Sparkles size={16} />
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onViewDetail(project); }}
                            className="p-2 text-slate-400 hover:text-sl-600 hover:bg-sl-50 rounded-lg transition-colors"
                            title="查看详情"
                        >
                            <ChevronRight size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>

          {/* Mobile View: Cards */}
          <div className="md:hidden space-y-4 pb-20">
            {filteredProjects.map(project => {
                const progress = calculateProgress(project);
                return (
                <div 
                  key={project.id} 
                  onClick={() => onViewDetail(project)}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm active:scale-[0.98] transition-transform"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${getStatusColor(project.status)}`}>
                       {project.status}
                    </span>
                    <button 
                       onClick={(e) => { e.stopPropagation(); onAnalyze(project); }}
                       className="text-indigo-600 bg-indigo-50 p-1.5 rounded-full"
                    >
                       <Sparkles size={14} />
                    </button>
                  </div>
                  
                  <h3 className="font-bold text-slate-800 text-lg mb-1">{project.name}</h3>
                  <p className="text-sm text-slate-600 mb-3">{project.clientName}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                    <span className="flex items-center gap-1"><MapPin size={12} /> {project.location}</span>
                    <span className="flex items-center gap-1"><Calendar size={12} /> {project.startDate}</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400">项目预算</span>
                      <span className="font-mono font-medium text-slate-700">¥{project.budget.toLocaleString()}万</span>
                    </div>
                    <div className="flex flex-col w-24 items-end">
                       <span className="text-xs text-slate-400 mb-1">进度 {progress}%</span>
                       <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                         <div className="h-full bg-sl-500 rounded-full" style={{ width: `${progress}%` }}></div>
                       </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectList;