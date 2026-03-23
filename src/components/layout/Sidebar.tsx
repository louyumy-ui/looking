import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Settings2, 
  Mic2, 
  BarChart3, 
  ChevronLeft, 
  ChevronRight,
  BrainCircuit,
  Settings
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'criteria', label: '打分标准', icon: Settings2 },
    { id: 'scoring', label: '单通诊断', icon: Mic2 },
    { id: 'dashboard', label: '数据看板', icon: BarChart3 },
    { id: 'management', label: '管理控制台', icon: Settings },
  ];

  return (
    <aside 
      className={cn(
        "h-screen bg-slate-900 text-slate-300 transition-all duration-300 flex flex-col border-r border-slate-800",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
          <BrainCircuit className="text-white w-5 h-5" />
        </div>
        {!isCollapsed && (
          <span className="font-bold text-lg text-white truncate">AI 智能语音</span>
        )}
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group",
              activeTab === item.id 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                : "hover:bg-slate-800 hover:text-white"
            )}
          >
            <item.icon className={cn("w-5 h-5 shrink-0", activeTab === item.id ? "text-white" : "text-slate-400 group-hover:text-white")} />
            {!isCollapsed && <span className="font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
};
