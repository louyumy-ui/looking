import React, { useState } from 'react';
import { 
  Database, 
  Layout, 
  Globe, 
  Link as LinkIcon,
  Search,
  Plus,
  Edit3,
  Trash2,
  ChevronDown,
  BrainCircuit,
  Code2,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export const ManagementModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'atomic' | 'templates' | 'square' | 'association'>('atomic');
  const [isAiConfigOpen, setIsAiConfigOpen] = useState(false);

  const tabs = [
    { id: 'atomic', label: '原子维度库', icon: Database },
    { id: 'templates', label: '模板管理', icon: Layout },
    { id: 'square', label: '模板广场', icon: Globe },
    { id: 'association', label: '话术关联管理', icon: LinkIcon },
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">管理控制台</h1>
          <p className="text-slate-500 mt-2">基础物料配置中心与系统级策略管理</p>
        </div>
      </div>

      {/* Tab 切换 */}
      <div className="flex items-center gap-2 bg-white p-1.5 rounded-[24px] border border-slate-200 shadow-sm w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-[18px] text-sm font-bold transition-all",
              activeTab === tab.id 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                : "text-slate-500 hover:bg-slate-50"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* 内容区 */}
      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
        {activeTab === 'atomic' && (
          <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="搜索维度名称、关键词..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-transparent rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                />
              </div>
              <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-2xl font-bold hover:bg-slate-800 transition-all">
                <Plus className="w-4 h-4" />
                新增原子维度
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-xl transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                      <BrainCircuit className="w-6 h-6" />
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-800 text-lg">语速适中检测</h4>
                  <p className="text-sm text-slate-500 mt-2 line-clamp-2">基于语音流实时计算每分钟语速，判断是否在 180-220 字/分钟的标准区间内。</p>
                  
                  <div className="mt-6 pt-6 border-t border-slate-200/60">
                    <button 
                      onClick={() => setIsAiConfigOpen(!isAiConfigOpen)}
                      className="w-full flex items-center justify-between text-xs font-bold text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors"
                    >
                      AI 识别逻辑配置
                      <ChevronDown className={cn("w-4 h-4 transition-transform", isAiConfigOpen && "rotate-180")} />
                    </button>
                    
                    <AnimatePresence>
                      {isAiConfigOpen && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 space-y-4">
                            <div className="p-4 bg-slate-900 rounded-2xl space-y-3">
                              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                <Code2 className="w-3 h-3" />
                                LLM Prompt 配置
                              </div>
                              <p className="text-[11px] text-slate-400 font-mono leading-relaxed">
                                "Analyze the speech rate of the following transcript. If the rate is between 180 and 220 words per minute, return score 100, otherwise..."
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {['关键词匹配', '语义理解', '情感分析'].map(tag => (
                                <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-md">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'association' && (
          <div className="p-0">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">模板名称</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">关联话术</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">关联账号</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">状态</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">更新时间</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-8 py-6">
                      <span className="text-sm font-bold text-slate-800">标准服务质检模板 v1.2</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm text-slate-600">金融理财咨询话术</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map(u => (
                          <div key={u} className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                            U{u}
                          </div>
                        ))}
                        <div className="w-7 h-7 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
                          +12
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-emerald-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">已启用</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-slate-400 font-mono">
                      2024-03-10 14:20
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {(activeTab === 'templates' || activeTab === 'square') && (
          <div className="p-20 flex flex-col items-center justify-center text-slate-400 space-y-4">
            <Layout className="w-16 h-16 opacity-20" />
            <p className="font-bold text-lg">模板管理功能正在复用 CriteriaModule 引擎...</p>
            <button 
              onClick={() => setActiveTab('atomic')}
              className="text-blue-600 font-bold hover:underline"
            >
              返回原子维度库
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
