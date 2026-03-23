import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Lock, 
  Unlock, 
  AlertCircle, 
  Play, 
  Search,
  Trash2,
  ChevronRight,
  Info
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Criterion } from '@/src/types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

export const CriteriaModule: React.FC = () => {
  const [criteria, setCriteria] = useState<Criterion[]>([
    { id: '1', name: '语速适中', weight: 25, isLocked: false, description: '语速是否在 180-220 字/分钟' },
    { id: '2', name: '礼貌用语', weight: 25, isLocked: false, description: '是否包含“您好”、“请”、“谢谢”' },
    { id: '3', name: '业务准确性', weight: 30, isLocked: true, description: '业务知识点回答是否准确' },
    { id: '4', name: '情绪稳定', weight: 20, isLocked: false, description: '全程无负面情绪波动' },
  ]);

  const [testText, setTestText] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rebalanceWeights = (changedId: string, newWeight: number) => {
    const target = criteria.find(c => c.id === changedId);
    if (!target) return;

    const otherCriteria = criteria.filter(c => c.id !== changedId);
    const lockedCriteria = otherCriteria.filter(c => c.isLocked);
    const unlockedCriteria = otherCriteria.filter(c => !c.isLocked);

    const lockedWeightSum = lockedCriteria.reduce((sum, c) => sum + c.weight, 0);
    const remainingWeight = 100 - lockedWeightSum - newWeight;

    if (remainingWeight < 0 || (unlockedCriteria.length > 0 && remainingWeight / unlockedCriteria.length < 1)) {
      setError('剩余权重不足以分配给其他未锁定维度（需至少 1%）');
      return;
    }

    setError(null);
    const weightPerUnlocked = unlockedCriteria.length > 0 ? remainingWeight / unlockedCriteria.length : 0;

    const nextCriteria = criteria.map(c => {
      if (c.id === changedId) return { ...c, weight: newWeight };
      if (c.isLocked) return c;
      return { ...c, weight: Number(weightPerUnlocked.toFixed(2)) };
    });

    // 修正精度误差
    const total = nextCriteria.reduce((sum, c) => sum + c.weight, 0);
    if (total !== 100 && unlockedCriteria.length > 0) {
      const diff = 100 - total;
      const lastUnlocked = nextCriteria.find(c => !c.isLocked && c.id !== changedId);
      if (lastUnlocked) {
        lastUnlocked.weight = Number((lastUnlocked.weight + diff).toFixed(2));
      }
    }

    setCriteria(nextCriteria);
  };

  const toggleLock = (id: string) => {
    setCriteria(criteria.map(c => c.id === id ? { ...c, isLocked: !c.isLocked } : c));
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">打分标准制定</h1>
          <p className="text-slate-500 mt-2">管理质检维度、分值与自动化评分逻辑</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all shadow-lg shadow-blue-600/20">
          <Plus className="w-5 h-5" />
          创建新模板
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧编辑区 */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-blue-500" />
                分值策略引擎
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">总权重</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-bold text-sm">100%</span>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {criteria.map((item) => (
                <div key={item.id} className="p-6 hover:bg-slate-50/50 transition-colors group">
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{item.name}</span>
                        <button 
                          onClick={() => toggleLock(item.id)}
                          className={cn(
                            "p-1 rounded-md transition-colors",
                            item.isLocked ? "text-blue-600 bg-blue-50" : "text-slate-400 hover:bg-slate-100"
                          )}
                        >
                          {item.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">{item.description}</p>
                    </div>

                    <div className="flex items-center gap-4 w-64">
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={item.weight}
                        disabled={item.isLocked}
                        onChange={(e) => rebalanceWeights(item.id, parseInt(e.target.value))}
                        className="flex-1 accent-blue-600 disabled:opacity-30"
                      />
                      <div className="w-16 text-right font-mono font-bold text-blue-600">
                        {item.weight}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          )}
        </div>

        {/* 右侧测试区 */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Play className="w-5 h-5 text-emerald-400 fill-emerald-400" />
              AI 模拟诊断测试
            </h3>
            
            <textarea 
              placeholder="输入对话文本进行模拟测试..."
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              className="w-full h-40 bg-slate-800 border-none rounded-2xl p-4 text-sm text-slate-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none mb-4"
            />

            <button 
              onClick={() => setIsTesting(true)}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold transition-all"
            >
              开始诊断
            </button>

            {isTesting && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 space-y-6"
              >
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={criteria.map(c => ({ subject: c.name, A: Math.random() * 100 }))}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                      <Radar dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  {criteria.map(c => (
                    <div key={c.id} className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>{c.name}</span>
                        <span>{Math.floor(Math.random() * 100)}分</span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.random() * 100}%` }}
                          className="h-full bg-emerald-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import { Settings2 } from 'lucide-react';
