import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';
import OpportunityBoard from './components/OpportunityBoard';
import AnalysisModal from './components/AnalysisModal';
import ProjectModal from './components/ProjectModal';
import OpportunityModal from './components/OpportunityModal';
import QuickCollectModal from './components/QuickCollectModal';
import SettingsModal from './components/SettingsModal';
import NewsFeed from './components/NewsFeed';
import { MOCK_PROJECTS, MOCK_OPPORTUNITIES } from './services/mockData';
import { Project, Opportunity, NewsItem, OpportunityStage } from './types';

type View = 'dashboard' | 'projects' | 'opportunities' | 'news';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [analysisItem, setAnalysisItem] = useState<Project | Opportunity | null>(null);
  
  // State for Projects & Opportunities
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(MOCK_OPPORTUNITIES);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Modals
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isOpportunityModalOpen, setIsOpportunityModalOpen] = useState(false); // Kept for future use if needed
  const [isQuickCollectOpen, setIsQuickCollectOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Handlers
  const handleAnalysis = (item: Project | Opportunity) => {
    setAnalysisItem(item);
  };

  const handleUpdateProject = (updated: Project) => {
    setProjects(projects.map(p => p.id === updated.id ? updated : p));
    setSelectedProject(updated); // Keep detail view updated
  };

  const handleCreateProject = (newProject: Project) => {
    const projectWithId = { ...newProject, id: `new_p_${Date.now()}` };
    setProjects([...projects, projectWithId]);
    setIsProjectModalOpen(false);
  };

  const handleQuickCollectSave = (text: string) => {
    // Convert quick note to a rough Opportunity
    const newOpp: Opportunity = {
      id: `quick_${Date.now()}`,
      projectName: `快速采集: ${text.substring(0, 10)}...`,
      clientName: '待补充客户信息',
      description: text, // The full text goes here
      expectedValue: 0,
      stage: OpportunityStage.NEW,
      probability: 10,
      owner: '当前用户',
      lastContactDate: new Date().toISOString().split('T')[0]
    };
    
    setOpportunities([newOpp, ...opportunities]);
    // Switch to opportunities view to let user see it
    setActiveView('opportunities');
  };

  const handleConvertNews = (news: NewsItem) => {
    // Switch to Opportunity tab and add it
    const oppWithId: Opportunity = { 
       id: `news_opp_${Date.now()}`,
       projectName: news.title,
       description: news.summary,
       source: `市场情报: ${news.source}`,
       clientName: '待确认', 
       stage: OpportunityStage.NEW,
       probability: 10,
       expectedValue: 5000, 
       lastContactDate: new Date().toISOString().split('T')[0],
       owner: '待分配',
    } as Opportunity;

    setOpportunities([...opportunities, oppWithId]);
    setActiveView('opportunities');
    alert("商机已创建，请在商机看板中完善详细信息。");
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard projects={projects} opportunities={opportunities} />;
      case 'projects':
        if (selectedProject) {
          return (
            <ProjectDetail 
              project={selectedProject} 
              onBack={() => setSelectedProject(null)}
              onUpdateProject={handleUpdateProject}
            />
          );
        }
        return (
          <ProjectList 
            projects={projects} 
            onAnalyze={handleAnalysis} 
            onViewDetail={(p) => setSelectedProject(p)}
            onCreateProject={() => setIsProjectModalOpen(true)}
          />
        );
      case 'opportunities':
        return (
          <OpportunityBoard 
            opportunities={opportunities} 
            onAnalyze={handleAnalysis} 
          />
        );
      case 'news':
        return <NewsFeed onConvert={handleConvertNews} />;
      default:
        return <Dashboard projects={projects} opportunities={opportunities} />;
    }
  };

  // Reset selected project when switching tabs
  const handleTabChange = (tab: View) => {
    setActiveView(tab);
    setSelectedProject(null);
  };

  return (
    <>
      <Layout 
        activeTab={activeView} 
        onTabChange={handleTabChange}
        onQuickCollect={() => setIsQuickCollectOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      >
        {renderContent()}
      </Layout>
      
      {/* Modals */}
      {analysisItem && (
        <AnalysisModal 
          item={analysisItem} 
          onClose={() => setAnalysisItem(null)} 
        />
      )}

      {isProjectModalOpen && (
        <ProjectModal 
          project={null}
          onSave={handleCreateProject}
          onClose={() => setIsProjectModalOpen(false)}
        />
      )}

      {isQuickCollectOpen && (
        <QuickCollectModal
          onSave={handleQuickCollectSave}
          onClose={() => setIsQuickCollectOpen(false)}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal 
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </>
  );
};

export default App;