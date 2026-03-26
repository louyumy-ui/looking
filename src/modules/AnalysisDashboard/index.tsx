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
    effectiveLive: 200, 
    effectiveUnreached: 55, notSelf: 18, refused: 12, noAnswer: 20, shutDown: 5,
    intention: 95, conversionRate: 39.3,
    dineIn: 42, confirmTime: 62, precautions: 58, others: 9,
    notNeeded: 14, alreadyDone: 9, timeConflict: 5, otherReasons: 2
  },
  { 
    name: '03-07', 
    call: 245, connected: 151, totalRate: 61.6, effectiveRate: 79.5, missed: 94, 
    waste: 55, empty: 30, powerOff: 25,
    effectiveLive: 190, 
    effectiveUnreached: 39, notSelf: 13, refused: 9, noAnswer: 12, shutDown: 5,
    intention: 98, conversionRate: 41.7,
    dineIn: 45, confirmTime: 65, precautions: 60, others: 8,
    notNeeded: 12, alreadyDone: 8, timeConflict: 5, otherReasons: 2
  },
];

export const AnalysisDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'day' | 'month' | 'year'>('day');
  const [activeSlice, setActiveSlice] = useState('任务成果');
  const [isMultiView, setIsMultiView] = useState(true);
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

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-[#2F54EB] rounded-full" />
          <h2 className="text-lg font-bold text-slate-800">趋势分析</h2>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="relative flex items-center">
              <input 
                type="checkbox" 
                id="multi-view" 
                checked={isMultiView} 
                onChange={(e) => setIsMultiView(e.target.checked)}
                className="peer appearance-none w-5 h-5 rounded border-2 border-slate-200 checked:border-[#2F54EB] checked:bg-[#2F54EB] transition-all cursor-pointer"
              />
              <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none left-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <label htmlFor="multi-view" className="text-sm font-bold text-slate-600 cursor-pointer select-none">多选</label>
          </div>
        </div>
      </div>

      {/* 顶部 3 指标卡片 - B端专业风格优化 (更内敛、协调) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. 任务成果 */}
        <div 
          onClick={() => {
            setActiveSlice('任务成果');
            setIsMultiView(false);
          }}
          className={cn(
            "bg-white p-4 rounded-xl border shadow-sm relative transition-all flex flex-col group cursor-pointer h-full",
            activeSlice === '任务成果' ? "border-blue-500" : "border-slate-100 hover:border-slate-200"
          )}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <UserCheck className={cn(
                "w-4 h-4 transition-colors",
                activeSlice === '任务成果' ? "text-blue-500" : "text-slate-400"
              )} />
              <h3 className="text-xs font-bold text-slate-500">任务成果</h3>
              <div className="group relative">
                <Info className="w-3 h-3 text-slate-300 cursor-help" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                  根据您设置的任务目标，成功达成的任务结果总数
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                </div>
              </div>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)] mt-1" />
          </div>

          <div className="flex items-baseline gap-1.5 mb-4">
            <span className="text-xl font-bold text-slate-800 tracking-tight">361</span>
            <span className="text-[10px] font-medium text-slate-400">意向用户 (人)</span>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
            {[
              { label: '在院内用餐', value: '90', tip: '用户明确表示会在医院食堂或指定区域用餐' },
              { label: '确认预约时间', value: '128', tip: '用户已确认具体的体检或到访时间' },
              { label: '知悉体检注意事项', value: '128', tip: '用户已阅读并确认了解体检前的相关准备工作' },
              { label: '其他需求', value: '15', tip: '用户提出的非核心目标需求，如咨询交通、停车等' }
            ].map((item, i) => (
              <div key={i} className="flex flex-col group/item relative">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-slate-400 mb-0.5">{item.label}</span>
                  <Info className="w-2.5 h-2.5 text-slate-200 cursor-help mb-0.5" />
                  <div className="absolute bottom-full left-0 mb-2 w-40 p-2 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                    {item.tip}
                    <div className="absolute top-full left-4 border-4 border-transparent border-t-slate-800" />
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-700">{item.value}人</span>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-3 border-t border-slate-50 flex justify-between items-center">
            <span className="text-[10px] text-slate-300">更新于 10:24</span>
            <button className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 group/btn">
              查看详情 <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
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
            "bg-white p-4 rounded-xl border shadow-sm relative transition-all flex flex-col group cursor-pointer h-full",
            activeSlice === '触达效率' ? "border-blue-500" : "border-slate-100 hover:border-slate-200"
          )}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <Phone className={cn(
                "w-4 h-4 transition-colors",
                activeSlice === '触达效率' ? "text-blue-500" : "text-slate-400"
              )} />
              <h3 className="text-xs font-bold text-slate-500">触达效率</h3>
              <div className="group relative">
                <Info className="w-3 h-3 text-slate-300 cursor-help" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                  有效接通率 = 接通量 ÷ 有效号码量（排除空号、停机后的号码）
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                </div>
              </div>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.4)] mt-1" />
          </div>

          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-2xl font-bold text-slate-800 tracking-tight">78.1%</span>
            <span className="text-[10px] font-medium text-slate-400 ml-1.5">接通率（有效号码）</span>
          </div>

          <div className="space-y-2.5 mb-4">
            <div className="flex justify-between items-center group/item relative">
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-400">拨打总数</span>
                <Info className="w-2.5 h-2.5 text-slate-200 cursor-help" />
                <div className="absolute bottom-full left-0 mb-2 w-40 p-2 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                  任务执行期间尝试拨打的总号码次数
                  <div className="absolute top-full left-4 border-4 border-transparent border-t-slate-800" />
                </div>
              </div>
              <span className="text-xs font-bold text-slate-700">1,750</span>
            </div>
            
            <div className="flex justify-between items-center group/item relative">
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-400">有效号码接通数</span>
                <Info className="w-2.5 h-2.5 text-slate-200 cursor-help" />
                <div className="absolute bottom-full left-0 mb-2 w-40 p-2 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                  成功接通且通话时长超过设定阈值的次数
                  <div className="absolute top-full left-4 border-4 border-transparent border-t-slate-800" />
                </div>
              </div>
              <span className="text-xs font-bold text-slate-700">1,066</span>
            </div>

            <div className="flex justify-between items-center group/item relative">
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-400">有效号码未接数</span>
                <Info className="w-2.5 h-2.5 text-slate-200 cursor-help" />
                <div className="absolute bottom-full left-0 mb-2 w-40 p-2 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                  号码有效但因无人接听、拒接等原因未能成功通话
                  <div className="absolute top-full left-4 border-4 border-transparent border-t-slate-800" />
                </div>
              </div>
              <span className="text-xs font-bold text-slate-700">299</span>
            </div>

            <div className="h-1 bg-slate-100 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: '78.1%' }} />
            </div>
          </div>

          <div className="mt-auto pt-3 border-t border-slate-50 flex justify-between items-center">
            <span className="text-[10px] text-slate-300">更新于 10:24</span>
            <button className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 group/btn">
              未接通列表 <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
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
            "bg-white p-4 rounded-xl border shadow-sm relative transition-all flex flex-col group cursor-pointer h-full",
            activeSlice === '号码质量' ? "border-blue-500" : "border-slate-100 hover:border-slate-200"
          )}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className={cn(
                "w-4 h-4 transition-colors",
                activeSlice === '号码质量' ? "text-blue-500" : "text-slate-400"
              )} />
              <h3 className="text-xs font-bold text-slate-500">号码质量</h3>
              <div className="group relative">
                <Info className="w-3 h-3 text-slate-300 cursor-help" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                  有效号码占比 = 有效号码量 ÷ 总拨打量
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                </div>
              </div>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.4)] mt-1" />
          </div>

          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-bold text-amber-600 tracking-tight">385</span>
            <span className="text-lg font-bold text-amber-600 tracking-tight">(22.0%)</span>
            <span className="text-[10px] font-medium text-slate-400 ml-1">无效号码</span>
          </div>

          <div className="space-y-3 mb-4">
            <div className="pt-3 border-t border-slate-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-slate-400">无效号码构成</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                    <span className="text-[10px] font-bold text-slate-700">空号 231</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span className="text-[10px] font-bold text-slate-700">停机 116</span>
                  </div>
                </div>
              </div>
              <div className="flex h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-600" style={{ width: '60%' }} />
                <div className="h-full bg-amber-400" style={{ width: '30%' }} />
                <div className="h-full bg-amber-200" style={{ width: '10%' }} />
              </div>
            </div>

            <div className="flex justify-between items-center group/item relative pt-3 border-t border-slate-50">
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-400">有效号码</span>
                <Info className="w-2.5 h-2.5 text-slate-200 cursor-help" />
                <div className="absolute bottom-full left-0 mb-2 w-40 p-2 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                  排除空号、停机、黑名单等无效状态后的可拨打号码
                  <div className="absolute top-full left-4 border-4 border-transparent border-t-slate-800" />
                </div>
              </div>
              <span className="text-xs font-bold text-slate-700">1,365 (78.0%)</span>
            </div>
          </div>

          <div className="mt-auto pt-3 border-t border-slate-50 flex justify-between items-center">
            <span className="text-[10px] text-slate-300">更新于 10:24</span>
            <button className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 group/btn">
              导出无效号码 <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <div className={cn("grid gap-6", isMultiView ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1")}>
        {(() => {
          const slices = ['任务成果', '触达效率', '号码质量'];
          const activeSlices = isMultiView ? slices : [activeSlice];

          return activeSlices.map((slice) => {
            const chartConfig = {
              '任务成果': { 
                title: `任务成果趋势分析 (${participationStatus})`, 
                icon: UserCheck, 
                color: '#10B981', 
                keys: participationStatus === '参加' 
                  ? ['intention', 'dineIn', 'confirmTime', 'precautions', 'others']
                  : ['intention', 'notNeeded', 'alreadyDone', 'timeConflict', 'otherReasons'],
                labels: participationStatus === '参加'
                  ? ['意向用户量', '在院内用餐', '确认预约时间', '知悉体检注意事项', '其他需求']
                  : ['意向用户量', '不需要', '已体检', '时间冲突', '其他']
              },
              '触达效率': { 
                title: '触达效率趋势分析', 
                icon: Activity, 
                color: '#6366F1', 
                keys: ['effectiveRate', 'call', 'connected', 'effectiveUnreached'], 
                labels: ['有效接通率', '总拨打量', '有效接通数', '有效未触达'] 
              },
              '号码质量': { 
                title: '号码质量趋势分析', 
                icon: ShieldCheck, 
                color: '#F59E0B', 
                keys: ['effectiveLive', 'waste', 'empty', 'powerOff', 'effectiveUnreached', 'notSelf', 'refused', 'noAnswer', 'shutDown'], 
                labels: ['有效活号', '废号', '空号', '停机', '有效未触达', '非本人', '用户拒接', '无人接听', '关机'] 
              },
            }[slice as keyof typeof chartConfig] || { title: '趋势分析', icon: Activity, color: '#2F54EB', keys: ['call'], labels: ['数据'] };

            return (
              <div key={slice} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: chartConfig.color }}>
                      <chartConfig.icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm">{chartConfig.title}</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 max-w-[60%]">
                      {chartConfig.labels.map((l, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: chartConfig.color, opacity: 1 - (i * 0.1) }} />
                          <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">{l}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={initialTrendData} barGap={4}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} dy={10} />
                      <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                      <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} hide={!chartConfig.keys.some(k => k.toLowerCase().includes('rate'))} />
                      <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                      {chartConfig.keys.map((key, i) => {
                        const isRate = key.toLowerCase().includes('rate');
                        if (isRate) {
                          return (
                            <Line 
                              key={key}
                              yAxisId="right"
                              type="monotone"
                              dataKey={key}
                              stroke={chartConfig.color}
                              strokeWidth={3}
                              strokeDasharray={slice === '触达效率' ? "5 5" : "0"}
                              strokeOpacity={1 - (i * 0.1)}
                              connectNulls={true}
                              dot={{ r: 4, fill: chartConfig.color, strokeWidth: 2, stroke: '#fff', fillOpacity: 1 - (i * 0.1) }}
                              name={chartConfig.labels[i]}
                            />
                          );
                        }
                        return (
                          <Bar 
                            key={key} 
                            yAxisId="left"
                            dataKey={key} 
                            fill={chartConfig.color} 
                            fillOpacity={1 - (i * 0.1)} 
                            radius={[4, 4, 0, 0]}
                            barSize={isMultiView ? (slice === '号码质量' || slice === '任务成果' ? 6 : 12) : (slice === '号码质量' || slice === '任务成果' ? 12 : 24)}
                            name={chartConfig.labels[i]}
                          />
                        );
                      })}
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            );
          });
        })()}
      </div>

      {/* 客户关注点 */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-bold text-slate-800">客户关注点</h2>
          <div className="flex items-center gap-6">
            <button className="text-blue-600 font-bold text-sm border-b-2 border-blue-600 pb-1">前十</button>
            <button className="text-slate-400 font-bold text-sm">全部</button>
          </div>
        </div>
        <div className="space-y-10">
          {[
            { label: '询问电费金额', count: 5, people: 5, color: '#2F54EB' },
            { label: '询问是否是骗子', count: 3, people: 3, color: '#00D1FF' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-6 group">
              <span className="w-32 text-sm font-bold text-slate-500 text-right group-hover:text-slate-800 transition-colors">{item.label}</span>
              <div className="flex-1 h-4 bg-slate-50 rounded-full relative border border-slate-100">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.count / 5) * 100}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  className="absolute inset-y-0 left-0 rounded-full shadow-lg shadow-blue-500/20"
                  style={{ backgroundColor: item.color }}
                />
                <div className="absolute -right-8 -top-6 text-xs font-bold text-slate-400">{item.people}人</div>
                <div className="absolute -right-8 -bottom-6 text-xs font-bold text-slate-800">{item.count}次</div>
              </div>
              <div className="w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* 工单标签多级透视 */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-800">工单标签多级透视</h3>
          <Info className="w-4 h-4 text-slate-300" />
          <span className="text-xs text-slate-400">点击卡片可钻取详情</span>
        </div>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
          <button 
            onClick={() => setParticipationStatus('参加')}
            className={cn(
              "px-8 py-2 rounded-lg shadow-sm font-bold text-sm transition-all",
              participationStatus === '参加' ? "bg-white text-blue-600" : "text-slate-500 hover:bg-slate-200"
            )}
          >
            参加体检
            <div className="text-[10px] opacity-70 font-bold">128人 (73%)</div>
          </button>
          <button 
            onClick={() => setParticipationStatus('不参加')}
            className={cn(
              "px-8 py-2 rounded-lg font-bold text-sm transition-all",
              participationStatus === '不参加' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:bg-slate-200"
            )}
          >
            不参加
            <div className="text-[10px] opacity-70 font-bold">48人 (27%)</div>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(participationStatus === '参加' ? [
            { title: '在院内用餐', value: '90人', sub: '占比 70%', color: 'orange' },
            { title: '确认预约时间', value: '128人', sub: '占比 100%', color: 'blue' },
            { title: '知悉体检注意事项', value: '128人', sub: '占比 100%', color: 'green' },
            { title: '其他需求', value: '15人', sub: '占比 12%', color: 'purple', badge: 'AI' },
          ] : [
            { title: '不需要', value: '20人', sub: '占比 42%', color: 'rose' },
            { title: '已体检', value: '15人', sub: '占比 31%', color: 'amber' },
            { title: '时间冲突', value: '10人', sub: '占比 21%', color: 'slate' },
            { title: '其他', value: '3人', sub: '占比 6%', color: 'gray' },
          ]).map((card, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm relative group cursor-pointer hover:shadow-md transition-all">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-slate-800">{card.title}</span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className={cn("text-2xl font-bold", `text-${card.color}-500`)}>{card.value}</span>
                <span className={cn("text-xs font-bold", `text-${card.color}-400`)}>{card.sub}</span>
              </div>
              <div className={cn("h-1.5 w-full bg-slate-100 rounded-full mt-4 overflow-hidden")}>
                <div className={cn("h-full rounded-full", `bg-${card.color}-500`)} style={{ width: card.sub.split(' ')[1] }} />
              </div>
              {card.badge && (
                <span className="absolute top-6 right-10 bg-purple-600 text-white text-[8px] px-1.5 py-0.5 rounded font-bold">{card.badge}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 底部明细表格 */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">每日明细数据明细</h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all">
            <Download className="w-4 h-4" />
            导出报表
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('name')}>
                  <div className="flex items-center">日期 <SortIcon column="name" /></div>
                </th>
                <th className="px-4 py-4 text-center cursor-pointer hover:text-blue-600 group" onClick={() => handleSort('call')}>
                  <div className="flex items-center justify-center">拨打总量 <SortIcon column="call" /></div>
                </th>
                <th className="px-4 py-4 text-center cursor-pointer hover:text-blue-600 group" onClick={() => handleSort('connected')}>
                  <div className="flex items-center justify-center">接通总量 <SortIcon column="connected" /></div>
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
                  <div className="flex items-center justify-center">废号总量 (空号+停机) <SortIcon column="waste" /></div>
                </th>
                <th className="px-4 py-4 text-center cursor-pointer hover:text-blue-600 group" onClick={() => handleSort('effectiveUnreached')}>
                  <div className="flex items-center justify-center">有效未触达总量 <SortIcon column="effectiveUnreached" /></div>
                </th>
                <th className="px-4 py-4 text-center cursor-pointer hover:text-blue-600 group" onClick={() => handleSort('result')}>
                  <div className="flex items-center justify-center">拨打成果量 <SortIcon column="result" /></div>
                </th>
                <th className="px-4 py-4 text-center cursor-pointer hover:text-blue-600 group" onClick={() => handleSort('conversionRate')}>
                  <div className="flex items-center justify-center">转化率 <SortIcon column="conversionRate" /></div>
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
                  <td className="px-4 py-4 text-center text-xs font-bold text-rose-600">{row.result}</td>
                  <td className="px-4 py-4 text-center text-xs font-bold text-rose-500">{row.conversionRate}%</td>
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
  );
};
