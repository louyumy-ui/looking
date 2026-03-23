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
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, LabelList
} from 'recharts';
import { motion } from 'motion/react';
import { copyDomToFigmaSvg } from '@/src/lib/figma';

// 模拟趋势数据 - 与顶部汇总数据完全对应
const initialTrendData = [
  { name: '03-01', call: 250, connected: 150, totalRate: 60.0, effectiveRate: 76.9, missed: 100, waste: 55, effectiveLive: 195, effectiveUnreached: 45, intention: 98, conversionRate: 38.7 },
  { name: '03-02', call: 240, connected: 160, totalRate: 66.7, effectiveRate: 84.2, missed: 80, waste: 50, effectiveLive: 190, effectiveUnreached: 30, intention: 105, conversionRate: 38.8 },
  { name: '03-03', call: 260, connected: 140, totalRate: 53.8, effectiveRate: 70.0, missed: 120, waste: 60, effectiveLive: 200, effectiveUnreached: 60, intention: 92, conversionRate: 39.3 },
  { name: '03-04', call: 230, connected: 155, totalRate: 67.4, effectiveRate: 83.8, missed: 75, waste: 45, effectiveLive: 185, effectiveUnreached: 30, intention: 112, conversionRate: 41.9 },
  { name: '03-05', call: 270, connected: 165, totalRate: 61.1, effectiveRate: 80.5, missed: 105, waste: 65, effectiveLive: 205, effectiveUnreached: 40, intention: 88, conversionRate: 36.4 },
  { name: '03-06', call: 255, connected: 145, totalRate: 56.9, effectiveRate: 72.5, missed: 110, waste: 55, effectiveLive: 200, effectiveUnreached: 55, intention: 95, conversionRate: 39.3 },
  { name: '03-07', call: 245, connected: 151, totalRate: 61.6, effectiveRate: 79.5, missed: 94, waste: 55, effectiveLive: 190, effectiveUnreached: 39, intention: 98, conversionRate: 41.7 },
];

export const AnalysisDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'day' | 'month' | 'year'>('day');
  const [activeSlice, setActiveSlice] = useState('通话结果');
  const [isMultiView, setIsMultiView] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null }>({ key: 'name', direction: null });

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
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
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
          <div className="w-1 h-4 bg-[#2B7FFF] rounded-full" />
          <h2 className="text-lg font-black text-slate-800">趋势分析</h2>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="relative flex items-center">
              <input 
                type="checkbox" 
                id="multi-view" 
                checked={isMultiView} 
                onChange={(e) => setIsMultiView(e.target.checked)}
                className="peer appearance-none w-5 h-5 rounded border-2 border-slate-200 checked:border-[#2B7FFF] checked:bg-[#2B7FFF] transition-all cursor-pointer"
              />
              <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none left-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <label htmlFor="multi-view" className="text-sm font-bold text-slate-600 cursor-pointer select-none">多选</label>
          </div>
        </div>
      </div>

      {/* 顶部 4 指标卡片 - 外呼全链路逻辑 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. 通话结果 */}
        <div 
          onClick={() => {
            setActiveSlice('通话结果');
            setIsMultiView(false);
          }}
          className={cn(
            "bg-white p-6 rounded-2xl border shadow-sm relative overflow-hidden group cursor-pointer transition-all",
            activeSlice === '通话结果' ? "border-[#2B7FFF] ring-2 ring-[#2B7FFF]/10 shadow-md" : "border-slate-100 hover:border-[#2B7FFF]/50"
          )}
        >
          <div className="flex justify-between items-start">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all",
              activeSlice === '通话结果' ? "bg-[#2B7FFF] shadow-lg shadow-[#2B7FFF]/30" : "bg-slate-400 group-hover:bg-[#2B7FFF]/80"
            )}>
              <Phone className="w-6 h-6" />
            </div>
            <div className="w-2 h-2 rounded-full bg-blue-500" />
          </div>
          <div className="mt-5">
            <p className="text-base font-black text-slate-500 uppercase tracking-[0.2em]">通话结果</p>
            <div className="flex items-baseline gap-4 mt-3">
              <span className="text-sm font-bold text-slate-400">拨打总量</span>
              <span className="text-6xl font-black text-[#2B7FFF] tracking-tighter">1,750</span>
            </div>
          </div>
          <div className="mt-6 space-y-3 text-sm font-bold border-t border-slate-50 pt-5">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold">接通量</span>
              <span className="text-slate-800 text-lg font-black">1,066</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold">未接总量</span>
              <span className="text-slate-800 text-lg font-black">684</span>
            </div>
          </div>
        </div>

        {/* 2. 有效接通率 */}
        <div 
          onClick={() => {
            setActiveSlice('有效接通率');
            setIsMultiView(false);
          }}
          className={cn(
            "bg-white p-6 rounded-2xl border shadow-sm relative overflow-hidden group cursor-pointer transition-all",
            activeSlice === '有效接通率' ? "border-[#2B7FFF] ring-2 ring-[#2B7FFF]/10 shadow-md" : "border-slate-100 hover:border-[#2B7FFF]/50"
          )}
        >
          <div className="flex justify-between items-start">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all",
              activeSlice === '有效接通率' ? "bg-[#2B7FFF] shadow-lg shadow-[#2B7FFF]/30" : "bg-slate-400 group-hover:bg-[#2B7FFF]/80"
            )}>
              <Activity className="w-6 h-6" />
            </div>
            <div className="w-2 h-2 rounded-full bg-blue-500" />
          </div>
          <div className="mt-5">
            <p className="text-base font-black text-slate-500 uppercase tracking-[0.2em]">有效接通率</p>
            <div className="flex items-baseline gap-4 mt-3">
              <span className="text-6xl font-black text-[#006040] tracking-tighter">78.1%</span>
            </div>
          </div>
          <div className="mt-6 space-y-3 text-sm font-bold border-t border-slate-50 pt-5">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold">有效活号</span>
              <span className="text-slate-800 text-lg font-black">1,365</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold">有效接通</span>
              <span className="text-slate-800 text-lg font-black">1,066</span>
            </div>
          </div>
        </div>

        {/* 3. 号码质量 */}
        <div 
          onClick={() => {
            setActiveSlice('号码质量');
            setIsMultiView(false);
          }}
          className={cn(
            "bg-white p-6 rounded-2xl border shadow-sm relative overflow-hidden group cursor-pointer transition-all",
            activeSlice === '号码质量' ? "border-[#2B7FFF] ring-2 ring-[#2B7FFF]/10 shadow-md" : "border-slate-100 hover:border-[#2B7FFF]/50"
          )}
        >
          <div className="flex justify-between items-start">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all",
              activeSlice === '号码质量' ? "bg-[#2B7FFF] shadow-lg shadow-[#2B7FFF]/30" : "bg-slate-400 group-hover:bg-[#2B7FFF]/80"
            )}>
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="w-2 h-2 rounded-full bg-blue-500" />
          </div>
          <div className="mt-5">
            <p className="text-base font-black text-slate-500 uppercase tracking-[0.2em]">号码质量</p>
            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-sm font-bold text-slate-400">废号/总量</span>
              <span className="text-6xl font-black text-[#2B7FFF] tracking-tighter">385</span>
              <span className="text-xl font-bold text-slate-300">/ 1,600</span>
            </div>
          </div>
          <div className="mt-6 space-y-3 text-sm font-bold border-t border-slate-50 pt-5">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold">有效活号</span>
              <span className="text-slate-800 text-lg font-black">1,365</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold">有效未触达</span>
              <span className="text-slate-800 text-lg font-black">299</span>
            </div>
          </div>
        </div>

        {/* 4. 意向用户 */}
        <div 
          onClick={() => {
            setActiveSlice('意向用户');
            setIsMultiView(false);
          }}
          className={cn(
            "bg-white p-6 rounded-2xl border shadow-sm relative overflow-hidden group cursor-pointer transition-all",
            activeSlice === '意向用户' ? "border-[#2B7FFF] ring-2 ring-[#2B7FFF]/10 shadow-md" : "border-slate-100 hover:border-[#2B7FFF]/50"
          )}
        >
          <div className="flex justify-between items-start">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all",
              activeSlice === '意向用户' ? "bg-[#2B7FFF] shadow-lg shadow-[#2B7FFF]/30" : "bg-slate-400 group-hover:bg-[#2B7FFF]/80"
            )}>
              <UserCheck className="w-6 h-6" />
            </div>
            <div className="w-2 h-2 rounded-full bg-blue-500" />
          </div>
          <div className="mt-5">
            <p className="text-base font-black text-slate-500 uppercase tracking-[0.2em]">意向用户</p>
            <div className="flex items-baseline gap-4 mt-3">
              <span className="text-6xl font-black text-[#2B7FFF] tracking-tighter">688</span>
            </div>
          </div>
          <div className="mt-6 space-y-3 text-sm font-bold border-t border-slate-50 pt-5">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold">在院内用餐</span>
              <span className="text-slate-800 text-lg font-black">90人</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold">确认预约时间</span>
              <span className="text-slate-800 text-lg font-black">128人</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold">知悉体检注意事项</span>
              <span className="text-slate-800 text-lg font-black">128人</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold">其他需求</span>
              <span className="text-slate-800 text-lg font-black">15人</span>
            </div>
          </div>
        </div>
      </div>

      <div className={cn("grid gap-6", isMultiView ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1")}>
        {(() => {
          const slices = ['通话结果', '有效接通率', '号码质量', '意向用户'];
          const activeSlices = isMultiView ? slices : [activeSlice];

          return activeSlices.map((slice) => {
            const chartConfig = {
              '通话结果': { title: '通话结果趋势分析', icon: Phone, colors: ['#7C90A0', '#B5838D', '#96A696'], keys: ['call', 'connected', 'missed'], labels: ['拨打总量', '接通量', '未接总量'] },
              '号码质量': { title: '号码质量趋势分析', icon: ShieldCheck, colors: ['#C2A385', '#84A59D', '#A8A8A8'], keys: ['waste', 'effectiveLive', 'effectiveUnreached'], labels: ['废号总量', '有效活号', '有效未触达'] },
              '有效接通率': { title: '有效接通率趋势分析', icon: Activity, colors: ['#84A59D', '#7C90A0', '#2B7FFF'], keys: ['effectiveLive', 'connected', 'effectiveRate'], labels: ['有效活号', '有效接通', '有效接通率'] },
              '意向用户': { title: '意向用户趋势分析', icon: UserCheck, colors: ['#E09F7D', '#7C90A0'], keys: ['intention', 'conversionRate'], labels: ['意向用户量', '转化率'] },
            }[slice as keyof typeof chartConfig] || { title: '趋势分析', icon: Activity, colors: ['#2B7FFF'], keys: ['call'], labels: ['数据'] };

            return (
              <div key={slice} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: chartConfig.colors[0] }}>
                      <chartConfig.icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm">{chartConfig.title}</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-4">
                      {chartConfig.labels.map((l, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: chartConfig.colors[i] }} />
                          <span className="text-[10px] font-bold text-slate-500">{l}</span>
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
                              stroke={chartConfig.colors[i]}
                              strokeWidth={3}
                              strokeDasharray={i > 0 && slice !== '有效接通率' ? "5 5" : "0"}
                              connectNulls={true}
                              dot={{ r: 4, fill: chartConfig.colors[i], strokeWidth: 2, stroke: '#fff' }}
                              name={chartConfig.labels[i]}
                            >
                              {slice === '有效接通率' && (
                                <LabelList 
                                  dataKey={key} 
                                  position="top" 
                                  offset={10} 
                                  formatter={(v: number) => `${v}%`}
                                  style={{ fill: chartConfig.colors[i], fontSize: 10, fontWeight: 'bold' }}
                                />
                              )}
                            </Line>
                          );
                        }
                        return (
                          <Bar 
                            key={key} 
                            yAxisId="left"
                            dataKey={key} 
                            fill={chartConfig.colors[i]} 
                            radius={[4, 4, 0, 0]}
                            barSize={isMultiView ? 12 : 24}
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
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-slate-800">客户关注点</h2>
          <div className="flex items-center gap-6">
            <button className="text-blue-600 font-black text-lg border-b-2 border-blue-600 pb-1">前十</button>
            <button className="text-slate-400 font-bold text-lg">全部</button>
          </div>
        </div>
        <div className="space-y-10">
          {[
            { label: '询问电费金额', count: 5, people: 5, color: '#2B7FFF' },
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
                <div className="absolute -right-8 -top-6 text-xs font-black text-slate-400">{item.people}人</div>
                <div className="absolute -right-8 -bottom-6 text-xs font-black text-slate-800">{item.count}次</div>
              </div>
              <div className="w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* 工单标签多级透视 */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="font-black text-slate-800">工单标签多级透视</h3>
          <Info className="w-4 h-4 text-slate-300" />
          <span className="text-xs text-slate-400">点击卡片可钻取详情</span>
        </div>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
          <button className="px-8 py-2 bg-white text-blue-600 rounded-lg shadow-sm font-black text-sm">
            参加体检
            <div className="text-[10px] opacity-70 font-bold">128人 (73%)</div>
          </button>
          <button className="px-8 py-2 text-slate-500 font-bold text-sm">
            不参加
            <div className="text-[10px] opacity-70 font-bold">48人 (27%)</div>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: '在院内用餐', value: '90人', sub: '占比 70%', color: 'orange' },
            { title: '确认预约时间', value: '128人', sub: '占比 100%', color: 'blue' },
            { title: '知悉体检注意事项', value: '128人', sub: '占比 100%', color: 'green' },
            { title: '其他需求', value: '15人', sub: '占比 12%', color: 'purple', badge: 'AI' },
          ].map((card, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative group cursor-pointer hover:shadow-md transition-all">
              <div className="flex justify-between items-center mb-4">
                <span className="font-black text-slate-800">{card.title}</span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className={cn("text-2xl font-black", `text-${card.color}-500`)}>{card.value}</span>
                <span className={cn("text-xs font-bold", `text-${card.color}-400`)}>{card.sub}</span>
              </div>
              <div className={cn("h-1.5 w-full bg-slate-100 rounded-full mt-4 overflow-hidden")}>
                <div className={cn("h-full rounded-full", `bg-${card.color}-500`)} style={{ width: card.sub.split(' ')[1] }} />
              </div>
              {card.badge && (
                <span className="absolute top-6 right-10 bg-purple-600 text-white text-[8px] px-1.5 py-0.5 rounded font-black">{card.badge}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 底部明细表格 */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
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
                  <td className="px-4 py-4 text-center text-xs font-black text-emerald-600">{row.effectiveRate}%</td>
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
