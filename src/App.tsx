import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { CriteriaModule } from './modules/CriteriaModule';
import { ScoringModule } from './modules/ScoringModule';
import { AnalysisDashboard } from './modules/AnalysisDashboard';
import { ManagementModule } from './modules/ManagementModule';
import { SvgCopyButton } from './components/ui/SvgCopyButton';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'criteria':
        return <CriteriaModule />;
      case 'scoring':
        return <ScoringModule />;
      case 'dashboard':
        return <AnalysisDashboard />;
      case 'management':
        return <ManagementModule />;
      default:
        return <AnalysisDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto bg-slate-50/50 relative">
          {/* 全局导出按钮 */}
          <div className="fixed bottom-8 right-8 z-50">
            <SvgCopyButton targetId="main-content-area" className="shadow-2xl shadow-blue-600/20" />
          </div>

          <div id="main-content-area" className="max-w-[1600px] mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
