import React from 'react';
import { LayoutDashboard, FolderKanban, Target, Settings, Bell, Snowflake, Radio, PenTool } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'dashboard' | 'projects' | 'opportunities' | 'news';
  onTabChange: (tab: 'dashboard' | 'projects' | 'opportunities' | 'news') => void;
  onQuickCollect: () => void;
  onOpenSettings: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, onQuickCollect, onOpenSettings }) => {
  
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: '概览' },
    { id: 'projects', icon: FolderKanban, label: '项目' },
    { id: 'opportunities', icon: Target, label: '商机' },
    { id: 'news', icon: Radio, label: '情报' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Desktop Sidebar - Hidden on Mobile */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-white flex-col flex-shrink-0 transition-all duration-300">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Snowflake className="text-sl-500 mr-2" />
          <span className="text-lg font-bold tracking-wide">双良冷却 PM</span>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as any)}
              className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === item.id ? 'bg-sl-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} className="mr-3" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={onOpenSettings}
            className="w-full flex items-center px-3 py-2.5 text-slate-400 hover:text-white transition-colors"
          >
            <Settings size={20} className="mr-3" />
            <span className="text-sm font-medium">系统设置</span>
          </button>
          <div className="mt-4 flex items-center px-3">
             <div className="w-8 h-8 rounded-full bg-sl-500 flex items-center justify-center text-xs font-bold">VS</div>
             <div className="ml-3">
                <p className="text-sm text-white">Vacili Sun</p>
                <p className="text-xs text-slate-500">项目经理</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full w-full relative">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 flex-shrink-0 z-10">
          <div className="flex items-center text-slate-400">
            {/* Mobile Logo Only */}
            <div className="md:hidden flex items-center mr-2 text-slate-800 font-bold">
               <Snowflake className="text-sl-500 mr-1 w-5 h-5" />
               <span>双良</span>
            </div>
            <span className="text-xs md:text-sm hidden sm:block">{new Date().toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
             {/* Quick Collect Button (Desktop) */}
             <button 
              onClick={onQuickCollect}
              className="hidden md:flex bg-sl-600 hover:bg-sl-700 text-white px-4 py-2 rounded-full text-sm font-bold items-center gap-2 shadow-md transition-transform hover:scale-105 active:scale-95"
            >
              <PenTool size={16} />
              <span>快速采集</span>
            </button>

            <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block"></div>

            <button 
              onClick={onOpenSettings}
              className="p-2 text-slate-400 hover:text-slate-600 relative md:hidden"
            >
              <Settings size={20} />
            </button>

            <button className="p-2 text-slate-400 hover:text-slate-600 relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="md:hidden w-8 h-8 rounded-full bg-sl-500 flex items-center justify-center text-xs font-bold text-white">VS</div>
          </div>
        </header>

        {/* Scrollable Page Content - Added padding bottom for mobile nav */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative pb-20 md:pb-0 scroll-smooth">
          {children}
        </main>
        
        {/* Mobile Floating Action Button (FAB) for Quick Collect */}
        <button 
          onClick={onQuickCollect}
          className="md:hidden fixed right-4 bottom-20 z-40 bg-sl-600 text-white p-4 rounded-full shadow-xl shadow-sl-600/30 active:scale-90 transition-transform"
        >
          <PenTool size={24} />
        </button>

        {/* Mobile Bottom Navigation - Visible only on Mobile */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center h-16 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as any)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                activeTab === item.id ? 'text-sl-600' : 'text-slate-400'
              }`}
            >
              <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Layout;