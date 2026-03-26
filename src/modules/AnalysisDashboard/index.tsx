import React, { useState } from 'react';
import { 
  Phone, 
  Activity, 
  UserCheck, 
  ShieldCheck, 
  Calendar,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Info
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { 
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';
import { motion } from 'motion/react';
import { copyDomToFigmaSvg } from '@/src/lib/figma';

// 模拟趋势数据 - 与顶部汇总数据完全对应
const initialTrendData = [
  { 
    name: '03-01', 
    call: 250, connected: 150, totalRate: 60.0, effectiveRate: 76.9, missed: 100, 
    waste: 55, empty: 30, powerOff: 25,
    effectiveLive: 195, 
    effectiveUnreached: 45, notSelf: 15, refused: 10, noAnswer: 15, shutDown: 5,
    intention: 98, conversionRate: 38.7,
    dineIn: 45, confirmTime: 65, precautions: 60, others: 8,
    notNeeded: 12, alreadyDone: 8, timeConflict: 5, otherReasons: 2
  },
  { 
    name: '03-02', 
    call: 240, connected: 160, totalRate: 66.7, effectiveRate: 84.2, missed: 80, 
    waste: 50, empty: 25, powerOff: 25,
    effectiveLive: 190, 
    effectiveUnreached: 30, notSelf: 10, refused: 5, noAnswer: 10, shutDown: 5,
    intention: 105, conversionRate: 38.8,
    dineIn: 48, confirmTime: 70, precautions: 65, others: 10,
    notNeeded: 10, alreadyDone: 7, timeConflict: 4, otherReasons: 1
  },
  { 
    name: '03-03', 
    call: 260, connected: 140, totalRate: 53.8, effectiveRate: 70.0, missed: 120, 
    waste: 60, empty: 35, powerOff: 25,
    effectiveLive: 200, 
    effectiveUnreached: 60, notSelf: 20, refused: 15, noAnswer: 20, shutDown: 5,
    intention: 92, conversionRate: 39.3,
    dineIn: 40, confirmTime: 60, precautions: 55, others: 7,
    notNeeded: 15, alreadyDone: 10, timeConflict: 6, otherReasons: 3
  },
  { 
    name: '03-04', 
    call: 230, connected: 155, totalRate: 67.4, effectiveRate: 83.8, missed: 75, 
    waste: 45, empty: 20, powerOff: 25,
    effectiveLive: 185, 
    effectiveUnreached: 30, notSelf: 8, refused: 7, noAnswer: 10, shutDown: 5,
    intention: 112, conversionRate: 41.9,
    dineIn: 52, confirmTime: 75, precautions: 70, others: 12,
    notNeeded: 8, alreadyDone: 5, timeConflict: 3, otherReasons: 1
  },
  { 
    name: '03-05', 
    call: 270, connected: 165, totalRate: 61.1, effectiveRate: 80.5, missed: 105, 
    waste: 65, empty: 40, powerOff: 25,
    effectiveLive: 205, 
    effectiveUnreached: 40, notSelf: 12, refused: 8, noAnswer: 15, shutDown: 5,
    intention: 88, conversionRate: 36.4,
    dineIn: 38, confirmTime: 58, precautions: 52, others: 6,
    notNeeded: 18, alreadyDone: 12, timeConflict: 8, otherReasons: 4
  },
  { 
    name: '03-06', 
    call: 255, connected: 145, totalRate: 56.9, effectiveRate: 72.5, missed: 110, 
    waste: 55, empty: 30, powerOff: 25,
    effectiveLive: 195, 
    effectiveUnreached: 55, notSelf: 18, refused: 12, noAnswer: 18, shutDown: 7,
    intention: 100, conversionRate: 39.3,
    dineIn: 42, confirmTime: 62, precautions: 58, others: 9,
    notNeeded: 14, alreadyDone: 9, timeConflict: 6, otherReasons: 2
  },
  { 
    name: '03-07', 
    call: 245, connected: 151, totalRate: 61.6, effectiveRate: 79.5, missed: 94, 
    waste: 55, empty: 30, powerOff: 25,
    effectiveLive: 190, 
    effectiveUnreached: 39, notSelf: 10, refused: 8, noAnswer: 15, shutDown: 6,
    intention: 102, conversionRate: 41.7,
    dineIn: 46, confirmTime: 68, precautions: 62, others: 11,
    notNeeded: 11, alreadyDone: 8, timeConflict: 4, otherReasons: 2
  },
];

export const AnalysisDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'day' | 'month' | 'year'>('day');
  const [activeSlice, setActiveSlice] = useState('任务成果');
  const [isMultiView, setIsMultiView] = useState(true);
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null }>({ key: 'name', direction: null });
  const [participationStatus, setParticipationStatus] = useState<'参加' | '不参加'>('参加');

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return initialTrendData;
    return [...initialTrendData].sort((a: any, b: any) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key ? (prev.direction === 'asc' ? 'desc' : prev.direction === 'desc' ? null : 'asc') : 'asc'
    }));
  };

  const SortIcon = ({ column }: { column: string }) => {
    const isActive = sortConfig.key === column;
    return (
      <div className="flex flex-col ml-1.5 opacity-100 transition-opacity">
        <ChevronDown 
          className={cn(
            "w-2.5 h-2.5 rotate-180 -mb-0.5 transition-colors", 
            isActive && sortConfig.direction === 'asc' ? "text-blue-600 scale-125" : "text-slate-400"
          )} 
        />
        <ChevronDown 
          className={cn(
            "w-2.5 h-2.5 transition-colors", 
            isActive && sortConfig.direction === 'desc' ? "text-blue-600 scale-125" : "text-slate-400"
          )} 
        />
      </div>
    );
  };

  const handleExport = async () => {
    const success = await copyDomToFigmaSvg('analysis-dashboard-container');
    if (success) {
      alert('矢量 UI 已复制到剪贴板，请在 Figma 中粘贴 (Ctrl/Cmd + V)');
    } else {
      alert('导出失败，请重试');
    }
  };

  return (
    <div id="analysis-dashboard-container" className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen animate-in fade-in duration-500">
      {/* 顶部导航与过滤器 */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100 transition-all">
            <span className="text-sm font-bold text-slate-700">企业年报</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
        </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
              <button 
                onClick={() => setLayoutMode('grid')} 
                className={cn(
                  "px-3 py-1 text-[10px] font-bold rounded-md transition-all flex items-center gap-1", 
                  layoutMode === 'grid' ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"
                )}
              >
                <div className="grid grid-cols-2 gap-0.5 w-3 h-3">
                  <div className="bg-current opacity-40 rounded-[1px]" />
                  <div className="bg-current opacity-40 rounded-[1px]" />
                  <div className="bg-current opacity-40 rounded-[1px]" />
                  <div className="bg-current opacity-40 rounded-[1px]" />
                </div>
                双排
              </button>
              <button 
                onClick={() => setLayoutMode('list')} 
                className={cn(
                  "px-3 py-1 text-[10px] font-bold rounded-md transition-all flex items-center gap-1", 
                  layoutMode === 'list' ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"
                )}
              >
                <div className="flex flex-col gap-0.5 w-3 h-3 justify-center">
                  <div className="bg-current opacity-40 h-1 rounded-[1px]" />
                  <div className="bg-current opacity-40 h-1 rounded-[1px]" />
                </div>
                单排
              </button>
            </div>
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
            {(['日', '月', '年'] as const).map((r) => (
              <button key={r} onClick={() => setTimeRange(r === '日' ? 'day' : r === '月' ? 'month' : 'year')} className={cn("px-4 py-1 text-xs font-bold rounded-md transition-all", (r === '日' && timeRange === 'day') || (r === '月' && timeRange === 'month') || (r === '年' && timeRange === 'year') ? "bg-white text-blue-600 shadow-sm" : "text-slate-500")}>{r}</button>
            ))}
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200">
            <Calendar className="w-4 h-4 text-slate-400" />
            <div className="flex items-center gap-1">
              <input type="text" placeholder="开始日期" className="w-20 bg-transparent text-xs outline-none text-slate-600" />
              <span className="text-slate-300">至</span>
              <input type="text" placeholder="结束日期" className="w-20 bg-transparent text-xs outline-none text-slate-600" />
            </div>
          </div>
          <button className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold border border-slate-200 hover:bg-slate-100">
            <Activity className="w-3 h-3" />
            重置
          </button>
        </div>
      </div>

      {/* 顶部 3 指标卡片 - 占据一整排 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* 1. 任务成果 */}
        <div 
          onClick={() => {
            setActiveSlice('任务成果');
            setIsMultiView(false);
          }}
          className={cn(
            "bg-white p-5 rounded-xl border shadow-sm relative transition-all flex flex-col group cursor-pointer h-full",
            activeSlice === '任务成果' ? "border-blue-500 ring-1 ring-blue-500/20" : "border-slate-200 hover:border-slate-300"
          )}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <UserCheck className={cn(
                "w-4 h-4 transition-colors",
                activeSlice === '任务成果' ? "text-blue-500" : "text-slate-400"
              )} />
              <h3 className="text-sm font-bold text-slate-600">任务成果</h3>
              <div className="group relative">
                <Info className="w-3.5 h-3.5 text-slate-300 cursor-help" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                  根据您设置的任务目标，成功达成的任务结果总数
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                </div>
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)] mt-1" />
          </div>

          <div className="flex items-baseline gap-2 mb-5">
            <span className="text-3xl font-bold text-slate-800 tracking-tight">361</span>
            <span className="text-xs font-medium text-slate-400">意向用户 (人)</span>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-5">
            {[
              { label: '在院内用餐', value: '90', tip: '用户明确表示会在医院食堂或指定区域用餐' },
              { label: '确认预约时间', value: '128', tip: '用户已确认具体的体检或到访时间' },
              { label: '知悉注意事项', value: '128', tip: '用户已阅读并确认了解体检前的相关准备工作' },
              { label: '其他需求', value: '15', tip: '用户提出的非核心目标需求，如咨询交通、停车等' }
            ].map((item, i) => (
              <div key={i} className="flex flex-col group/item relative">
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-slate-400 mb-0.5">{item.label}</span>
                  <Info className="w-3 h-3 text-slate-200 cursor-help mb-0.5" />
                  <div className="absolute bottom-full left-0 mb-2 w-40 p-2 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                    {item.tip}
                    <div className="absolute top-full left-4 border-4 border-transparent border-t-slate-800" />
                  </div>
                </div>
                <span className="text-sm font-bold text-slate-700">{item.value}人</span>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
            <span className="text-[11px] text-slate-400">更新于 10:24</span>
            <button className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 group/btn">
              查看详情 <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* 2. 触达效率 */}
        <div 
          onClick={() => {
            setActiveSlice('触达效率');
            setIsMultiView(false);
          }}
          className={cn(
            "bg-white p-5 rounded-xl border shadow-sm relative transition-all flex flex-col group cursor-pointer h-full",
            activeSlice === '触达效率' ? "border-blue-500 ring-1 ring-blue-500/20" : "border-slate-200 hover:border-slate-300"
          )}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <Phone className={cn(
                "w-4 h-4 transition-colors",
                activeSlice === '触达效率' ? "text-blue-500" : "text-slate-400"
              )} />
              <h3 className="text-sm font-bold text-slate-600">触达效率</h3>
              <div className="group relative">
                <Info className="w-3.5 h-3.5 text-slate-300 cursor-help" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                  有效接通率 = 接通量 ÷ 有效号码量（排除空号、停机后的号码）
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                </div>
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.3)] mt-1" />
          </div>

          <div className="flex items-baseline gap-2 mb-5">
            <span className="text-3xl font-bold text-slate-800 tracking-tight">78.1%</span>
            <span className="text-xs font-medium text-slate-400">接通率（有效号码）</span>
          </div>

          <div className="space-y-3.5 mb-5">
            <div className="flex justify-between items-center group/item relative">
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-slate-400">拨打总数</span>
                <Info className="w-3 h-3 text-slate-200 cursor-help" />
                <div className="absolute bottom-full left-0 mb-2 w-40 p-2 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                  任务执行期间尝试拨打的总号码次数
                  <div className="absolute top-full left-4 border-4 border-transparent border-t-slate-800" />
                </div>
              </div>
              <span className="text-sm font-bold text-slate-700">1,750</span>
            </div>
            
            <div className="flex justify-between items-center group/item relative">
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-slate-400">有效号码接通数</span>
                <Info className="w-3 h-3 text-slate-200 cursor-help" />
                <div className="absolute bottom-full left-0 mb-2 w-40 p-2 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                  成功接通且通话时长超过设定阈值的次数
                  <div className="absolute top-full left-4 border-4 border-transparent border-t-slate-800" />
                </div>
              </div>
              <span className="text-sm font-bold text-slate-700">1,066</span>
            </div>

            <div className="flex justify-between items-center group/item relative">
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-slate-400">有效号码未接数</span>
                <Info className="w-3 h-3 text-slate-200 cursor-help" />
                <div className="absolute bottom-full left-0 mb-2 w-40 p-2 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                  号码有效但因无人接听、拒接等原因未能成功通话
                  <div className="absolute top-full left-4 border-4 border-transparent border-t-slate-800" />
                </div>
              </div>
              <span className="text-sm font-bold text-slate-700">299</span>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
            <span className="text-[11px] text-slate-400">更新于 10:24</span>
            <button className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 group/btn">
              未接通列表 <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* 3. 号码质量 */}
        <div 
          onClick={() => {
            setActiveSlice('号码质量');
            setIsMultiView(false);
          }}
          className={cn(
            "bg-white p-5 rounded-xl border shadow-sm relative transition-all flex flex-col group cursor-pointer h-full",
            activeSlice === '号码质量' ? "border-blue-500 ring-1 ring-blue-500/20" : "border-slate-200 hover:border-slate-300"
          )}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className={cn(
                "w-4 h-4 transition-colors",
                activeSlice === '号码质量' ? "text-blue-500" : "text-slate-400"
              )} />
              <h3 className="text-sm font-bold text-slate-600">号码质量</h3>
              <div className="group relative">
                <Info className="w-3.5 h-3.5 text-slate-300 cursor-help" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                  有效号码占比 = 有效号码量 ÷ 总拨打量
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                </div>
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)] mt-1" />
          </div>

          <div className="flex items-baseline gap-2 mb-5">
            <span className="text-3xl font-bold text-amber-600 tracking-tight">385</span>
            <span className="text-sm font-medium text-slate-400">/ 1,750 (22.0%)</span>
            <span className="text-xs font-medium text-slate-400 ml-1">无效号码</span>
          </div>

          <div className="space-y-4 mb-5">
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] text-slate-400">无效号码构成</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-amber-600" />
                    <span className="text-[11px] font-bold text-slate-700">空号 231</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-[11px] font-bold text-slate-700">停机 116</span>
                  </div>
                </div>
              </div>
              <div className="flex h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-600" style={{ width: '60%' }} />
                <div className="h-full bg-amber-400" style={{ width: '30%' }} />
                <div className="h-full bg-amber-200" style={{ width: '10%' }} />
              </div>
            </div>

            <div className="flex justify-between items-center group/item relative pt-4 border-t border-slate-100">
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-slate-400">有效号码</span>
                <Info className="w-3 h-3 text-slate-200 cursor-help" />
                <div className="absolute bottom-full left-0 mb-2 w-40 p-2 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                  排除空号、停机、黑名单等无效状态后的可拨打号码
                  <div className="absolute top-full left-4 border-4 border-transparent border-t-slate-800" />
                </div>
              </div>
              <span className="text-sm font-bold text-slate-700">1,365 / 1,750 (78.0%)</span>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
            <span className="text-[11px] text-slate-400">更新于 10:24</span>
            <button className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 group/btn">
              导出无效号码 <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* 核心趋势分析区 - 栅格系统 */}
      <div className="grid grid-cols-12 gap-6">
        {/* 1. 任务成果趋势分析 */}
        <div className={cn(
          "bg-white rounded-xl border border-slate-200 shadow-sm p-6 transition-all duration-300",
          layoutMode === 'grid' ? "col-span-12 lg:col-span-6" : "col-span-12"
        )} data-figma-name="任务成果趋势分析">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                <UserCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="font-bold text-slate-800">任务成果趋势分析 ({participationStatus})</h3>
            </div>
            <div className="flex items-center gap-4">
              {participationStatus === '参加' ? [
                { label: '意向用户量', color: '#10B981' },
                { label: '在院内用餐', color: '#34D399' },
                { label: '确认预约时间', color: '#6EE7B7' }
              ].map(item => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] text-slate-500">{item.label}</span>
                </div>
              )) : [
                { label: '不参加总量', color: '#EF4444' },
                { label: '已经做过', color: '#F87171' },
                { label: '时间冲突', color: '#FCA5A5' }
              ].map(item => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] text-slate-500">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={initialTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                {participationStatus === '参加' ? (
                  <>
                    <Bar name="意向用户量" dataKey="intention" fill="#10B981" radius={[2, 2, 0, 0]} barSize={12} />
                    <Bar name="在院内用餐" dataKey="dineIn" fill="#34D399" radius={[2, 2, 0, 0]} barSize={12} />
                    <Bar name="确认预约时间" dataKey="confirmTime" fill="#6EE7B7" radius={[2, 2, 0, 0]} barSize={12} />
                  </>
                ) : (
                  <>
                    <Bar name="不参加总量" dataKey="notNeeded" fill="#EF4444" radius={[2, 2, 0, 0]} barSize={12} />
                    <Bar name="已经做过" dataKey="alreadyDone" fill="#F87171" radius={[2, 2, 0, 0]} barSize={12} />
                    <Bar name="时间冲突" dataKey="timeConflict" fill="#FCA5A5" radius={[2, 2, 0, 0]} barSize={12} />
                  </>
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. 触达效率趋势分析 */}
        <div className={cn(
          "bg-white rounded-xl border border-slate-200 shadow-sm p-6 transition-all duration-300",
          layoutMode === 'grid' ? "col-span-12 lg:col-span-6" : "col-span-12"
        )} data-figma-name="触达效率趋势分析">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <Activity className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="font-bold text-slate-800">触达效率趋势分析</h3>
            </div>
            <div className="flex items-center gap-4">
              {[
                { label: '接通率(有效号码)', color: '#2F54EB', type: 'line' },
                { label: '拨打总数', color: '#CBD5E1', type: 'bar' },
                { label: '有效号码接通数', color: '#818CF8', type: 'bar' },
                { label: '有效号码未接数', color: '#F87171', type: 'bar' }
              ].map(item => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <div className={cn("w-2 h-2 rounded-full", item.type === 'line' ? "border border-current bg-white" : "")} style={{ backgroundColor: item.color, color: item.color }} />
                  <span className="text-[10px] text-slate-500">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={initialTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} dy={10} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} domain={[0, 100]} />
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar yAxisId="left" name="拨打总数" dataKey="call" fill="#CBD5E1" radius={[2, 2, 0, 0]} barSize={12} />
                <Bar yAxisId="left" name="有效号码接通数" dataKey="connected" fill="#818CF8" radius={[2, 2, 0, 0]} barSize={12} />
                <Bar yAxisId="left" name="有效号码未接数" dataKey="effectiveUnreached" fill="#F87171" radius={[2, 2, 0, 0]} barSize={12} />
                <Line yAxisId="right" name="接通率(有效号码)" type="monotone" dataKey="effectiveRate" stroke="#2F54EB" strokeWidth={2} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. 号码质量趋势分析 */}
        <div className={cn(
          "bg-white rounded-xl border border-slate-200 shadow-sm p-6 transition-all duration-300",
          layoutMode === 'grid' ? "col-span-12 lg:col-span-6" : "col-span-12"
        )} data-figma-name="号码质量趋势分析">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
              </div>
              <h3 className="font-bold text-slate-800">号码质量趋势分析</h3>
            </div>
            <div className="flex items-center gap-2 flex-wrap max-w-[300px] justify-end">
              {[
                { label: '有效活号', color: '#F59E0B' },
                { label: '废号', color: '#FCD34D' },
                { label: '空号', color: '#FEF3C7' }
              ].map(item => (
                <div key={item.label} className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[9px] text-slate-500">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={initialTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar name="有效活号" dataKey="effectiveLive" fill="#F59E0B" radius={[2, 2, 0, 0]} barSize={10} />
                <Bar name="废号" dataKey="waste" fill="#FCD34D" radius={[2, 2, 0, 0]} barSize={10} />
                <Bar name="空号" dataKey="empty" fill="#FEF3C7" radius={[2, 2, 0, 0]} barSize={10} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. 客户关注点 */}
        <div className={cn(
          "bg-white rounded-xl border border-slate-200 shadow-sm p-6 transition-all duration-300",
          layoutMode === 'grid' ? "col-span-12 lg:col-span-6" : "col-span-12"
        )} data-figma-name="客户关注点">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-800">客户关注点</h3>
            <div className="flex items-center gap-4">
              <button className="text-blue-600 font-bold text-xs border-b-2 border-blue-600 pb-1">前十</button>
              <button className="text-slate-400 font-bold text-xs hover:text-slate-600">全部</button>
            </div>
          </div>
          <div className={cn(
            "grid gap-x-12 gap-y-8",
            layoutMode === 'list' ? "grid-cols-2" : "grid-cols-1"
          )}>
            {[
              { label: '询问电费金额', value: 5, total: 5, color: 'bg-blue-600' },
              { label: '询问是否是骗子', value: 3, total: 5, color: 'bg-cyan-400' },
              { label: '体检项目咨询', value: 2.5, total: 5, color: 'bg-emerald-500' },
              { label: '报告领取方式', value: 2, total: 5, color: 'bg-indigo-500' },
              { label: '交通路线咨询', value: 1.8, total: 5, color: 'bg-amber-500' },
              { label: '停车位咨询', value: 1.5, total: 5, color: 'bg-orange-500' },
              { label: '用餐环境询问', value: 1.2, total: 5, color: 'bg-rose-500' },
              { label: '其他咨询', value: 1, total: 5, color: 'bg-slate-200' },
              { label: '投诉建议', value: 0.8, total: 5, color: 'bg-slate-300' },
              { label: '合作咨询', value: 0.5, total: 5, color: 'bg-slate-400' }
            ].map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">{item.label}</span>
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-800">{Math.floor(item.value)}人</div>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.value / item.total) * 100}%` }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                    className={cn("h-full rounded-full", item.color)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. 工单标签多级透视 */}
        <div className="col-span-12 bg-white rounded-xl border border-slate-200 shadow-sm p-6" data-figma-name="工单标签多级透视">
          <div className="flex items-center gap-2 mb-6">
            <h3 className="font-bold text-slate-800">工单标签多级透视</h3>
            <Info className="w-3.5 h-3.5 text-slate-300 cursor-help" />
          </div>
          
          <div className="flex items-center gap-2 mb-8">
            <button 
              onClick={() => setParticipationStatus('参加')}
              className={cn(
                "px-6 py-2 rounded-lg text-xs font-bold transition-all border",
                participationStatus === '参加' 
                  ? "bg-blue-50 border-blue-200 text-blue-600 shadow-sm" 
                  : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50"
              )}
            >
              参加体检 <span className="ml-1 font-normal opacity-60">128人 (73%)</span>
            </button>
            <button 
              onClick={() => setParticipationStatus('不参加')}
              className={cn(
                "px-6 py-2 rounded-lg text-xs font-bold transition-all border",
                participationStatus === '不参加' 
                  ? "bg-blue-50 border-blue-200 text-blue-600 shadow-sm" 
                  : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50"
              )}
            >
              不参加 <span className="ml-1 font-normal opacity-60">48人 (27%)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(participationStatus === '参加' ? [
              { label: '在院内用餐', value: 90, rate: 70, color: 'bg-emerald-500' },
              { label: '确认预约时间', value: 128, rate: 100, color: 'bg-blue-500', active: true },
              { label: '知悉体检注意事项', value: 128, rate: 100, color: 'bg-indigo-500' },
              { label: '其他需求', value: 15, rate: 12, color: 'bg-purple-500', isAi: true }
            ] : [
              { label: '不需要体检', value: 25, rate: 52, color: 'bg-rose-500' },
              { label: '已经在别处做过', value: 15, rate: 31, color: 'bg-orange-500' },
              { label: '时间冲突', value: 5, rate: 10, color: 'bg-amber-500' },
              { label: '其他原因', value: 3, rate: 7, color: 'bg-slate-500', isAi: true }
            ]).map((card, i) => (
              <div key={i} className={cn(
                "p-5 rounded-xl border transition-all relative group",
                card.active ? "border-blue-200 bg-blue-50/30" : "border-slate-100 bg-slate-50/30"
              )}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-slate-600">{card.label}</span>
                  <div className="flex items-center gap-1">
                    {card.isAi && <span className="bg-purple-600 text-white text-[8px] px-1 rounded font-bold">AI</span>}
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl font-bold text-slate-800">{card.value}人</span>
                  <span className="text-[10px] text-slate-400">占比 {card.rate}%</span>
                </div>
                <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full", card.color)} style={{ width: `${card.rate}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. 每日明细数据明细 */}
        <div className="col-span-12 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" data-figma-name="每日明细数据明细">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">每日明细数据明细</h3>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-[11px] font-bold border border-slate-200 hover:bg-slate-100">
              <Download className="w-3.5 h-3.5" />
              导出报表
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="px-6 py-4 cursor-pointer hover:text-blue-600 group" onClick={() => handleSort('name')}>
                    <div className="flex items-center">日期 <SortIcon column="name" /></div>
                  </th>
                  <th className="px-4 py-4 text-center cursor-pointer hover:text-blue-600 group" onClick={() => handleSort('call')}>
                    <div className="flex items-center justify-center">拨打总数 <SortIcon column="call" /></div>
                  </th>
                  <th className="px-4 py-4 text-center cursor-pointer hover:text-blue-600 group" onClick={() => handleSort('connected')}>
                    <div className="flex items-center justify-center">有效号码接通数 <SortIcon column="connected" /></div>
                  </th>
                  <th className="px-4 py-4 text-center cursor-pointer hover:text-blue-600 group" onClick={() => handleSort('totalRate')}>
                    <div className="flex items-center justify-center">接通率 <SortIcon column="totalRate" /></div>
                  </th>
                  <th className="px-4 py-4 text-center cursor-pointer hover:text-blue-600 group" onClick={() => handleSort('effectiveRate')}>
                    <div className="flex items-center justify-center">有效接通率 <SortIcon column="effectiveRate" /></div>
                  </th>
                  <th className="px-4 py-4 text-center cursor-pointer hover:text-blue-600 group" onClick={() => handleSort('missed')}>
                    <div className="flex items-center justify-center">未接总量 <SortIcon column="missed" /></div>
                  </th>
                  <th className="px-4 py-4 text-center cursor-pointer hover:text-blue-600 group" onClick={() => handleSort('waste')}>
                    <div className="flex items-center justify-center">无效号码 <SortIcon column="waste" /></div>
                  </th>
                  <th className="px-4 py-4 text-center cursor-pointer hover:text-blue-600 group" onClick={() => handleSort('effectiveUnreached')}>
                    <div className="flex items-center justify-center">有效号码未接数 <SortIcon column="effectiveUnreached" /></div>
                  </th>
                  <th className="px-4 py-4 text-center cursor-pointer hover:text-blue-600 group" onClick={() => handleSort('intention')}>
                    <div className="flex items-center justify-center">拨打成果量 <SortIcon column="intention" /></div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {sortedData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-slate-700">{row.name}</td>
                    <td className="px-4 py-4 text-center text-xs text-slate-500">{row.call}</td>
                    <td className="px-4 py-4 text-center text-xs font-bold text-blue-600">{row.connected}</td>
                    <td className="px-4 py-4 text-center text-xs text-slate-500">{row.totalRate}%</td>
                    <td className="px-4 py-4 text-center text-xs font-bold text-emerald-600">{row.effectiveRate}%</td>
                    <td className="px-4 py-4 text-center text-xs font-bold text-rose-500">{row.missed}</td>
                    <td className="px-4 py-4 text-center text-xs text-slate-500">{row.waste}</td>
                    <td className="px-4 py-4 text-center text-xs text-slate-500">{row.effectiveUnreached}</td>
                    <td className="px-4 py-4 text-center text-xs font-bold text-rose-600">{row.intention}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* 分页器 */}
          <div className="p-6 border-t border-slate-50 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">共 400 条</span>
            <div className="flex items-center gap-4">
              <select className="bg-slate-50 border-none text-[10px] font-bold text-slate-600 rounded-lg px-2 py-1 outline-none">
                <option>20条/页</option>
                <option>50条/页</option>
              </select>
              <div className="flex items-center gap-2">
                <button className="p-1.5 text-slate-300 hover:text-slate-600"><ChevronLeft className="w-4 h-4" /></button>
                <span className="w-6 h-6 bg-blue-600 text-white rounded-md flex items-center justify-center text-[10px] font-bold">1</span>
                <span className="text-slate-400 text-[10px]">...</span>
                <span className="w-6 h-6 text-slate-500 hover:bg-slate-50 rounded-md flex items-center justify-center text-[10px] font-bold">3</span>
                <span className="w-6 h-6 text-slate-500 hover:bg-slate-50 rounded-md flex items-center justify-center text-[10px] font-bold">4</span>
                <button className="p-1.5 text-slate-300 hover:text-slate-600"><ChevronRight className="w-4 h-4" /></button>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                <span>前往</span>
                <input type="text" className="w-8 h-6 bg-slate-50 border border-slate-200 rounded text-center text-slate-700 outline-none" defaultValue="4" />
                <span>页</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
